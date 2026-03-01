import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomepageSections, useOrganizationSettings } from '@/hooks/useSiteData';

export const HeroSection = () => {
  const { data: sections, isLoading } = useHomepageSections();
  const { data: settings } = useOrganizationSettings();

  const heroSection = sections?.find(s => s.section_identifier === 'hero');

  if (isLoading) {
    return (
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002d2a] via-[#004643] to-[#0a5f58]" />
        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6">
            <Skeleton className="h-10 w-64 bg-white/10" />
            <Skeleton className="h-16 w-full bg-white/10" />
            <Skeleton className="h-16 w-3/4 bg-white/10" />
            <Skeleton className="h-6 w-2/3 bg-white/10" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 w-40 bg-white/10 rounded-lg" />
              <Skeleton className="h-14 w-32 bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If there's no dynamic section but we want a fallback
  if (!heroSection) {
    return (
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002d2a] via-[#004643] to-[#0a5f58]" />
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" fill="white" fillOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">{settings?.name || 'Jai Industrial Infrastructure'}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Enterprise Business Solutions
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
              {settings?.tagline || 'Leading the industry in innovation and infrastructure excellence.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-[#002d2a]/95 via-[#004643]/80 to-transparent z-10" />
        {heroSection.image_url && (
          <img
            src={heroSection.image_url}
            alt={heroSection.title || ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      <div className="container relative z-20">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary border border-primary/30 mb-6 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <Star className="h-4 w-4 text-white fill-white" />
            <span className="text-sm font-medium text-white">{heroSection.subtitle || settings?.name}</span>
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            {heroSection.title}
          </h1>

          <p
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl animate-fade-in leading-relaxed drop-shadow-md"
            style={{ animationDelay: '0.3s' }}
          >
            {heroSection.content}
          </p>

          {heroSection.cta_text && (
            <div
              className="flex flex-wrap gap-4 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <Link to={heroSection.cta_link || '/contact'}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-lg shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1">
                  {heroSection.cta_text}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
