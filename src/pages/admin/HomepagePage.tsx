import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormModal } from '@/components/admin/FormModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { HomepageSection } from '@/types/database';

// Admin-specific: fetch ALL sections regardless of is_active
const useAllHomepageSections = () => {
    return useQuery({
        queryKey: ['homepage_sections_admin'],
        queryFn: async () => {
            const { data, error } = await supabase.from('homepage_sections').select('*').order('id');
            if (error) throw error;
            return data || [];
        },
        staleTime: 0,
    });
};

export default function HomepagePage() {
    const { data: sections = [], isLoading } = useAllHomepageSections();
    const queryClient = useQueryClient();

    const upsertMutation = useMutation({
        mutationFn: async (payload: Partial<HomepageSection>) => {
            const { data, error } = await supabase.from('homepage_sections').upsert(payload as any).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage_sections_admin'] });
            queryClient.invalidateQueries({ queryKey: ['homepage_sections'] });
            toast.success('Section saved successfully');
        },
        onError: (err: any) => toast.error(err.message || 'Failed to save section'),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('homepage_sections').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage_sections_admin'] });
            queryClient.invalidateQueries({ queryKey: ['homepage_sections'] });
            toast.success('Section deleted');
        },
        onError: (err: any) => toast.error(err.message || 'Failed to delete section'),
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

    const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<HomepageSection>>();

    const openModal = (section?: HomepageSection) => {
        if (section) {
            setEditingSection(section);
            reset(section);
        } else {
            setEditingSection(null);
            reset({
                section_identifier: 'hero',
                title: '',
                subtitle: '',
                content: '',
                image_url: '',
                cta_text: '',
                cta_link: '',
                is_active: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const onSubmit = (data: Partial<HomepageSection>) => {
        const payload = editingSection?.id ? { ...data, id: editingSection.id } : data;
        upsertMutation.mutate(payload, {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleToggleActive = (section: HomepageSection) => {
        upsertMutation.mutate({ id: section.id, is_active: !section.is_active });
    };

    if (isLoading) {
        return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    // Sort sections by identifier for cleaner display
    const sortedSections = [...sections].sort((a, b) => {
        const order = ['hero', 'about', 'about_preview', 'cta', 'custom'];
        return order.indexOf(a.section_identifier) - order.indexOf(b.section_identifier);
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display">Homepage Sections</h1>
                    <p className="text-muted-foreground">Manage the content blocks on your main landing page</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Section
                </Button>
            </div>

            <div className="grid gap-6">
                {sortedSections.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                        No homepage sections found. Add one to show on your landing page.
                    </div>
                ) : (
                    sortedSections.map((section) => (
                        <div key={section.id} className={`bg-card border ${section.is_active ? 'border-border' : 'border-dashed border-red-200 opacity-60'} rounded-xl p-5 flex flex-col md:flex-row gap-6 items-center shadow-sm`}>
                            <div className="w-full md:w-48 shrink-0">
                                {section.image_url ? (
                                    <img src={section.image_url} alt={section.title || ''} className="w-full h-32 object-cover rounded-lg border border-border" />
                                ) : (
                                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center border border-border">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                                        {section.section_identifier}
                                    </span>
                                    {!section.is_active && (
                                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                                            Hidden
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-xl truncate">{section.title || <span className="text-muted-foreground italic">No title</span>}</h3>
                                {section.subtitle && <p className="text-sm font-medium text-muted-foreground mb-2 truncate">{section.subtitle}</p>}
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{section.content}</p>
                                {section.cta_text && (
                                    <p className="text-xs text-primary mt-1">CTA: {section.cta_text} → {section.cta_link}</p>
                                )}
                            </div>
                            <div className="flex w-full md:w-auto md:flex-col justify-end gap-2 shrink-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleActive(section)}
                                    className="flex-1 md:flex-none gap-1"
                                    title={section.is_active ? 'Hide section' : 'Show section'}
                                >
                                    {section.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {section.is_active ? 'Hide' : 'Show'}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => openModal(section)} className="flex-1 md:flex-none">
                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDelete(section.id)} className="flex-1 md:flex-none text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <FormModal
                title={editingSection ? 'Edit Section' : 'Add Section'}
                open={isModalOpen}
                onClose={closeModal}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="section_identifier">Section Identifier</Label>
                            <select
                                id="section_identifier"
                                {...register('section_identifier', { required: true })}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="hero">hero — Hero / Top Banner</option>
                                <option value="about">about — About Section</option>
                                <option value="about_preview">about_preview — About Preview</option>
                                <option value="cta">cta — Call to Action</option>
                                <option value="custom">custom — Custom Layout</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Main Title</Label>
                        <Input id="title" {...register('title')} placeholder="E.g. Engineering the Future" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtitle / Tagline (Optional)</Label>
                        <Input id="subtitle" {...register('subtitle')} placeholder="Explore our award-winning services" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content Description</Label>
                        <Textarea id="content" {...register('content')} rows={4} className="resize-none" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cta_text">CTA Button Text (Optional)</Label>
                            <Input id="cta_text" {...register('cta_text')} placeholder="Get Started" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cta_link">CTA Button Link (Optional)</Label>
                            <Input id="cta_link" {...register('cta_link')} placeholder="/contact" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Background / Feature Image (Optional)</Label>
                        <ImageUpload
                            value={watch('image_url') || ''}
                            onChange={(url) => setValue('image_url', url)}
                            folder="homepage"
                            fileName={watch('section_identifier') || 'section'}
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2 pb-4 border-b">
                        <input type="checkbox" id="is_active" {...register('is_active')} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <Label htmlFor="is_active" className="font-normal cursor-pointer">Section is visible to public</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                        <Button type="submit" disabled={upsertMutation.isPending}>
                            {upsertMutation.isPending ? 'Saving...' : 'Save Section'}
                        </Button>
                    </div>
                </form>
            </FormModal>
        </div>
    );
}
