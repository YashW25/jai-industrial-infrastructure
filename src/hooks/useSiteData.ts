import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const useOrganizationSettings = () => {
  return useQuery({
    queryKey: ['organization_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('organization_settings').select('*').limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').eq('status', 'published').order('position');
      if (error) throw error;
      return data || [];
    },
    ...QUERY_CONFIG,
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('status', 'published').order('position');
      if (error) throw error;
      return data || [];
    },
    ...QUERY_CONFIG,
  });
};

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase.from('testimonials').select('*').eq('status', 'published').order('position');
      if (error) throw error;
      return data || [];
    },
    ...QUERY_CONFIG,
  });
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('team_members').select('*').eq('status', 'published').order('position');
      if (error) throw error;
      return data || [];
    },
    ...QUERY_CONFIG,
  });
};

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('status', 'published').order('published_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    ...QUERY_CONFIG,
  });
};

export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase.from('gallery').select('*').eq('status', 'published').order('position');
      if (error) throw error;
      return data || [];
    },
    ...QUERY_CONFIG,
  });
};

export const useDownloads = (isPrivate = false) => {
  return useQuery({
    queryKey: ['downloads', isPrivate],
    queryFn: async () => {
      let query = supabase.from('downloads').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (!isPrivate) {
        query = query.eq('is_private', false);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    ...QUERY_CONFIG,
  });
};

export const useHomepageSections = () => {
  return useQuery({
    queryKey: ['homepage_sections'],
    queryFn: async () => {
      const { data, error } = await supabase.from('homepage_sections').select('*').eq('is_active', true);
      if (error) throw error;
      return data || [];
    },
    ...QUERY_CONFIG,
  });
};

export const useSeoSettings = (pagePath: string) => {
  return useQuery({
    queryKey: ['seo_settings', pagePath],
    queryFn: async () => {
      const { data, error } = await supabase.from('seo_settings').select('*').eq('page_path', pagePath).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!pagePath,
    ...QUERY_CONFIG,
  });
};

// Backward-compat stub – quick_links table was removed in the enterprise schema rebuild.
// Footer will render nothing for this section until the table is restored or links are hard-coded.
export const useQuickLinks = (_category?: string) => {
  return { data: [] as Array<{ id: string; title: string; url: string }>, isLoading: false };
};

export const useInquiries = () => {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    ...QUERY_CONFIG,
  });
};
