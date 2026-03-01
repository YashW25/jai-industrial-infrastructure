-- ============================================================================
-- COMPLETE SUPABASE SETUP MIGRATION
-- Club Website Management System with Multi-Tenant Architecture
-- ============================================================================

-- ============================================================================
-- PART 1: ENUMS AND CORE TYPES
-- ============================================================================

-- Admin role enum
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'editor');

-- App role enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'teacher', 'student');

-- ============================================================================
-- PART 2: CORE TABLES
-- ============================================================================

-- Clubs table (Multi-tenant master table)
CREATE TABLE public.clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  full_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  college_name text NOT NULL,

-- Branding
logo_url text,
primary_color text DEFAULT '#3b82f6',
secondary_color text DEFAULT '#f59e0b',
gradient_from text DEFAULT '#0f172a',
gradient_via text DEFAULT '#1e3a5f',
gradient_to text DEFAULT '#2563eb',

-- Contact
email text, phone text, address text, tagline text,

-- Social Links
facebook_url text,
instagram_url text,
linkedin_url text,
youtube_url text,
twitter_url text,

-- Domains
primary_domain text, staging_domain text,

-- Status
is_active boolean DEFAULT true,
  is_suspended boolean DEFAULT false,
  suspension_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site settings table (deprecated but kept for compatibility)
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_name TEXT NOT NULL DEFAULT 'CESA',
    club_full_name TEXT NOT NULL DEFAULT 'Computer Engineering Students Association',
    college_name TEXT NOT NULL DEFAULT 'ISBM College of Engineering',
    logo_url TEXT,
    tagline TEXT DEFAULT 'Empowering future tech leaders through innovation, collaboration, and excellence in computer engineering education.',
    email TEXT DEFAULT 'cesa@isbmcoe.org',
    phone TEXT DEFAULT '+91 1234567890',
    address TEXT DEFAULT 'ISBM College of Engineering, Nande, Pune, Maharashtra 412115',
    facebook_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    youtube_url TEXT,
    twitter_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT now(),
        UNIQUE (user_id, role)
);

-- Club admins junction table
CREATE TABLE public.club_admins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'admin' CHECK (role IN ('admin', 'teacher')),
    is_primary boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    UNIQUE (club_id, user_id)
);

-- Admin profiles table (deprecated but kept for compatibility)
CREATE TABLE public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role admin_role DEFAULT 'editor',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles table
CREATE TABLE public.user_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL UNIQUE,
    club_id uuid REFERENCES public.clubs (id) ON DELETE SET NULL,
    full_name text NOT NULL,
    mobile text NOT NULL,
    enrollment_number text NOT NULL UNIQUE,
    year text NOT NULL,
    branch text NOT NULL,
    college text NOT NULL,
    avatar_url text,
    is_profile_complete boolean DEFAULT false,
    created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now()
);

-- ============================================================================
-- PART 3: CONTENT TABLES
-- ============================================================================

-- Announcements/Marquee table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Hero Slider table
CREATE TABLE public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT,
    button_link TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- About features table
CREATE TABLE public.about_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'star',
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Stats/Impact numbers table
CREATE TABLE public.stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT DEFAULT 'users',
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT DEFAULT 'technical',
    event_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location TEXT,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    actual_participants integer DEFAULT 0,
    entry_fee decimal(10, 2) DEFAULT 0,
    drive_folder_link text,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team categories table
CREATE TABLE public.team_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
    name text NOT NULL,
    label text NOT NULL,
    position integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now()
);

-- Team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'core',
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  skills TEXT[],
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery table
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    event_id UUID REFERENCES public.events (id) ON DELETE SET NULL,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quick links table
CREATE TABLE public.quick_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT DEFAULT 'quick_links',
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Partners table
CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Popup announcements table
CREATE TABLE public.popup_announcements (
    id UUID NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    link_text TEXT DEFAULT 'Register Now',
    is_active BOOLEAN DEFAULT true,
    position INTEGER DEFAULT 0,
    start_date TIMESTAMP
    WITH
        TIME ZONE,
        end_date TIMESTAMP
    WITH
        TIME ZONE,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT now()
);

-- Alumni table
CREATE TABLE public.alumni (
    id UUID NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    graduation_year TEXT NOT NULL,
    branch TEXT,
    company TEXT,
    job_title TEXT,
    image_url TEXT,
    linkedin_url TEXT,
    testimonial TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT now()
);

-- Charter settings table
CREATE TABLE public.charter_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    title text NOT NULL DEFAULT 'CESA Charter',
    description text,
    file_url text,
    drive_url text,
    file_type text DEFAULT 'pdf',
    updated_at timestamp
    with
        time zone DEFAULT now(),
        created_at timestamp
    with
        time zone DEFAULT now()
);

-- News table
CREATE TABLE public.news (
    id uuid NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    title text NOT NULL,
    content text,
    image_url text,
    attachment_url text,
    attachment_type text,
    published_date timestamp
    with
        time zone DEFAULT now(),
        expire_date timestamp
    with
        time zone,
        is_marquee boolean DEFAULT false,
        is_active boolean DEFAULT true,
        position integer DEFAULT 0,
        created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now()
);

-- Downloads table
CREATE TABLE public.downloads (
    id uuid NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
    club_id uuid REFERENCES public.clubs (id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    file_url text,
    drive_url text,
    file_type text DEFAULT 'pdf',
    file_size text,
    category text DEFAULT 'general',
    position integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now()
);

-- Occasions table
CREATE TABLE public.occasions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id UUID REFERENCES public.clubs (id),
    title TEXT NOT NULL,
    description TEXT,
    occasion_date DATE,
    category TEXT DEFAULT 'celebration',
    drive_folder_link TEXT,
    cover_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Visitor counter table
CREATE TABLE public.visitor_counter (
    id uuid NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
    count bigint NOT NULL DEFAULT 2300,
    updated_at timestamp
    with
        time zone DEFAULT now()
);

-- Contact submissions table
CREATE TABLE public.contact_submissions (
    id uuid NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'open',
    priority text NOT NULL DEFAULT 'medium',
    admin_notes text,
    created_at timestamp
    with
        time zone NOT NULL DEFAULT now(),
        updated_at timestamp
    with
        time zone NOT NULL DEFAULT now()
);

-- Navigation items table
CREATE TABLE public.custom_pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    content text DEFAULT '',
    meta_description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.nav_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    label text NOT NULL,
    href text NOT NULL DEFAULT '/',
    icon text DEFAULT 'FileText',
    parent_id uuid REFERENCES public.nav_items (id) ON DELETE CASCADE,
    page_type text NOT NULL DEFAULT 'built_in',
    custom_page_id uuid REFERENCES public.custom_pages (id) ON DELETE SET NULL,
    position integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 4: EVENT REGISTRATION & PAYMENT TABLES
-- ============================================================================

-- Event registrations table
CREATE TABLE public.event_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    event_id uuid REFERENCES public.events (id) ON DELETE CASCADE NOT NULL,
    registration_status text DEFAULT 'pending' CHECK (
        registration_status IN (
            'pending',
            'confirmed',
            'cancelled'
        )
    ),
    payment_status text DEFAULT 'pending' CHECK (
        payment_status IN (
            'pending',
            'paid',
            'failed',
            'refunded'
        )
    ),
    created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now(),
        UNIQUE (user_id, event_id)
);

-- Payments table
CREATE TABLE public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    event_registration_id uuid REFERENCES public.event_registrations (id) ON DELETE CASCADE,
    amount decimal(10, 2) NOT NULL,
    payment_method text NOT NULL CHECK (
        payment_method IN ('cashfree', 'manual', 'free')
    ),
    payment_status text DEFAULT 'pending' CHECK (
        payment_status IN (
            'pending',
            'completed',
            'failed',
            'refunded'
        )
    ),
    transaction_id text,
    payment_gateway_response jsonb,
    receipt_number text UNIQUE,
    verified_by uuid REFERENCES auth.users (id),
    verified_at timestamp
    with
        time zone,
        notes text,
        created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now()
);

-- Certificate templates table
CREATE TABLE public.certificate_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id uuid REFERENCES public.clubs (id),
    event_id uuid REFERENCES public.events (id),
    template_name text NOT NULL,
    template_url text NOT NULL,
    name_position_x integer DEFAULT 50,
    name_position_y integer DEFAULT 50,
    date_position_x integer DEFAULT 50,
    date_position_y integer DEFAULT 65,
    cert_number_position_x integer DEFAULT 85,
    cert_number_position_y integer DEFAULT 90,
    qr_position_x integer DEFAULT 10,
    qr_position_y integer DEFAULT 80,
    rank_position_x integer DEFAULT 50,
    rank_position_y integer DEFAULT 45,
    font_size integer DEFAULT 24,
    font_color text DEFAULT '#000000',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Certificates table
CREATE TABLE public.certificates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    event_id uuid REFERENCES public.events (id) ON DELETE CASCADE NOT NULL,
    template_id uuid REFERENCES public.certificate_templates (id),
    certificate_type text NOT NULL CHECK (
        certificate_type IN (
            'participation',
            'winner',
            'runner_up',
            'special'
        )
    ),
    certificate_url text,
    certificate_number text UNIQUE,
    rank text,
    issued_at timestamp
    with
        time zone DEFAULT now(),
        created_at timestamp
    with
        time zone DEFAULT now(),
        UNIQUE (
            user_id,
            event_id,
            certificate_type
        )
);

-- Event winners table
CREATE TABLE public.event_winners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    event_id uuid REFERENCES public.events (id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
    position integer NOT NULL CHECK (position >= 1),
    prize_details text,
    created_at timestamp
    with
        time zone DEFAULT now(),
        UNIQUE (event_id, user_id),
        UNIQUE (event_id, position)
);

-- ============================================================================
-- PART 5: INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_hero_slides_club_id ON public.hero_slides (club_id);

CREATE INDEX idx_announcements_club_id ON public.announcements (club_id);

CREATE INDEX idx_about_features_club_id ON public.about_features (club_id);

CREATE INDEX idx_stats_club_id ON public.stats (club_id);

CREATE INDEX idx_events_club_id ON public.events (club_id);

CREATE INDEX idx_team_members_club_id ON public.team_members (club_id);

CREATE INDEX idx_gallery_club_id ON public.gallery (club_id);

CREATE INDEX idx_partners_club_id ON public.partners (club_id);

CREATE INDEX idx_downloads_club_id ON public.downloads (club_id);

CREATE INDEX idx_news_club_id ON public.news (club_id);

CREATE INDEX idx_popup_announcements_club_id ON public.popup_announcements (club_id);

CREATE INDEX idx_quick_links_club_id ON public.quick_links (club_id);

CREATE INDEX idx_charter_settings_club_id ON public.charter_settings (club_id);

CREATE INDEX idx_alumni_club_id ON public.alumni (club_id);

CREATE INDEX idx_user_profiles_club_id ON public.user_profiles (club_id);

CREATE INDEX idx_club_admins_club_id ON public.club_admins (club_id);

CREATE INDEX idx_club_admins_user_id ON public.club_admins (user_id);

-- ============================================================================
-- PART 6: SECURITY FUNCTIONS
-- ============================================================================

-- Check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
$;

-- Check if user is admin (from user_roles)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'teacher')
  );
END;

$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Get all clubs a user is admin of
CREATE OR REPLACE FUNCTION public.get_user_clubs(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $
  SELECT club_id FROM public.club_admins WHERE user_id = _user_id
$;

-- Check if user is admin of a specific club
CREATE OR REPLACE FUNCTION public.is_club_admin(_club_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $
  SELECT EXISTS (
    SELECT 1 FROM public.club_admins 
    WHERE user_id = auth.uid() AND club_id = _club_id
  ) OR public.is_super_admin()
$;

-- Check if user is admin of ANY club
CREATE OR REPLACE FUNCTION public.is_any_club_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $
  SELECT EXISTS (
    SELECT 1 FROM public.club_admins 
    WHERE user_id = auth.uid()
  ) OR public.is_super_admin() OR public.is_admin()
$;

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$;

-- Get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$;

-- ============================================================================
-- PART 7: UTILITY FUNCTIONS
-- ============================================================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;

$;

-- Generate receipt number
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
BEGIN
  IF NEW.payment_status = 'completed' AND NEW.receipt_number IS NULL THEN
    NEW.receipt_number := 'CESA-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;

$;

-- Generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
BEGIN
  IF NEW.certificate_number IS NULL THEN
    NEW.certificate_number := 'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' || SUBSTRING(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;

$;

-- Auto-assign student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;

$;

-- Increment visitor count
CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
DECLARE
  new_count bigint;
BEGIN
  UPDATE public.visitor_counter
  SET count = count + 1, updated_at = now()
  WHERE id = (SELECT id FROM public.visitor_counter LIMIT 1)
  RETURNING count INTO new_count;
  RETURN new_count;
END;

$;

-- ============================================================================
-- PART 8: TRIGGERS
-- ============================================================================

-- Updated at triggers
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_features_updated_at BEFORE UPDATE ON public.about_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stats_updated_at BEFORE UPDATE ON public.stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_links_updated_at BEFORE UPDATE ON public.quick_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON public.admin_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON public.event_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_popup_announcements_updated_at BEFORE UPDATE ON public.popup_announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_updated_at BEFORE UPDATE ON public.alumni FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_charter_settings_updated_at BEFORE UPDATE ON public.charter_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_downloads_updated_at BEFORE UPDATE ON public.downloads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_occasions_updated_at BEFORE UPDATE ON public.occasions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON public.clubs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificate_templates_updated_at BEFORE UPDATE ON public.certificate_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_categories_updated_at BEFORE UPDATE ON public.team_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nav_items_updated_at BEFORE UPDATE ON public.nav_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_pages_updated_at BEFORE UPDATE ON public.custom_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Special triggers
CREATE TRIGGER generate_payment_receipt BEFORE INSERT OR UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION generate_receipt_number();

CREATE TRIGGER generate_cert_number BEFORE INSERT ON public.certificates FOR EACH ROW EXECUTE FUNCTION generate_certificate_number();

CREATE TRIGGER on_auth_user_created_role AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- ============================================================================
-- PART 9: ROW LEVEL SECURITY (RLS) - ENABLE
-- ============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.about_features ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.event_winners ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.club_admins ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.popup_announcements ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.charter_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.team_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.visitor_counter ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 10: ROW LEVEL SECURITY (RLS) - POLICIES
-- ============================================================================

-- Site settings policies
CREATE POLICY "Public can read site settings" ON public.site_settings FOR
SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (public.is_admin ());

-- Announcements policies
CREATE POLICY "Public can read active announcements" ON public.announcements FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Hero slides policies
CREATE POLICY "Public can read active hero slides" ON public.hero_slides FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage hero slides" ON public.hero_slides FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- About features policies
CREATE POLICY "Public can read active about features" ON public.about_features FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage about features" ON public.about_features FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Stats policies
CREATE POLICY "Public can read active stats" ON public.stats FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage stats" ON public.stats FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Events policies
CREATE POLICY "Public can read active events" ON public.events FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Team members policies
CREATE POLICY "Public can read active team members" ON public.team_members FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Gallery policies
CREATE POLICY "Public can read active gallery" ON public.gallery FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage gallery" ON public.gallery FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Quick links policies
CREATE POLICY "Public can read active quick links" ON public.quick_links FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage quick links" ON public.quick_links FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Partners policies
CREATE POLICY "Public can read active partners" ON public.partners FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage partners" ON public.partners FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Admin profiles policies
CREATE POLICY "Admins can view own profile" ON public.admin_profiles FOR
SELECT USING (id = auth.uid ());

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles FOR
SELECT USING (
        is_any_club_admin ()
        OR (auth.uid () = user_id)
    );

CREATE POLICY "Admins can update all profiles" ON public.user_profiles FOR
UPDATE USING (
    is_any_club_admin ()
    OR (auth.uid () = user_id)
);

CREATE POLICY "Admins can delete profiles" ON public.user_profiles FOR DELETE USING (is_any_club_admin ());

-- Event registrations policies
CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can register for events" ON public.event_registrations FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own registration" ON public.event_registrations FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Admins can manage registrations" ON public.event_registrations FOR ALL USING (is_admin ());

-- Payments policies
CREATE POLICY "Users can view own payments" ON public.payments FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can create payments" ON public.payments FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (is_admin ());

-- Certificates policies
CREATE POLICY "Users can view own certificates" ON public.certificates FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Admins can manage certificates" ON public.certificates FOR ALL USING (is_admin ());

-- Event winners policies
CREATE POLICY "Public can view winners" ON public.event_winners FOR
SELECT USING (true);

CREATE POLICY "Admins can manage winners" ON public.event_winners FOR ALL USING (is_admin ());

-- User roles policies
CREATE POLICY "Users can view own role" ON public.user_roles FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (
    public.has_role (auth.uid (), 'admin')
);

-- Clubs policies
CREATE POLICY "Public can read active clubs" ON public.clubs FOR
SELECT USING (is_active = true);

CREATE POLICY "Super admins can manage all clubs" ON public.clubs FOR ALL USING (public.is_super_admin ())
WITH
    CHECK (public.is_super_admin ());

CREATE POLICY "Club admins can update their own club" ON public.clubs FOR
UPDATE USING (is_club_admin (id))
WITH
    CHECK (is_club_admin (id));

-- Club admins policies
CREATE POLICY "Super admins can manage all club admins" ON public.club_admins FOR ALL USING (public.is_super_admin ())
WITH
    CHECK (public.is_super_admin ());

CREATE POLICY "Club admins can view their club's admins" ON public.club_admins FOR
SELECT USING (
        public.is_club_admin (club_id)
    );

-- Popup announcements policies
CREATE POLICY "Public can read active popups" ON public.popup_announcements FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage popups" ON public.popup_announcements FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Alumni policies
CREATE POLICY "Public can read active alumni" ON public.alumni FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage alumni" ON public.alumni FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Charter settings policies
CREATE POLICY "Public can read charter" ON public.charter_settings FOR
SELECT USING (true);

CREATE POLICY "Admins can manage charter" ON public.charter_settings FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- News policies
CREATE POLICY "Public can read active news" ON public.news FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage news" ON public.news FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Downloads policies
CREATE POLICY "Public can read active downloads" ON public.downloads FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage downloads" ON public.downloads FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Occasions policies
CREATE POLICY "Public can read active occasions" ON public.occasions FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage occasions" ON public.occasions FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Certificate templates policies
CREATE POLICY "Public can read active templates" ON public.certificate_templates FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage templates" ON public.certificate_templates FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Team categories policies
CREATE POLICY "Public can read active team categories" ON public.team_categories FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage team categories" ON public.team_categories FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Contact submissions policies
CREATE POLICY "Public can submit contact form" ON public.contact_submissions FOR
INSERT
WITH
    CHECK (true);

CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions FOR
SELECT USING (is_any_club_admin ());

CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions FOR
UPDATE USING (is_any_club_admin ());

CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions FOR DELETE USING (is_any_club_admin ());

-- Visitor counter policies
CREATE POLICY "Public can read visitor count" ON public.visitor_counter FOR
SELECT USING (true);

-- Nav items policies
CREATE POLICY "Public can read active nav items" ON public.nav_items FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage nav items" ON public.nav_items FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- Custom pages policies
CREATE POLICY "Public can read active custom pages" ON public.custom_pages FOR
SELECT USING (is_active = true);

CREATE POLICY "Admins can manage custom pages" ON public.custom_pages FOR ALL USING (is_any_club_admin ())
WITH
    CHECK (is_any_club_admin ());

-- ============================================================================
-- PART 11: STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, NULL, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view images" ON storage.objects FOR
SELECT USING (bucket_id = 'images');

CREATE POLICY "Admins can upload images" ON storage.objects FOR
INSERT
WITH
    CHECK (
        bucket_id = 'images'
        AND public.is_admin ()
    );

CREATE POLICY "Admins can update images" ON storage.objects FOR
UPDATE USING (
    bucket_id = 'images'
    AND public.is_admin ()
);

CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE USING (
    bucket_id = 'images'
    AND public.is_admin ()
);

-- ============================================================================
-- PART 12: DEFAULT DATA
-- ============================================================================

-- Insert default site settings
INSERT INTO
    public.site_settings (
        club_name,
        club_full_name,
        college_name,
        tagline,
        email,
        phone,
        address
    )
VALUES (
        'CESA',
        'Computer Engineering Students Association',
        'ISBM College of Engineering',
        'Empowering future tech leaders through innovation, collaboration, and excellence in computer engineering education.',
        'cesa@isbmcoe.org',
        '+91 1234567890',
        'ISBM College of Engineering, Nande, Pune, Maharashtra 412115'
    );

-- Insert default announcements
INSERT INTO
    public.announcements (content, position)
VALUES (
        '🎉 Welcome to CESA - Computer Engineering Students Association!',
        1
    ),
    (
        '📢 Upcoming Event: CodeStorm 2.0 - Annual Coding Competition',
        2
    ),
    (
        '🏆 CESA awarded Best Technical Club 2024',
        3
    );

-- Insert default stats
INSERT INTO
    public.stats (label, value, icon, position)
VALUES (
        'Active Members',
        '500+',
        'users',
        1
    ),
    (
        'Events Organized',
        '50+',
        'calendar',
        2
    ),
    (
        'Certificates Issued',
        '1000+',
        'award',
        3
    ),
    (
        'Industry Partners',
        '10+',
        'building',
        4
    );

-- Insert default about features
INSERT INTO
    public.about_features (
        title,
        description,
        icon,
        position
    )
VALUES (
        'NAAC B++ Accredited',
        'Highest quality standards achieved',
        'award',
        1
    ),
    (
        'Expert Faculty',
        'Industry experienced professors',
        'graduation-cap',
        2
    ),
    (
        'Extended Library Hours',
        'Pioneer in 24/7 library access',
        'book-open',
        3
    ),
    (
        'Industry Partnerships',
        'MOUs with leading companies',
        'handshake',
        4
    ),
    (
        'Project Based Learning',
        'Live projects with industry',
        'code',
        5
    ),
    (
        'Career Growth',
        'Comprehensive placement training',
        'trending-up',
        6
    );

-- Insert default team members
INSERT INTO public.team_members (name, role, description, category, skills, position) VALUES 
('Dr. Vilas R. Joshi', 'Faculty Coordinator', 'Associate Professor & CESA Faculty Coordinator', 'faculty', ARRAY['Leadership', 'Research', 'Mentoring'], 1),
('Vedanth Bakwad', 'President', 'Student leader and president of CESA', 'core', ARRAY['Leadership', 'Management', 'Communication'], 2),
('Gaurav Singh', 'Vice President', 'Vice President of CESA', 'core', ARRAY['Leadership', 'Event Management', 'Teamwork'], 3),
('Anuj Gurap', 'Technical Head', 'Technical lead responsible for all technical activities', 'technical', ARRAY['Programming', 'Web Development', 'System Design'], 4),
('Shreeyash Mandage', 'Media Head', 'Media head responsible for all media and design activities', 'media', ARRAY['Design', 'Photography', 'Video Editing'], 5);

-- Insert default quick links
INSERT INTO
    public.quick_links (
        title,
        url,
        category,
        position
    )
VALUES ('Home', '/', 'quick_links', 1),
    (
        'About Us',
        '/about',
        'quick_links',
        2
    ),
    (
        'Events',
        '/events',
        'quick_links',
        3
    ),
    (
        'Team',
        '/team',
        'quick_links',
        4
    ),
    (
        'Gallery',
        '/gallery',
        'quick_links',
        5
    ),
    (
        'CESA Charter',
        '#',
        'resources',
        1
    ),
    (
        'Student Portal',
        '#',
        'resources',
        2
    ),
    (
        'Downloads',
        '#',
        'resources',
        3
    ),
    ('FAQs', '#', 'resources', 4);

-- Insert default team categories
INSERT INTO
    public.team_categories (name, label, position)
VALUES (
        'faculty',
        'Faculty Coordinator',
        0
    ),
    ('core', 'Core Team', 1),
    (
        'technical',
        'Technical Team',
        2
    ),
    ('media', 'Media Team', 3),
    (
        'cultural',
        'Cultural Team',
        4
    ),
    ('sports', 'Sports Team', 5);

-- Insert initial visitor count
INSERT INTO public.visitor_counter (count) VALUES (2300);

-- Insert default charter settings
INSERT INTO
    public.charter_settings (title, description)
VALUES (
        'CESA Charter',
        'Official CESA Charter Document'
    );

-- Insert default navigation items
INSERT INTO
    public.nav_items (
        label,
        href,
        icon,
        parent_id,
        page_type,
        position
    )
VALUES (
        'Home',
        '/',
        'Home',
        NULL,
        'built_in',
        0
    ),
    (
        'About Us',
        '#',
        'Info',
        NULL,
        'built_in',
        1
    ),
    (
        'Events',
        '/events',
        'Calendar',
        NULL,
        'built_in',
        3
    ),
    (
        'Team',
        '/team',
        'Users',
        NULL,
        'built_in',
        4
    ),
    (
        'Gallery',
        '/gallery',
        'Image',
        NULL,
        'built_in',
        5
    ),
    (
        'Download',
        '#',
        'Download',
        NULL,
        'built_in',
        6
    ),
    (
        'Contact Us',
        '/contact',
        'Phone',
        NULL,
        'built_in',
        8
    );

-- Insert children for About Us
INSERT INTO
    public.nav_items (
        label,
        href,
        icon,
        parent_id,
        page_type,
        position
    )
SELECT 'About Club', '/about', 'Info', id, 'built_in', 0
FROM public.nav_items
WHERE
    label = 'About Us'
    AND parent_id IS NULL;

INSERT INTO
    public.nav_items (
        label,
        href,
        icon,
        parent_id,
        page_type,
        position
    )
SELECT 'Our Partners', '/partners', 'Handshake', id, 'built_in', 1
FROM public.nav_items
WHERE
    label = 'About Us'
    AND parent_id IS NULL;

-- Insert children for Download
INSERT INTO
    public.nav_items (
        label,
        href,
        icon,
        parent_id,
        page_type,
        position
    )
SELECT 'Certificates', '/certificates', 'Award', id, 'built_in', 0
FROM public.nav_items
WHERE
    label = 'Download'
    AND parent_id IS NULL;

INSERT INTO
    public.nav_items (
        label,
        href,
        icon,
        parent_id,
        page_type,
        position
    )
SELECT 'Charter', '/charter', 'FileText', id, 'built_in', 1
FROM public.nav_items
WHERE
    label = 'Download'
    AND parent_id IS NULL;

INSERT INTO
    public.nav_items (
        label,
        href,
        icon,
        parent_id,
        page_type,
        position
    )
SELECT 'Notice', '/notice', 'Bell', id, 'built_in', 2
FROM public.nav_items
WHERE
    label = 'Download'
    AND parent_id IS NULL;

INSERT INTO
    public.nav_items (
        label,
        href,
        icon,
        parent_id,
        page_type,
        position
    )
SELECT 'Downloads', '/downloads', 'Download', id, 'built_in', 3
FROM public.nav_items
WHERE
    label = 'Download'
    AND parent_id IS NULL;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================