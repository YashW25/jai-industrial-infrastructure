import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePartners = () => {
    
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      if (!clubId) return [];
      
      const { data, error } = await supabase
        .from('partners')
        .select('*')
                .eq('is_active', true)
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data;
    },
      });
};
