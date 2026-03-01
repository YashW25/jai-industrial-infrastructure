import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  HeroSlide,
  Announcement,
  AboutFeature,
  Stat,
  Event,
  TeamMember,
  GalleryItem,
  Partner,
  QuickLink
} from '@/types/database';

const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const useClubHeroSlides = () => {
  return useQuery({
    queryKey: ['hero_slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
    ...QUERY_CONFIG,
  });
};

export const useClubAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      // announcements table not present in current schema — return empty
      return [] as Announcement[];
    },
    ...QUERY_CONFIG,
  });
};

export const useClubAboutFeatures = () => {
  return useQuery({
    queryKey: ['about_features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_features')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data as AboutFeature[];
    },
    ...QUERY_CONFIG,
  });
};

export const useClubStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data as Stat[];
    },
    ...QUERY_CONFIG,
  });
};

export const useClubEvents = (past?: boolean) => {
  return useQuery({
    queryKey: ['events', past],
    queryFn: async () => {
      const now = new Date().toISOString();
      let query = supabase
        .from('events')
        .select('*')
        .eq('is_active', true)

      if (past === true) {
        query = query.lt('event_date', now).order('event_date', { ascending: false });
      } else if (past === false) {
        query = query.gte('event_date', now).order('event_date', { ascending: true });
      } else {
        query = query.order('event_date', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Event[];
    },
    ...QUERY_CONFIG,
  });
};

export const useClubTeamMembers = (category?: string) => {
  return useQuery({
    queryKey: ['team-members', category],
    queryFn: async () => {
      let query = supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('position', { ascending: true });

      const { data, error } = await query;
      if (error) throw error;
      return data as TeamMember[];
    },
    ...QUERY_CONFIG,
  });
};

export const useClubGallery = (category?: string) => {
  return useQuery({
    queryKey: ['gallery', category],
    queryFn: async () => {
      let query = supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('position', { ascending: true });

      const { data, error } = await query;
      if (error) throw error;
      return data as GalleryItem[];
    },
    ...QUERY_CONFIG,
  });
};

export const useClubPartners = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data as Partner[];
    },
    ...QUERY_CONFIG,
  });
};

export const useClubQuickLinks = (category?: string) => {
  return useQuery({
    queryKey: ['quick-links', category],
    queryFn: async () => {
      let query = supabase
        .from('quick_links')
        .select('*')
        .eq('is_active', true)

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('position', { ascending: true });

      const { data, error } = await query;
      if (error) throw error;
      return data as QuickLink[];
    },
    ...QUERY_CONFIG,
  });
};

export const useClubNews = (marqueeOnly?: boolean) => {
  return useQuery({
    queryKey: ['news', marqueeOnly],
    queryFn: async () => {
      let query = supabase
        .from('news')
        .select('*')
        .eq('is_active', true)

      if (marqueeOnly) {
        query = query.eq('is_marquee', true);
      }

      query = query.order('published_date', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useClubDownloads = () => {
  return useQuery({
    queryKey: ['downloads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('downloads')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useClubAlumni = () => {
  return useQuery({
    queryKey: ['alumni'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useClubCharter = () => {
  return useQuery({
    queryKey: ['charter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('charter_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useClubPopupAnnouncements = () => {
  return useQuery({
    queryKey: ['popup_announcements'],
    queryFn: async () => {
      // Popups disabled as they are not supported in the current schema
      return [] as any[];
    },
    ...QUERY_CONFIG,
  });
};
