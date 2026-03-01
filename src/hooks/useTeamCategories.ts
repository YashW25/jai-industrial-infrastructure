import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TeamCategory {
  id: string;
  club_id?: string | null;
  name: string;
  label: string;
  position: number;
  is_active: boolean;
}

export const useTeamCategories = () => {
    return useQuery({
    queryKey: [],
        queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('team_categories')
        .select('*')
                .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data as TeamCategory[];
    },
  });
};
