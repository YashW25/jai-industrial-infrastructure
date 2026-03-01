import { MainLayout } from '@/components/layout/MainLayout';
import { useOrganizationSettings, useTeamMembers } from '@/hooks/useSiteData';
import { Target, Eye, Users } from 'lucide-react';

const About = () => {
  const { data: settings } = useOrganizationSettings();
  const { data: team = [] } = useTeamMembers();

  return (
    <MainLayout
      title="About Us"
      description={settings?.tagline || `Learn about ${settings?.name}`}
    >
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-[#002d2a] via-[#004643] to-[#0a5f58] overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              About {settings?.name}
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <p className="text-xl md:text-2xl text-white/80 mb-8 font-light">
              Pioneering infrastructure, powering tomorrow.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Who We Are</h2>
            </div>
            <div className="prose prose-lg mx-auto text-center mb-16">
              <p className="text-xl text-muted-foreground leading-relaxed">
                {settings?.tagline || 'Leading the industry in innovation and infrastructure excellence.'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To deliver exceptional enterprise solutions and industrial infrastructure that drives sustainable growth, maximizes value, and empowers our clients to succeed in a rapidly evolving market.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the consistently preferred partner for critical enterprise infrastructure globally, recognized for our unwavering commitment to quality, safety, and operational excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Leadership</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Meet Our Team</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member) => (
                <div key={member.id} className="bg-background rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-64 object-cover object-top" />
                  ) : (
                    <div className="w-full h-64 bg-slate-100 flex items-center justify-center">
                      <Users className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    {member.bio && (
                      <p className="text-muted-foreground text-sm line-clamp-3">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default About;
