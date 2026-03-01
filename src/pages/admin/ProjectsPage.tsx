import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormModal } from '@/components/admin/FormModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useProjects } from '@/hooks/useSiteData';
import { useUpsertProject, useDeleteProject } from '@/hooks/useAdminData';
import type { Project } from '@/types/database';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const projectSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, 'Project title is required'),
    slug: z.string().optional(),
    description: z.string().min(10, 'Description is required').or(z.literal('')),
    image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    client_name: z.string().optional(),
    completion_date: z.string().optional()
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
    const { data: projects = [], isLoading } = useProjects();
    const upsertMutation = useUpsertProject();
    const deleteMutation = useDeleteProject();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema)
    });

    const openModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            reset(project);
        } else {
            setEditingProject(null);
            reset({ title: '', slug: '', description: '', image_url: '', client_name: '', completion_date: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const onSubmit = (data: ProjectFormData) => {
        // Strip out any unknown fields to prevent overposting
        const payload = {
            ...(editingProject?.id ? { id: editingProject.id } : {}),
            title: data.title?.trim(),
            slug: data.slug?.trim() || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: data.description?.trim(),
            image_url: data.image_url,
            client_name: data.client_name?.trim(),
            completion_date: data.completion_date || null
        };
        upsertMutation.mutate(payload, {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
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
                    <h1 className="text-2xl font-bold font-display">Projects & Portfolio</h1>
                    <p className="text-muted-foreground">Showcase completed infrastructure and enterprise projects</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Project
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                        No projects found. Click "Add Project" to list one.
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
                            {project.image_url ? (
                                <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 bg-muted flex items-center justify-center">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                                </div>
                            )}
                            <div className="p-5 flex-grow">
                                <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                                {project.client_name && <p className="text-xs font-semibold text-primary mb-2 uppercase">{project.client_name}</p>}
                                <p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>
                            </div>
                            <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/10">
                                <Button variant="ghost" size="sm" onClick={() => openModal(project)}>
                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <FormModal
                title={editingProject ? 'Edit Project' : 'Add New Project'}
                open={isModalOpen}
                onClose={closeModal}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Project Image / Cover</Label>
                        <ImageUpload
                            value={watch('image_url') || ''}
                            onChange={(url) => setValue('image_url', url)}
                            folder="projects"
                            fileName={watch('title')}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input id="title" {...register('title', { required: true })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client_name">Client / Partner Name (Optional)</Label>
                            <Input id="client_name" {...register('client_name')} placeholder="e.g. Adani Group" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="completion_date">Completion Date (Optional)</Label>
                            <Input id="completion_date" type="date" {...register('completion_date')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Path / Slug (Optional)</Label>
                            <Input id="slug" {...register('slug')} placeholder="e.g. terminal-3-expansion" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Full Description</Label>
                        <Textarea id="description" {...register('description', { required: true })} required rows={5} className="resize-none" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                        <Button type="submit" disabled={upsertMutation.isPending}>
                            {upsertMutation.isPending ? 'Saving...' : 'Save Project'}
                        </Button>
                    </div>
                </form>
            </FormModal>
        </div>
    );
}
