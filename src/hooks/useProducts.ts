import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price_inr: number | null;
    price_usd: number | null;
    status: string;
    position: number;
    created_at: string;
    product_images?: { image_url: string }[];
}

export interface ProductEnquiry {
    id: string;
    product_id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    country: string | null;
    message: string | null;
    is_read: boolean;
    created_at: string;
}

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('products')
                .select('*, product_images(image_url)')
                .eq('status', 'published')
                .order('position', { ascending: true });
            if (error) throw error;
            return (data || []) as Product[];
        },
    });
}

export function useAllProducts() {
    return useQuery({
        queryKey: ['products-all'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('products')
                .select('*, product_images(image_url)')
                .order('position', { ascending: true });
            if (error) throw error;
            return (data || []) as Product[];
        },
    });
}

export function useProductBySlug(slug: string) {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('products')
                .select('*, product_images(image_url)')
                .eq('slug', slug)
                .single();
            if (error) throw error;
            return data as Product;
        },
        enabled: !!slug,
    });
}

export function useProductEnquiries() {
    return useQuery({
        queryKey: ['product-enquiries'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('product_enquiries')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return (data || []) as ProductEnquiry[];
        },
    });
}

/** Format price based on user locale */
export function formatPrice(priceInr: number | null, priceUsd: number | null): string {
    const isIndian = navigator.language.startsWith('en-IN') ||
        navigator.language === 'hi' ||
        Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Calcutta';

    if (isIndian && priceInr) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceInr);
    }
    if (priceUsd) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(priceUsd);
    }
    return 'Contact for price';
}
