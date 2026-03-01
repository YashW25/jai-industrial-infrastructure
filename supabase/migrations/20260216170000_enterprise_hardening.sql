-- Enterprise Hardening Migration
-- 1. Create audit_logs table
-- 2. Add log_admin_action RPC
-- 3. Add soft deletes (deleted_at) to core tables

-- 1. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and editors can view audit logs"
    ON public.audit_logs
    FOR SELECT
    USING (public.is_admin_or_editor());

-- 2. RPC Function for logging
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_action TEXT,
    p_table_name TEXT,
    p_record_id UUID DEFAULT NULL,
    p_old_data JSONB DEFAULT NULL,
    p_new_data JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data,
        ip_address,
        user_agent
    )
    SELECT
        auth.uid(),
        p_action,
        p_table_name,
        p_record_id,
        p_old_data,
        p_new_data,
        current_setting('request.headers', true)::jsonb->>'x-forwarded-for',
        current_setting('request.headers', true)::jsonb->>'user-agent';
EXCEPTION WHEN OTHERS THEN
    -- Silently ignore logging errors so as not to break the main application flow
    RAISE WARNING 'Audit log failed: %', SQLERRM;
END;
$$;

-- 3. Soft Deletes
-- Add deleted_at columns to core content tables
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.downloads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 4. Update RLS policies to filter out soft-deleted items for public users
-- (Admins and editors can still see them, or we can filter them out there too. For this enterprise app, we'll generally filter them.)

-- NOTE: If existing policies were 'status = 'published'', we should update them to also check deleted_at IS NULL.
-- Since we do not want to drop and recreate all policies blindly without knowing their exact names, 
-- we will handle soft deletes physically at the application query level via `.is('deleted_at', null)`,
-- OR rely on the fact that soft deleted items are practically ignored frontend.

-- To be absolutely secure, we can create a blanket read policy if needed, but managing the frontend queries is safer without dropping existing policies.
