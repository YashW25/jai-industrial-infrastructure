import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const clubSchema = z.object({
    name: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
    full_name: z.string().min(5, 'Full name is too short').max(255, 'Full name is too long'),
    slug: z.string().min(2, 'Slug is too short').max(50, 'Slug is too long')
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    college_name: z.string().min(2, 'College name is required'),
});

type ClubForm = z.infer<typeof clubSchema>;

interface CreateClubModalProps {
    onSuccess: () => void;
}

export const CreateClubModal = ({ onSuccess }: CreateClubModalProps) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<ClubForm>({
        resolver: zodResolver(clubSchema),
        defaultValues: {
            name: '',
            full_name: '',
            slug: '',
            college_name: '',
        },
    });

    const onSubmit = async (data: ClubForm) => {
        setIsSubmitting(true);

        // Check if slug already exists
        const { data: existing } = await supabase.from('clubs').select('id').eq('slug', data.slug).maybeSingle();
        if (existing) {
            form.setError('slug', { message: 'This slug is already in use by another tenant.' });
            setIsSubmitting(false);
            return;
        }

        const { error } = await supabase.from('clubs').insert({
            name: data.name,
            full_name: data.full_name,
            slug: data.slug,
            college_name: data.college_name,
            is_active: true,
            is_suspended: false,
        });

        if (error) {
            toast({ title: 'Creation Failed', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Club Created Successfully', description: `${data.name} has been provisioned.` });
            form.reset();
            setOpen(false);
            onSuccess();
        }

        setIsSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create Tenant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Provision New Tenant</DialogTitle>
                    <DialogDescription>
                        Create a new club workspace. Ensure the slug is unique and domain-friendly.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Short Name</Label>
                        <Input id="name" placeholder="e.g. GDSC" {...form.register('name')} />
                        {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Organization Name</Label>
                        <Input id="full_name" placeholder="e.g. Google Developer Student Clubs" {...form.register('full_name')} />
                        {form.formState.errors.full_name && <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Unique Slug</Label>
                        <Input id="slug" placeholder="e.g. gdsc-mit" {...form.register('slug')} />
                        {form.formState.errors.slug && <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="college_name">Institution / College</Label>
                        <Input id="college_name" placeholder="e.g. MIT" {...form.register('college_name')} />
                        {form.formState.errors.college_name && <p className="text-xs text-destructive">{form.formState.errors.college_name.message}</p>}
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Provisioning</> : 'Create Tenant'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
