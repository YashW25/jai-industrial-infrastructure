import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Club, AppRole } from '@/types/database';

// Fetch all clubs (for super admin)
export const useAllClubs = () => {
  return useQuery({
    queryKey: ['all-clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Club[];
    },
  });
};

// Fetch admins mapped in user_roles for a specific club
export const useClubAdmins = (clubId?: string) => {
    const targetClubId = clubId || currentClubId;

  return useQuery({
    queryKey: ['club-admins', targetClubId],
    queryFn: async () => {
      if (!targetClubId) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          user_profiles!inner(full_name, email:user_id)
        `)
        .eq('club_id', targetClubId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!targetClubId,
  });
};

// Check if current user is admin of current club
export const useIsClubAdmin = () => {
  
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      if (!clubId) return false;

      const { data, error } = await supabase.rpc('is_club_admin', { _});

      if (error) {
        console.error('Error checking club admin status:', error);
        return false;
      }
      return data as boolean;
    },
      });
};

// Check if current user is super admin
export const useIsSuperAdmin = () => {
  return useQuery({
    queryKey: ['is-super-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_super_admin');

      if (error) {
        console.error('Error checking super admin status:', error);
        return false;
      }
      return data as boolean;
    },
  });
};

// Get clubs that current user is admin of
export const useUserClubs = () => {
  return useQuery({
    queryKey: ['user-clubs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          club_id,
          role,
          clubs (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });
};

// Create a new club (super admin only)
export const useCreateClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (club: Omit<Club, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('clubs')
        .insert(club)
        .select()
        .single();

      if (error) throw error;
      return data as Club;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-clubs'] });
      toast.success('Club created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create club: ${error.message}`);
    },
  });
};

// Update a club (super admin only)
export const useUpdateClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Club>) => {
      const { data, error } = await supabase
        .from('clubs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Club;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-clubs'] });
      toast.success('Club updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update club: ${error.message}`);
    },
  });
};

// Delete a club (super admin only)
export const useDeleteClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clubs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-clubs'] });
      toast.success('Club deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete club: ${error.message}`);
    },
  });
};

// Add club admin
export const useAddClubAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (admin: { user_id: string; club_id: string; role: AppRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert(admin)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-admins'] });
      toast.success('Admin role added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add admin role: ${error.message}`);
    },
  });
};

// Remove club admin role
export const useRemoveClubAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-admins'] });
      toast.success('Admin role removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove admin role: ${error.message}`);
    },
  });
};
