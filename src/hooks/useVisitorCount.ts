import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorCount = () => {
  // Visitor count tracking disabled in the current multi-tenant architecture
  const [count, setCount] = useState<number | null>(null);
  return count;
};
