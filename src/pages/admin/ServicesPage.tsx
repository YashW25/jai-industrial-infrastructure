import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormModal } from '@/components/admin/FormModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useServices } from '@/hooks/useSiteData';
import { useUpsertService, useDeleteService } from '@/hooks/useAdminData';
import type { Service } from '@/types/database';

const serviceSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, 'Title is required'),
    slug: z.string().optional(),
    description: z.string().min(5, 'Description is required'),
    image_url: z.string().optional(),
    is_active: z.boolean().optional(),
    position: z.number().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ServicesPage() {
    const { data: services = [], isLoading } = useServices();
    const upsertMutation = useUpsertService();
    const deleteMutation = useDeleteService();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceFormValues | null>(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema)
    });

    const openModal = (service?: Service) => {
        if (service) {
            setEditingService(service as ServiceFormValues);
            reset(service as ServiceFormValues);
        } else {
            setEditingService(null);
            reset({ title: '', description: '', slug: '', image_url: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const onSubmit = (data: ServiceFormValues) => {
        // Zod parser strips unknown fields inherently. Construct explicit payload.
        const payload = {
            id: data.id,
            title: data.title.trim(),
            description: data.description.trim(),
            slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            image_url: data.image_url,
            is_active: data.is_active,
            position: data.position,
        };
        upsertMutation.mutate(payload, {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display">Services</h1>
                    <p className="text-muted-foreground">Manage the services offered by your enterprise</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Service
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                        No services found. Click "Add Service" to create one.
                    </div>
                ) : (
                    services.map((service) => (
                        <div key={service.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
                            {service.image_url ? (
                                <img src={service.image_url} alt={service.title} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 bg-muted flex items-center justify-center">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                                </div>
                            )}
                            <div className="p-5 flex-grow">
                                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-3">{service.description}</p>
                            </div>
                            <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/10">
                                <Button variant="ghost" size="sm" onClick={() => openModal(service)}>
                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <FormModal
                title={editingService ? 'Edit Service' : 'Add New Service'}
                open={isModalOpen}
                onClose={closeModal}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Image (Optional)</Label>
                        <ImageUpload
                            value={watch('image_url') || ''}
                            onChange={(url) => setValue('image_url', url)}
                            folder="services"
                            fileName={watch('title')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Service Title</Label>
                        <Input id="title" className={errors.title ? 'border-red-500' : ''} {...register('title')} />
                        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug / URL Path (Optional)</Label>
                        <Input id="slug" className={errors.slug ? 'border-red-500' : ''} {...register('slug')} placeholder="e.g. industrial-automation" />
                        {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" className={`resize-none ${errors.description ? 'border-red-500' : ''}`} {...register('description')} rows={4} />
                        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                        <Button type="submit" disabled={upsertMutation.isPending}>
                            {upsertMutation.isPending ? 'Saving...' : 'Save Service'}
                        </Button>
                    </div>
                </form>
            </FormModal>
        </div>
    );
}
