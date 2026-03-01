import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logAdminAction } from '@/utils/auditLogger';

// Helper for invalidation
const useInvalidator = () => {
  const queryClient = useQueryClient();
  return (queryKey: string[], message: string) => {
    queryClient.invalidateQueries({ queryKey });
    toast.success(message);
  };
};

const handleError = (error: any, fallbackMessage: string) => {
  console.error('Mutation error:', error);
  toast.error(error.message || fallbackMessage);
  throw error;
};

// Soft-delete helper — sets deleted_at timestamp (column added by enterprise_hardening migration)
const softDelete = async (table: string, id: string) => {
  const { error } = await supabase
    .from(table as any)
    .update({ deleted_at: new Date().toISOString() } as any)
    .eq('id', id);
  if (error) throw error;
  await logAdminAction('DELETE', table, id);
};

// Organization Settings
export const useUpdateOrganizationSettings = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('organization_settings').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'organization_settings', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['organization_settings'], 'Settings updated successfully'),
    onError: (err) => handleError(err, 'Failed to update settings'),
  });
};

// Services
export const useUpsertService = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('services').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'services', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['services'], 'Service saved successfully'),
    onError: (err) => handleError(err, 'Failed to save service'),
  });
};

export const useDeleteService = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (id: string) => softDelete('services', id),
    onSuccess: () => invalidate(['services'], 'Service deleted successfully'),
    onError: (err) => handleError(err, 'Failed to delete service'),
  });
};

// Projects
export const useUpsertProject = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('projects').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'projects', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['projects'], 'Project saved successfully'),
    onError: (err) => handleError(err, 'Failed to save project'),
  });
};

export const useDeleteProject = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (id: string) => softDelete('projects', id),
    onSuccess: () => invalidate(['projects'], 'Project deleted successfully'),
    onError: (err) => handleError(err, 'Failed to delete project'),
  });
};

// Testimonials
export const useUpsertTestimonial = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('testimonials').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'testimonials', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['testimonials'], 'Testimonial saved successfully'),
    onError: (err) => handleError(err, 'Failed to save testimonial'),
  });
};

export const useDeleteTestimonial = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (id: string) => softDelete('testimonials', id),
    onSuccess: () => invalidate(['testimonials'], 'Testimonial deleted successfully'),
    onError: (err) => handleError(err, 'Failed to delete testimonial'),
  });
};

// Team Members
export const useUpsertTeamMember = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('team_members').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'team_members', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['team_members'], 'Team member saved successfully'),
    onError: (err) => handleError(err, 'Failed to save team member'),
  });
};

export const useDeleteTeamMember = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (id: string) => softDelete('team_members', id),
    onSuccess: () => invalidate(['team_members'], 'Team member deleted successfully'),
    onError: (err) => handleError(err, 'Failed to delete team member'),
  });
};

// Blog Posts
export const useUpsertBlogPost = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('blog_posts').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'blog_posts', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['blog_posts'], 'Blog post saved successfully'),
    onError: (err) => handleError(err, 'Failed to save blog post'),
  });
};

export const useDeleteBlogPost = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (id: string) => softDelete('blog_posts', id),
    onSuccess: () => invalidate(['blog_posts'], 'Blog post deleted successfully'),
    onError: (err) => handleError(err, 'Failed to delete blog post'),
  });
};

// Gallery
export const useUpsertGalleryItem = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('gallery').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'gallery', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['gallery'], 'Gallery item saved successfully'),
    onError: (err) => handleError(err, 'Failed to save gallery item'),
  });
};

export const useDeleteGalleryItem = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (id: string) => softDelete('gallery', id),
    onSuccess: () => invalidate(['gallery'], 'Gallery item deleted successfully'),
    onError: (err) => handleError(err, 'Failed to delete gallery item'),
  });
};

// Downloads
export const useUpsertDownload = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('downloads').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'downloads', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['downloads'], 'Download saved successfully'),
    onError: (err) => handleError(err, 'Failed to save download'),
  });
};

export const useDeleteDownload = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (id: string) => softDelete('downloads', id),
    onSuccess: () => invalidate(['downloads'], 'Download deleted successfully'),
    onError: (err) => handleError(err, 'Failed to delete download'),
  });
};

// Homepage Sections
export const useUpsertHomepageSection = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('homepage_sections').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'homepage_sections', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['homepage_sections'], 'Homepage section saved successfully'),
    onError: (err) => handleError(err, 'Failed to save homepage section'),
  });
};

export const useDeleteHomepageSection = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (id: string) => softDelete('homepage_sections', id),
    onSuccess: () => invalidate(['homepage_sections'], 'Homepage section deleted successfully'),
    onError: (err) => handleError(err, 'Failed to delete homepage section'),
  });
};

// SEO Settings
export const useUpsertSeoSettings = () => {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('seo_settings').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', 'seo_settings', data.id, null, data);
      return data;
    },
    onSuccess: () => invalidate(['seo_settings'], 'SEO settings saved successfully'),
    onError: (err) => handleError(err, 'Failed to save SEO settings'),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Generic CRUD helpers (used by GalleryPage and other legacy admin pages)
// These target tables that may not be in the strict generated types, so we
// cast to `any` to allow compilation while keeping logic intact.
// ─────────────────────────────────────────────────────────────────────────────

export const useAdminFetch = <T>(
  table: string,
  queryKey: string,
  orderColumn = 'created_at',
  ascending = false,
) => {
  return useQuery<T[]>({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await (supabase.from(table as any) as any)
        .select('*')
        .order(orderColumn, { ascending });
      if (error) throw error;
      return (data || []) as T[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAdminCreate = <T>(table: string, queryKey: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<T>) => {
      const { data, error } = await (supabase.from(table as any) as any).insert(payload).select().single();
      if (error) throw error;
      return data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success('Record created successfully');
    },
    onError: (err: any) => handleError(err, 'Failed to create record'),
  });
};

export const useAdminUpdate = <T>(table: string, queryKey: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<T> & { id: string }) => {
      const { id, ...rest } = payload;
      const { data, error } = await (supabase.from(table as any) as any).update(rest).eq('id', id).select().single();
      if (error) throw error;
      return data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success('Record updated successfully');
    },
    onError: (err: any) => handleError(err, 'Failed to update record'),
  });
};

export const useAdminDelete = (table: string, queryKey: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from(table as any) as any).delete().eq('id', id);
      if (error) throw error;
      await logAdminAction('DELETE', table, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success('Record deleted successfully');
    },
    onError: (err: any) => handleError(err, 'Failed to delete record'),
  });
};

