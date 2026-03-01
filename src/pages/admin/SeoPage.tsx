import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Loader2, Globe, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSeoSettings } from '@/hooks/useSiteData';
import { useUpsertSeoSettings } from '@/hooks/useAdminData';
import type { SeoSettings } from '@/types/database';

const PAGES = [
    { path: '/', label: 'Home Page (/)' },
    { path: '/about', label: 'About (/about)' },
    { path: '/services', label: 'Services (/services)' },
    { path: '/projects', label: 'Projects (/projects)' },
    { path: '/blog', label: 'Blog (/blog)' },
    { path: '/contact', label: 'Contact (/contact)' },
];

type SeoFormData = {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    og_image: string;
};

export default function SeoPage() {
    const [selectedPage, setSelectedPage] = useState('/');
    const { data: seoSettings, isLoading } = useSeoSettings(selectedPage);
    const updateMutation = useUpsertSeoSettings();

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm<SeoFormData>();

    useEffect(() => {
        reset({
            meta_title: seoSettings?.meta_title || '',
            meta_description: seoSettings?.meta_description || '',
            meta_keywords: seoSettings?.meta_keywords || '',
            og_image: seoSettings?.og_image || '',
        });
    }, [seoSettings, selectedPage, reset]);

    const onSubmit = (data: SeoFormData) => {
        const payload: Partial<SeoSettings> = {
            ...(seoSettings?.id ? { id: seoSettings.id } : {}),
            page_path: selectedPage,
            meta_title: data.meta_title,
            meta_description: data.meta_description,
            meta_keywords: data.meta_keywords,
            og_image: data.og_image,
        };
        updateMutation.mutate(payload);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display">SEO Configuration</h1>
                    <p className="text-muted-foreground">Manage per-page Search Engine Optimization metadata</p>
                </div>
            </div>

            {/* Page Selector */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                    <Globe className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-xl font-semibold">Select Page to Configure</h2>
                </div>
                <div className="relative max-w-sm">
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="w-full appearance-none flex h-10 items-center justify-between rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {PAGES.map((p) => (
                            <option key={p.path} value={p.path}>{p.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {isLoading && <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading settings for {selectedPage}...</p>}
                {!isLoading && !seoSettings && (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                        No SEO settings found for <strong>{selectedPage}</strong>. Fill in the form below and save to create them.
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="p-6 rounded-xl bg-card border border-border space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                        <Search className="w-5 h-5 text-primary" />
                        <h2 className="font-display text-xl font-semibold">Metadata — {selectedPage}</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input id="meta_title" {...register('meta_title')} placeholder="Enterprise Solutions | Jai Industrial Infrastructure" />
                            <p className="text-xs text-muted-foreground">Shown in browser tab and search results. Aim for 50–60 characters.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <Textarea id="meta_description" {...register('meta_description')} rows={3} className="resize-none" placeholder="A brief summary of this page..." />
                            <p className="text-xs text-muted-foreground">Optimal length: 150–160 characters.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meta_keywords">Meta Keywords</Label>
                            <Input id="meta_keywords" {...register('meta_keywords')} placeholder="infrastructure, construction, enterprise, steel..." />
                            <p className="text-xs text-muted-foreground">Comma-separated keywords.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="og_image">OpenGraph Image URL (Social Share Banner)</Label>
                            <Input id="og_image" {...register('og_image')} placeholder="https://jaiindustrial.in/og-banner.jpg" />
                            <p className="text-xs text-muted-foreground">Shown when page is shared on LinkedIn, Twitter, Facebook. (1200×630px recommended)</p>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-6 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={!isDirty || updateMutation.isPending}
                        className="w-full sm:w-auto shadow-xl gap-2"
                    >
                        {updateMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Save SEO — {selectedPage}
                    </Button>
                </div>
            </form>
        </div>
    );
}
