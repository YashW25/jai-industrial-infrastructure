import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Star, Building2, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServices, useProjects, useTestimonials, useHomepageSections } from '@/hooks/useSiteData';

const Index = () => {
  const { data: services } = useServices();
  const { data: projects } = useProjects();
  const { data: testimonials } = useTestimonials();
  const { data: sections } = useHomepageSections();

  const ctaSection = sections?.find(s => s.section_identifier === 'cta');
  const aboutSection = sections?.find(s => s.section_identifier === 'about');

  return (
    <MainLayout>
      <HeroSection />

      {/* Services Section */}
      {services && services.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive infrastructure solutions tailored for enterprise scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service) => (
                <div key={service.id} className="group bg-background rounded-2xl p-8 shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/50">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                    <Building2 className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">{service.description}</p>
                  <Link to={`/services#${service.slug}`} className="text-primary font-medium flex items-center hover:underline">
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/services">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About Overview (if set in homepage_sections) */}
      {aboutSection && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                  {aboutSection.title || 'About Us'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {aboutSection.content}
                </p>
                {aboutSection.cta_link && (
                  <Link to={aboutSection.cta_link}>
                    <Button size="lg">{aboutSection.cta_text || 'Read More'}</Button>
                  </Link>
                )}
              </div>
              {aboutSection.image_url && (
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img src={aboutSection.image_url} alt="About Us" className="w-full h-auto object-cover aspect-video" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                  Featured Projects
                </h2>
                <p className="text-lg text-white/70">
                  Explore our portfolio of successful enterprise deployments and industrial infrastructure achievements.
                </p>
              </div>
              <Link to="/projects" className="hidden md:inline-flex mt-6 md:mt-0">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View All Projects
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.slice(0, 4).map((project) => (
                <div key={project.id} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-[4/3]">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                    <p className="text-primary font-medium mb-2">{project.client_name}</p>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-white/80 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link to="/projects">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full">
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                What Our Clients Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial.id} className="bg-background rounded-2xl p-8 shadow-sm border border-border flex flex-col h-full">
                  <div className="flex gap-1 text-yellow-400 mb-6">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground italic flex-grow mb-8">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.client_name}</p>
                    {testimonial.company && (
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            {ctaSection?.title || 'Ready to Start Your Enterprise Project?'}
          </h2>
          <p className="text-xl text-white/90 mb-10">
            {ctaSection?.content || 'Contact our team of experts today to discuss your infrastructure requirements and discover how we can accelerate your growth.'}
          </p>
          <Link to={ctaSection?.cta_link || "/contact"}>
            <Button size="lg" variant="secondary" className="px-10 py-6 text-lg rounded-full font-bold text-primary hover:scale-105 transition-transform">
              {ctaSection?.cta_text || 'Contact Us Now'}
            </Button>
          </Link>
        </div>
      </section>

    </MainLayout>
  );
};

export default Index;
