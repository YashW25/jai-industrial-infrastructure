import type { Database } from '@/integrations/supabase/types';

export type OrganizationSettings = Database['public']['Tables']['organization_settings']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type GalleryItem = Database['public']['Tables']['gallery']['Row'];
export type Download = Database['public']['Tables']['downloads']['Row'];
export type Inquiry = Database['public']['Tables']['inquiries']['Row'];
export type HomepageSection = Database['public']['Tables']['homepage_sections']['Row'];
export type SeoSettings = Database['public']['Tables']['seo_settings']['Row'];

export type AppRole = 'super_admin' | 'admin' | 'editor' | 'user';
export type ContentStatus = 'draft' | 'published' | 'archived';

// Backwards compatibility mappings for older components until Refactor Phase 3 & 6 completes:
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string;
  enrollment_number: string;
  year: string;
  branch: string;
  college: string;
  avatar_url: string | null;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  content: string;
  is_active: boolean;
  position: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  position: number;
  is_active: boolean;
}

export interface AboutFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  position: number;
  is_active: boolean;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
  position: number;
  is_active: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  event_date: string;
  end_date: string | null;
  location: string | null;
  max_participants: number | null;
  current_participants: number;
  image_url: string | null;
  entry_fee: number;
  is_active: boolean;
  is_completed: boolean;
  status?: ContentStatus;
  drive_folder_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  position: number;
  is_active: boolean;
}

export interface Occasion {
  id: string;
  title: string;
  description: string | null;
  date: string;
  image_url: string | null;
  category: string;
  position: number;
  is_active: boolean;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'super_admin' | 'admin' | 'editor';
  is_active: boolean;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  background_url: string;
  config: Record<string, any>;
  is_active: boolean;
}

export interface Certificate {
  id: string;
  user_id: string;
  event_id: string;
  certificate_url: string;
  certificate_number: string;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  category: string;
  position: number;
  is_active: boolean;
}
