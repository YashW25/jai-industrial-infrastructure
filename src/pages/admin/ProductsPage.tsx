import { useState } from 'react';
import { useAllProducts, useProductEnquiries } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Package, Plus, Pencil, Trash2, Eye, EyeOff, MessageSquare, Mail, Phone, Globe, X, Loader2 } from 'lucide-react';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';

interface ProductFormData {
    name: string;
    slug: string;
    description: string;
    price_inr: string;
    price_usd: string;
    status: 'published' | 'draft';
    position: string;
    images: string[];
}

const emptyForm = (): ProductFormData => ({
    name: '', slug: '', description: '', price_inr: '', price_usd: '', status: 'published', position: '0', images: []
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const AdminProductsPage = () => {
    const { data: products, isLoading } = useAllProducts();
    const { data: enquiries } = useProductEnquiries();
    const qc = useQueryClient();
    const [view, setView] = useState<'products' | 'enquiries'>('products');
    const [form, setForm] = useState<ProductFormData>(emptyForm());
    const [editId, setEditId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const unreadCount = enquiries?.filter(e => !e.is_read).length || 0;

    const openCreate = () => { setForm(emptyForm()); setEditId(null); setShowForm(true); };
    const openEdit = (p: any) => {
        setForm({
            name: p.name,
            slug: p.slug,
            description: p.description || '',
            price_inr: p.price_inr?.toString() || '',
            price_usd: p.price_usd?.toString() || '',
            status: p.status,
            position: p.position?.toString() || '0',
            images: p.product_images?.map((img: any) => img.image_url) || []
        });
        setEditId(p.id);
        setShowForm(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.slug.trim()) { toast.error('Name and slug are required.'); return; }
        if (form.images.length === 0) { toast.error('At least one product image is required.'); return; }

        setSaving(true);
        const payload = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            description: form.description || null,
            price_inr: form.price_inr ? parseFloat(form.price_inr) : null,
            price_usd: form.price_usd ? parseFloat(form.price_usd) : null,
            status: form.status,
            position: parseInt(form.position) || 0,
        };

        try {
            let productId = editId;

            if (editId) {
                const { error } = await supabase.from('products' as any).update(payload).eq('id', editId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('products' as any).insert(payload).select('id').single() as { data: { id: string }, error: any };
                if (error) throw error;
                productId = data.id;
            }

            // Sync images
            if (productId) {
                // Delete missing images
                const existingDbImagesResponse = await supabase.from('product_images' as any).select('image_url').eq('product_id', productId) as { data: { image_url: string }[] | null };
                const existingUrls = existingDbImagesResponse.data?.map((i: { image_url: string }) => i.image_url) || [];

                const urlsToDelete = existingUrls.filter(url => !form.images.includes(url));
                if (urlsToDelete.length > 0) {
                    await supabase.from('product_images' as any).delete().in('image_url', urlsToDelete).eq('product_id', productId);
                }

                // Insert new images
                const urlsToInsert = form.images.filter(url => !existingUrls.includes(url));
                if (urlsToInsert.length > 0) {
                    const insertPayload = urlsToInsert.map((url, i) => ({
                        product_id: productId,
                        image_url: url,
                        position: form.images.indexOf(url) // Respect order in the array
                    }));
                    await supabase.from('product_images' as any).insert(insertPayload);
                }
            }

            toast.success(editId ? 'Product updated' : 'Product created');
            qc.invalidateQueries({ queryKey: ['products'] });
            qc.invalidateQueries({ queryKey: ['products-all'] });
            setShowForm(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product permanently?')) return;
        setDeleting(id);
        const { error } = await supabase.from('products' as any).delete().eq('id', id);
        setDeleting(null);
        if (error) { toast.error(error.message); return; }
        toast.success('Product deleted');
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['products-all'] });
    };

    const markRead = async (id: string) => {
        await supabase.from('product_enquiries' as any).update({ is_read: true }).eq('id', id);
        qc.invalidateQueries({ queryKey: ['product-enquiries'] });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Package className="h-7 w-7 text-primary" /> Products
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage industrial products and view enquiries.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={view === 'products' ? 'default' : 'outline'} onClick={() => setView('products')} className="gap-2">
                        <Package className="h-4 w-4" /> Products
                    </Button>
                    <Button variant={view === 'enquiries' ? 'default' : 'outline'} onClick={() => setView('enquiries')} className="relative gap-2">
                        <MessageSquare className="h-4 w-4" /> Enquiries
                        {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{unreadCount}</span>}
                    </Button>
                    {view === 'products' && (
                        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white gap-2">
                            <Plus className="h-4 w-4" /> Add Product
                        </Button>
                    )}
                </div>
            </div>

            {/* Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="text-xl font-bold">{editId ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-muted"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                                    <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Slug *</label>
                                    <input required type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (INR)</label>
                                    <input type="number" value={form.price_inr} onChange={e => setForm(f => ({ ...f, price_inr: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 50000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (USD)</label>
                                    <input type="number" value={form.price_usd} onChange={e => setForm(f => ({ ...f, price_usd: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none">
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Display Order</label>
                                    <input type="number" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Product specifications, use case, features..." />
                            </div>

                            {/* Images Section */}
                            <div className="pt-2 border-t border-border mt-4">
                                <label className="block text-sm font-medium mb-3">Product Images *</label>
                                <MultiImageUpload
                                    urls={form.images}
                                    onChange={(urls) => setForm(f => ({ ...f, images: urls }))}
                                    folder="products"
                                    maxImages={4}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white flex-1">
                                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : editId ? 'Save Changes' : 'Create Product'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products List */}
            {view === 'products' && (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold">All Products ({products?.length || 0})</h2>
                    </div>
                    {isLoading ? (
                        <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />)}</div>
                    ) : products && products.length > 0 ? (
                        <div className="divide-y divide-border">
                            {products.map(p => (
                                <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-foreground truncate">{p.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-xs text-muted-foreground font-mono">{p.slug}</p>
                                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                {p.product_images?.length || 0} image(s)
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {p.status}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)} className="h-8 w-8 p-0 hover:bg-muted">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive">
                                            {deleting === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>No products yet. Click "Add Product" to create one.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Enquiries List */}
            {view === 'enquiries' && (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h2 className="font-semibold">Product Enquiries ({enquiries?.length || 0})</h2>
                    </div>
                    {enquiries && enquiries.length > 0 ? (
                        <div className="divide-y divide-border">
                            {enquiries.map(e => (
                                <div key={e.id} className={`px-6 py-4 ${!e.is_read ? 'bg-primary/5 border-l-2 border-primary' : ''}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1 min-w-0">
                                            <p className="font-semibold text-foreground">{e.name || 'Anonymous'}</p>
                                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                {e.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{e.email}</span>}
                                                {e.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{e.phone}</span>}
                                                {e.country && <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{e.country}</span>}
                                            </div>
                                            {e.message && <p className="text-sm text-foreground mt-2">{e.message}</p>}
                                            <p className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            {!e.is_read && (
                                                <Button variant="outline" size="sm" onClick={() => markRead(e.id)} className="gap-1 text-xs">
                                                    <Eye className="h-3.5 w-3.5" /> Mark Read
                                                </Button>
                                            )}
                                            {e.is_read && <span className="text-xs text-muted-foreground flex items-center gap-1"><EyeOff className="h-3.5 w-3.5" /> Read</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>No enquiries yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;
