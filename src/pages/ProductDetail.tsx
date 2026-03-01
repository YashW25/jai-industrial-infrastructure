import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProductBySlug, formatPrice } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Package, ArrowLeft, Tag, Send, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: product, isLoading } = useProductBySlug(slug || '');
    const [activeImage, setActiveImage] = useState(0);
    const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleEnquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        if (!form.name.trim() || !form.email.trim()) {
            toast.error('Name and email are required.');
            return;
        }
        setSubmitting(true);
        const { error } = await supabase.from('product_enquiries' as any).insert({
            product_id: product.id,
            ...form,
        });
        setSubmitting(false);
        if (error) {
            toast.error('Failed to send enquiry. Please try again.');
        } else {
            toast.success('Enquiry sent! We will contact you shortly.');
            setForm({ name: '', email: '', phone: '', country: '', message: '' });
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-20">
                    <Skeleton className="h-10 w-64 mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <Skeleton className="aspect-square rounded-2xl" />
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!product) {
        return (
            <MainLayout title="Product Not Found">
                <div className="container mx-auto px-4 py-40 text-center">
                    <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link to="/products"><Button>Browse All Products</Button></Link>
                </div>
            </MainLayout>
        );
    }

    const images = product.product_images?.map(i => i.image_url) || [];
    const price = formatPrice(product.price_inr, product.price_usd);

    return (
        <MainLayout title={product.name} description={product.description || `${product.name} — enquire for pricing`}>
            <div className="bg-background py-16">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                        <Link to="/products" className="flex items-center gap-1 hover:text-primary transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Products
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Image Gallery */}
                        <div>
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
                                {images[activeImage] ? (
                                    <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#004643] to-[#002d2a] flex items-center justify-center">
                                        <Package className="h-24 w-24 text-white/20" />
                                    </div>
                                )}
                                {images.length > 1 && (
                                    <div className="absolute bottom-4 inset-x-4 flex justify-center gap-2">
                                        <button onClick={() => setActiveImage(i => Math.max(0, i - 1))} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <span className="px-3 py-1.5 bg-black/50 rounded-full text-white text-sm">{activeImage + 1}/{images.length}</span>
                                        <button onClick={() => setActiveImage(i => Math.min(images.length - 1, i + 1))} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                    {images.map((img, i) => (
                                        <button key={i} onClick={() => setActiveImage(i)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-primary' : 'border-border'}`}>
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info + Enquiry */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
                                <div className="flex items-center gap-2 text-2xl font-bold text-primary mb-4">
                                    <Tag className="h-5 w-5" />
                                    {price}
                                </div>
                                {product.description && (
                                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                                )}
                            </div>

                            {/* Enquiry Form */}
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h2 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                                    <Send className="h-5 w-5 text-primary" />
                                    Send Enquiry
                                </h2>
                                <form onSubmit={handleEnquiry} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                                            <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="Your full name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                                            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="you@company.com" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                                            <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="+91..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">Country</label>
                                            <input type="text" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="India" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                                        <textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" placeholder="Quantity needed, specifications, timeline..." />
                                    </div>
                                    <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl">
                                        {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : <><Send className="h-4 w-4 mr-2" /> Send Enquiry</>}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProductDetail;
