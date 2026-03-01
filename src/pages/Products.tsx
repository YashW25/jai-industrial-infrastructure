import { MainLayout } from '@/components/layout/MainLayout';
import { useProducts, formatPrice } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Tag } from 'lucide-react';

const Products = () => {
    const { data: products, isLoading } = useProducts();

    return (
        <MainLayout
            title="Products"
            description="Browse our range of industrial products and machinery. Get competitive pricing in INR or USD."
        >
            {/* Hero Header */}
            <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-[#002d2a] via-[#004643] to-[#0a5f58] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="products-bg" width="40" height="40" patternUnits="userSpaceOnUse">
                                <rect x="0" y="0" width="2" height="2" fill="white" fillOpacity="0.5" rx="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#products-bg)" />
                    </svg>
                </div>
                <div className="container relative z-10 text-center">
                    <div className="max-w-3xl mx-auto animate-fade-in">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
                            <Package className="h-4 w-4" />
                            Industrial Products
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Our Products
                        </h1>
                        <div className="w-16 h-1 bg-white/40 mx-auto mb-6" />
                        <p className="text-lg md:text-xl text-white/80 font-light">
                            High-quality industrial machinery and equipment sourced for your enterprise needs.
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <div className="py-20 bg-background min-h-[40vh]">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : products && products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => {
                                const coverImage = product.product_images?.[0]?.image_url;
                                const price = formatPrice(product.price_inr, product.price_usd);
                                return (
                                    <Link
                                        key={product.id}
                                        to={`/products/${product.slug}`}
                                        className="group bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            {coverImage ? (
                                                <img
                                                    src={coverImage}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#004643] to-[#002d2a] flex items-center justify-center">
                                                    <Package className="h-12 w-12 text-white/20" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                                                    {product.description}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                                <span className="flex items-center gap-1.5 text-primary font-bold text-lg">
                                                    <Tag className="h-4 w-4" />
                                                    {price}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                                                    Details <ArrowRight className="h-4 w-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">No products currently available. Check back soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Products;
