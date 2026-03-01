import { MainLayout } from '@/components/layout/MainLayout';
import { useServices } from '@/hooks/useSiteData';
import { Building2, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Services = () => {
    const { data: services, isLoading } = useServices();

    return (
        <MainLayout
            title="Our Services"
            description="Delivering world-class enterprise infrastructure solutions tailored for scale, operational efficiency, and industrial excellence."
        >
            {/* Hero Header */}
            <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-[#002d2a] via-[#004643] to-[#0a5f58] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="services-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" fill="white" fillOpacity="0.4" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#services-pattern)" />
                    </svg>
                </div>
                <div className="container relative z-10 text-center">
                    <div className="max-w-3xl mx-auto animate-fade-in">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
                            <Building2 className="h-4 w-4" />
                            Engineering Excellence
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Our Services
                        </h1>
                        <div className="w-16 h-1 bg-white/40 mx-auto mb-6" />
                        <p className="text-lg md:text-xl text-white/80 font-light">
                            Comprehensive industrial infrastructure solutions tailored for enterprise scale.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <div className="py-20 bg-background min-h-[40vh]">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : services && services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service) => (
                                <div key={service.id} id={service.slug} className="group bg-card rounded-2xl p-8 shadow-sm border border-border transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                        <Building2 className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Enterprise Grade
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground">
                            No services currently available.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Services;
