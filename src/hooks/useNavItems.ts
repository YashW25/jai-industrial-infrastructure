import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type NavItem = {
  id: string;
  club_id?: string | null;
  label: string;
  href: string;
  icon: string | null;
  parent_id: string | null;
  page_type: string;
  custom_page_id: string | null;
  position: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  children?: NavItem[];
};

export function useNavItems() {
  return useQuery({
    queryKey: ['nav-items'],
    queryFn: async () => {
      // nav_items table not present in current schema — fall back to defaults
      return [] as NavItem[];
    },
  });
}

export function useAllNavItems() {
  return useQuery({
    queryKey: ['nav-items-all'],
    queryFn: async () => {
      // nav_items table not present in current schema — fall back to defaults
      return [] as NavItem[];
    },
  });
}

// Default nav items shown when nav_items table is empty (e.g. cloned projects)
const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: 'def-home', label: 'Home', href: '/', icon: 'Home', parent_id: null, page_type: 'built_in', custom_page_id: null, position: 0, is_active: true, created_at: null, updated_at: null },
  { id: 'def-about', label: 'About', href: '/about', icon: 'Info', parent_id: null, page_type: 'built_in', custom_page_id: null, position: 1, is_active: true, created_at: null, updated_at: null },
  { id: 'def-services', label: 'Services', href: '/services', icon: 'Layers', parent_id: null, page_type: 'built_in', custom_page_id: null, position: 2, is_active: true, created_at: null, updated_at: null },
  { id: 'def-products', label: 'Products', href: '/products', icon: 'Package', parent_id: null, page_type: 'built_in', custom_page_id: null, position: 3, is_active: true, created_at: null, updated_at: null },
  { id: 'def-projects', label: 'Projects', href: '/projects', icon: 'Briefcase', parent_id: null, page_type: 'built_in', custom_page_id: null, position: 4, is_active: true, created_at: null, updated_at: null },
  { id: 'def-blog', label: 'Blog', href: '/blog', icon: 'Newspaper', parent_id: null, page_type: 'built_in', custom_page_id: null, position: 5, is_active: true, created_at: null, updated_at: null },
  { id: 'def-contact', label: 'Contact', href: '/contact', icon: 'Phone', parent_id: null, page_type: 'built_in', custom_page_id: null, position: 6, is_active: true, created_at: null, updated_at: null },
];

export function useNavItemsTree() {
  const { data: items, ...rest } = useNavItems();

  // Use default items if database has no nav items
  const source = items && items.length > 0 ? items : DEFAULT_NAV_ITEMS;

  const tree = source
    .filter((i) => !i.parent_id)
    .map((parent) => ({
      ...parent,
      children: source.filter((c) => c.parent_id === parent.id),
    }));

  return { data: tree, ...rest };
}

export function useNavItemMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['nav-items'] });
    qc.invalidateQueries({ queryKey: ['nav-items-all'] });
  };

  // nav_items table not present in current schema — mutations are no-ops
  const upsert = useMutation({
    mutationFn: async (_item: Partial<NavItem> & { id?: string }) => {
      toast.info('Nav item management is not available in this deployment.');
    },
    onSuccess: () => { invalidate(); },
  });

  const remove = useMutation({
    mutationFn: async (_id: string) => {
      toast.info('Nav item management is not available in this deployment.');
    },
    onSuccess: () => { invalidate(); },
  });

  return { upsert, remove };
}
