import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAlumni = () => {
    
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      if (!clubId) return [];
      
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
                .eq('is_active', true)
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data;
    },
      });
};
