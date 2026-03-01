import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Loader2, MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormModal } from '@/components/admin/FormModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useTestimonials } from '@/hooks/useSiteData';
import { useUpsertTestimonial, useDeleteTestimonial } from '@/hooks/useAdminData';
import type { Testimonial } from '@/types/database';

export default function TestimonialsPage() {
    const { data: testimonials = [], isLoading } = useTestimonials();
    const upsertMutation = useUpsertTestimonial();
    const deleteMutation = useDeleteTestimonial();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<Testimonial>>();

    const openModal = (testimonial?: Testimonial) => {
        if (testimonial) {
            setEditingTestimonial(testimonial);
            reset(testimonial);
        } else {
            setEditingTestimonial(null);
            reset({ client_name: '', company: '', content: '', rating: 5 });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const onSubmit = (data: Partial<Testimonial>) => {
        upsertMutation.mutate(data, {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
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
                    <h1 className="text-2xl font-bold font-display">Testimonials</h1>
                    <p className="text-muted-foreground">Manage client reviews and partner endorsements</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Testimonial
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                        No testimonials found. Click "Add Testimonial" to create one.
                    </div>
                ) : (
                    testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-card border border-border rounded-xl shadow-sm flex flex-col p-6">
                            <MessageSquareQuote className="w-8 h-8 text-primary/20 mb-4" />
                            <p className="text-muted-foreground italic line-clamp-4 flex-grow mb-6">"{testimonial.content}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                    {testimonial.client_name.charAt(0)}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-bold truncate">{testimonial.client_name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{testimonial.company}</p>
                                </div>
                            </div>
                            <div className="pt-4 mt-4 border-t border-border flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openModal(testimonial)}>
                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <FormModal
                title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                open={isModalOpen}
                onClose={closeModal}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="client_name">Client Name</Label>
                        <Input id="client_name" {...register('client_name', { required: true })} required placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Company / Role</Label>
                        <Input id="company" {...register('company')} placeholder="e.g. Acme Corp" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Review / Content</Label>
                        <Textarea id="content" {...register('content', { required: true })} required rows={4} className="resize-none" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                        <Button type="submit" disabled={upsertMutation.isPending}>
                            {upsertMutation.isPending ? 'Saving...' : 'Save Testimonial'}
                        </Button>
                    </div>
                </form>
            </FormModal>
        </div>
    );
}
