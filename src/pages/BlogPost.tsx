import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import type { BlogPost as BlogPostType } from '@/types/database';

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();

    const { data: post, isLoading, error } = useQuery<BlogPostType | null>({
        queryKey: ['blog_post', slug],
        queryFn: async () => {
            if (!slug) return null;
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'published')
                .maybeSingle();
            if (error) throw error;
            return data;
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <MainLayout title="Loading...">
                <div className="pt-24 pb-16 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <Skeleton className="h-12 w-3/4 mb-4" />
                        <Skeleton className="h-6 w-1/2 mb-8" />
                        <Skeleton className="h-72 w-full rounded-2xl mb-8" />
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-3/4" />
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error || !post) {
        return (
            <MainLayout title="Article Not Found">
                <div className="min-h-[60vh] flex items-center justify-center flex-col gap-6 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold font-display mb-4">Article Not Found</h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            The article you're looking for doesn't exist or has been removed.
                        </p>
                        <Link to="/blog">
                            <Button size="lg" className="gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back to Blog
                            </Button>
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    // Split content on newlines for basic paragraph rendering (safe, no innerHTML)
    const paragraphs = (post.content || '').split(/\n\n+/).filter(Boolean);

    return (
        <MainLayout
            title={post.title}
            description={post.excerpt || post.content.substring(0, 155) + '...'}
            image={post.image_url || undefined}
            type="article"
            schema={{
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.excerpt || '',
                image: post.image_url,
                datePublished: post.published_at,
                author: {
                    '@type': 'Organization',
                    name: 'Jai Industrial Infrastructure',
                },
            }}
        >
            {/* Hero */}
            <div className="pt-24 pb-12 bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {publishedDate && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-primary" />
                                <time dateTime={post.published_at || ''}>{publishedDate}</time>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4 text-primary" />
                            <span>Jai Industrial Infrastructure</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            {post.image_url && (
                <div className="bg-background">
                    <div className="container mx-auto px-4 max-w-4xl py-8">
                        <div className="rounded-2xl overflow-hidden shadow-xl aspect-video">
                            <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Article Content */}
            <article className="py-12 bg-background">
                <div className="container mx-auto px-4 max-w-3xl">
                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground leading-relaxed mb-10 pb-10 border-b border-border italic">
                            {post.excerpt}
                        </p>
                    )}
                    <div className="prose prose-lg max-w-none text-foreground space-y-6">
                        {paragraphs.map((paragraph, i) => (
                            <p key={i} className="text-foreground leading-relaxed text-[1.05rem]">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <Link to="/blog">
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft className="w-4 h-4" /> All Articles
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button className="gap-2">
                                Contact Our Team <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </article>
        </MainLayout>
    );
};

export default BlogPost;
