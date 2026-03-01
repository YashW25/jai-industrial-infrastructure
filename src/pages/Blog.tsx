import { MainLayout } from '@/components/layout/MainLayout';
import { useBlogPosts } from '@/hooks/useSiteData';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

const Blog = () => {
    const { data: posts, isLoading } = useBlogPosts();

    return (
        <MainLayout
            title="Blog & Insights"
            description="News, insights, and perspectives on industry trends, ongoing projects, and corporate announcements from Jai Industrial Infrastructure."
        >
            {/* Hero Header */}
            <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-[#002d2a] via-[#004643] to-[#0a5f58] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="blog-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" fill="white" fillOpacity="0.3" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#blog-pattern)" />
                    </svg>
                </div>
                <div className="container relative z-10 text-center">
                    <div className="max-w-3xl mx-auto animate-fade-in">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
                            <Newspaper className="h-4 w-4" />
                            Industry Insights
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Latest Updates
                        </h1>
                        <div className="w-16 h-1 bg-white/40 mx-auto mb-6" />
                        <p className="text-lg md:text-xl text-white/80 font-light">
                            News, insights, and perspectives on industrial infrastructure.
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <div className="py-20 bg-background min-h-[40vh]">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-96 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : posts && posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article key={post.id} className="group bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
                                    {post.image_url ? (
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative aspect-video bg-gradient-to-br from-[#004643] to-[#002d2a] flex items-center justify-center">
                                            <Newspaper className="h-12 w-12 text-white/20" />
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col flex-grow">
                                        {post.published_at && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <time dateTime={post.published_at}>
                                                    {new Date(post.published_at).toLocaleDateString('en-IN', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                </time>
                                            </div>
                                        )}

                                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                                            {post.title}
                                        </h3>

                                        <p className="text-muted-foreground line-clamp-3 mb-6 flex-grow text-sm leading-relaxed">
                                            {post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '')}
                                        </p>

                                        <Link
                                            to={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all mt-auto"
                                        >
                                            Read Article <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground">
                            No articles currently published.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Blog;
