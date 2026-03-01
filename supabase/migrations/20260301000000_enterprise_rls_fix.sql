-- ============================================================
-- Enterprise Content RLS Fix Migration
-- Date: 2026-03-01
-- Problem: The enterprise content tables (homepage_sections,
--   seo_settings, organization_settings, services, projects,
--   testimonials, team_members, blog_posts, inquiries) were
--   migrated from the old SaaS schema but either have NO write
--   policies or have policies that only cover club_admins, not
--   the single-org super_admin role.
--
-- Fix: Add comprehensive admin-write + public-read policies
--   using is_any_club_admin() which already includes
--   is_super_admin() per migration 20260213051623.
-- ============================================================

-- -------------------------------------------------------
-- 1. HOMEPAGE SECTIONS
-- -------------------------------------------------------
DO $$
BEGIN
  -- Drop old conflicting policies if they exist
  DROP POLICY IF EXISTS "Admins can manage homepage sections" ON public.homepage_sections;
  DROP POLICY IF EXISTS "Public can view active homepage sections" ON public.homepage_sections;
  DROP POLICY IF EXISTS "Anyone can read homepage sections" ON public.homepage_sections;
END $$;

-- Public can read active sections
CREATE POLICY "Public can view active homepage sections"
ON public.homepage_sections FOR SELECT
USING (is_active = true OR public.is_any_club_admin());

-- Admins (including super_admin) can do everything
CREATE POLICY "Admins can manage homepage sections"
ON public.homepage_sections FOR ALL
USING (public.is_any_club_admin())
WITH CHECK (public.is_any_club_admin());

-- -------------------------------------------------------
-- 2. SEO SETTINGS
-- -------------------------------------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage seo settings" ON public.seo_settings;
  DROP POLICY IF EXISTS "Public can read seo settings" ON public.seo_settings;
  DROP POLICY IF EXISTS "Anyone can read seo settings" ON public.seo_settings;
END $$;

CREATE POLICY "Public can read seo settings"
ON public.seo_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage seo settings"
ON public.seo_settings FOR ALL
USING (public.is_any_club_admin())
WITH CHECK (public.is_any_club_admin());

-- -------------------------------------------------------
-- 3. ORGANIZATION SETTINGS
-- -------------------------------------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage organization settings" ON public.organization_settings;
  DROP POLICY IF EXISTS "Public can read organization settings" ON public.organization_settings;
  DROP POLICY IF EXISTS "Anyone can read organization settings" ON public.organization_settings;
END $$;

CREATE POLICY "Public can read organization settings"
ON public.organization_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage organization settings"
ON public.organization_settings FOR ALL
USING (public.is_any_club_admin())
WITH CHECK (public.is_any_club_admin());

-- -------------------------------------------------------
-- 4. SERVICES
-- -------------------------------------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
  DROP POLICY IF EXISTS "Public can read published services" ON public.services;
  DROP POLICY IF EXISTS "Anyone can read services" ON public.services;
END $$;

CREATE POLICY "Public can read published services"
ON public.services FOR SELECT
USING (status = 'published' OR public.is_any_club_admin());

CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
USING (public.is_any_club_admin())
WITH CHECK (public.is_any_club_admin());

-- -------------------------------------------------------
-- 5. PROJECTS
-- -------------------------------------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
  DROP POLICY IF EXISTS "Public can read published projects" ON public.projects;
  DROP POLICY IF EXISTS "Anyone can read projects" ON public.projects;
END $$;

CREATE POLICY "Public can read published projects"
ON public.projects FOR SELECT
USING (status = 'published' OR public.is_any_club_admin());

CREATE POLICY "Admins can manage projects"
ON public.projects FOR ALL
USING (public.is_any_club_admin())
WITH CHECK (public.is_any_club_admin());

-- -------------------------------------------------------
-- 6. TESTIMONIALS
-- -------------------------------------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
  DROP POLICY IF EXISTS "Public can read published testimonials" ON public.testimonials;
  DROP POLICY IF EXISTS "Anyone can read testimonials" ON public.testimonials;
END $$;

CREATE POLICY "Public can read published testimonials"
ON public.testimonials FOR SELECT
USING (status = 'published' OR public.is_any_club_admin());

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
USING (public.is_any_club_admin())
WITH CHECK (public.is_any_club_admin());

-- -------------------------------------------------------
-- 7. BLOG POSTS
-- -------------------------------------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
  DROP POLICY IF EXISTS "Public can read published blog posts" ON public.blog_posts;
  DROP POLICY IF EXISTS "Anyone can read blog posts" ON public.blog_posts;
END $$;

CREATE POLICY "Public can read published blog posts"
ON public.blog_posts FOR SELECT
USING (status = 'published' OR public.is_any_club_admin());

CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts FOR ALL
USING (public.is_any_club_admin())
WITH CHECK (public.is_any_club_admin());

-- -------------------------------------------------------
-- 8. INQUIRIES (contact form submissions)
-- -------------------------------------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
  DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.inquiries;
  DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
END $$;

-- Anyone can submit (no auth required for contact form)
CREATE POLICY "Anyone can submit inquiries"
ON public.inquiries FOR INSERT
WITH CHECK (true);

-- Only admins can read submissions
CREATE POLICY "Admins can view inquiries"
ON public.inquiries FOR SELECT
USING (public.is_any_club_admin());

-- Admins can also update (mark as read)
CREATE POLICY "Admins can update inquiries"
ON public.inquiries FOR UPDATE
USING (public.is_any_club_admin())
WITH CHECK (public.is_any_club_admin());

-- -------------------------------------------------------
-- 9. USER ROLES (needed for is_super_admin() function)
-- -------------------------------------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can read user roles" ON public.user_roles;
END $$;

CREATE POLICY "Admins can read user roles"
ON public.user_roles FOR SELECT
USING (public.is_any_club_admin() OR auth.uid() = user_id);
