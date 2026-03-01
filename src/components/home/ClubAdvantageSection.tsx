import { Lightbulb, Users, Rocket, Code, Award, GraduationCap, BookOpen, Handshake, TrendingUp, Star } from 'lucide-react';
import { useOrganizationSettings, useAboutFeatures } from '@/hooks/useSiteData';
import { useCustomPageBySlug } from '@/hooks/useCustomPages';
import DOMPurify from 'dompurify';

const iconMap: Record<string, React.ElementType> = {
  award: Award,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  handshake: Handshake,
  code: Code,
  'trending-up': TrendingUp,
  star: Star,
  users: Users,
  lightbulb: Lightbulb,
  rocket: Rocket,
};

export const ClubAdvantageSection = () => {
  const { data: settings } = useOrganizationSettings();
  const { data: aboutPage } = useCustomPageBySlug('about');
  const { data: features } = useAboutFeatures();

  const clubName = settings?.name || 'Jai Industrial Infrastructure';

  if (!features?.length && !aboutPage?.content && !settings?.tagline) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            The {clubName} Advantage
          </h2>
          <p className="text-lg text-primary font-medium mb-6">Empowering Future Innovators</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 text-muted-foreground leading-relaxed text-center">
            {aboutPage?.content ? (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aboutPage.content) }} />
            ) : (
              <p>{settings?.tagline}</p>
            )}
          </div>
        </div>

        {features && features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Star;
              return (
                <div key={feature.id || index} className="text-center p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export const CESAAdvantageSection = ClubAdvantageSection;
