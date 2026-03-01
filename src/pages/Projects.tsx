import { MainLayout } from '@/components/layout/MainLayout';
import { useProjects } from '@/hooks/useSiteData';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase } from 'lucide-react';

const Projects = () => {
    const { data: projects, isLoading } = useProjects();

    return (
        <MainLayout
            title="Our Portfolio"
            description="A showcase of our industrial experience, engineering excellence, and large-scale infrastructure deployments across India."
        >
            {/* Hero Header */}
            <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-[#002d2a] via-[#004643] to-[#0a5f58] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="projects-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="2" fill="white" fillOpacity="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#projects-pattern)" />
                    </svg>
                </div>
                <div className="container relative z-10 text-center">
                    <div className="max-w-3xl mx-auto animate-fade-in">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
                            <Briefcase className="h-4 w-4" />
                            Project Portfolio
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Our Portfolio
                        </h1>
                        <div className="w-16 h-1 bg-white/40 mx-auto mb-6" />
                        <p className="text-lg md:text-xl text-white/80 font-light">
                            Engineering achievements and large-scale infrastructure deployments across India.
                        </p>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <div className="py-20 bg-background min-h-[40vh]">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : projects && projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            {projects.map((project) => (
                                <div key={project.id} id={project.slug} className="group relative rounded-2xl overflow-hidden bg-muted aspect-[4/3] border border-border shadow-sm hover:shadow-xl transition-shadow duration-300">
                                    {project.image_url ? (
                                        <img
                                            src={project.image_url}
                                            alt={project.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#004643] to-[#002d2a]">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Briefcase className="h-16 w-16 text-white/20" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                    <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        {project.client_name && (
                                            <p className="text-[#4ecca3] font-medium mb-2 text-sm uppercase tracking-wide">{project.client_name}</p>
                                        )}
                                        <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                                        <p className="text-white/80 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-75 duration-300">
                                            {project.description}
                                        </p>
                                        {project.completion_date && (
                                            <p className="text-sm text-white/50">Completed: {new Date(project.completion_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground">
                            No projects currently available in our portfolio.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Projects;
