import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormModal } from '@/components/admin/FormModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useBlogPosts } from '@/hooks/useSiteData';
import { useUpsertBlogPost, useDeleteBlogPost } from '@/hooks/useAdminData';
import type { BlogPost } from '@/types/database';

export default function BlogPage() {
    const { data: posts = [], isLoading } = useBlogPosts();
    const upsertMutation = useUpsertBlogPost();
    const deleteMutation = useDeleteBlogPost();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<BlogPost>>();

    const openModal = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            reset(post);
        } else {
            setEditingPost(null);
            reset({ title: '', slug: '', excerpt: '', content: '', image_url: '', status: 'draft', published_at: new Date().toISOString() });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const onSubmit = (data: Partial<BlogPost>) => {
        const payload = {
            ...data,
            slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        };
        upsertMutation.mutate(payload, {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
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
                    <h1 className="text-2xl font-bold font-display">Blog & News</h1>
                    <p className="text-muted-foreground">Manage your articles, announcements, and corporate news</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Post
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                        No articles found. Click "Add Post" to write one.
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
                            {post.image_url ? (
                                <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 bg-muted flex items-center justify-center">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                                </div>
                            )}
                            <div className="p-5 flex-grow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {post.status}
                                    </span>
                                    {post.published_at && (
                                        <span className="text-xs flex items-center gap-1 text-muted-foreground">
                                            <Calendar className="w-3 h-3" /> {new Date(post.published_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt || post.content}</p>
                            </div>
                            <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/10">
                                <Button variant="ghost" size="sm" onClick={() => openModal(post)}>
                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <FormModal
                title={editingPost ? 'Edit Blog Post' : 'Add New Post'}
                open={isModalOpen}
                onClose={closeModal}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Cover Image (Optional)</Label>
                        <ImageUpload
                            value={watch('image_url') || ''}
                            onChange={(url) => setValue('image_url', url)}
                            folder="blog"
                            fileName={watch('slug') || watch('title')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Post Title</Label>
                        <Input id="title" {...register('title', { required: true })} required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (Optional)</Label>
                            <Input id="slug" {...register('slug')} placeholder="e.g. q3-financial-results" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                {...register('status')}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Short Excerpt</Label>
                        <Textarea id="excerpt" {...register('excerpt')} rows={2} className="resize-none" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Full Content</Label>
                        <Textarea id="content" {...register('content', { required: true })} required rows={8} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                        <Button type="submit" disabled={upsertMutation.isPending}>
                            {upsertMutation.isPending ? 'Saving...' : 'Save Post'}
                        </Button>
                    </div>
                </form>
            </FormModal>
        </div>
    );
}
