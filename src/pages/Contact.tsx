import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useOrganizationSettings } from '@/hooks/useSiteData';
import { Phone, Mail, MapPin, Send, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { generateBreadcrumbSchema, SEO_CONFIG } from '@/lib/seo';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').max(255),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject must be at least 2 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const { data: settings } = useOrganizationSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // Data is already sanitized and stripped of extra fields by Zod implicitly,
      // but we construct it explicitly to guarantee no over-posting
      const sanitizedPayload: Record<string, string | undefined> = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        subject: data.subject.trim(),
        message: data.message.trim(),
      };

      const { error } = await supabase
        .from('inquiries')
        .insert([sanitizedPayload] as any);

      if (error) throw error;
      toast.success('Message sent successfully!');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, url: settings?.facebook_url, label: 'Facebook' },
    { icon: Instagram, url: settings?.instagram_url, label: 'Instagram' },
    { icon: Linkedin, url: settings?.linkedin_url, label: 'LinkedIn' },
    { icon: Twitter, url: settings?.twitter_url, label: 'Twitter' },
  ].filter(link => link.url);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Jai Industrial Infrastructure',
    url: `${SEO_CONFIG.siteUrl}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: settings?.name || 'Jai Industrial Infrastructure',
      email: settings?.email,
      telephone: settings?.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings?.address || 'Industrial Area',
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        postalCode: '412115',
        addressCountry: 'IN',
      },
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Contact Us', item: '/contact' },
  ]);

  return (
    <MainLayout
      title="Contact"
      description="Get in touch with us for collaborations, queries, and support."
      keywords="Contact, Email, Phone, Infrastructure"
      schema={schema}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-20 gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <p className="text-lg text-white/80">
              Have questions or want to collaborate? We'd love to hear from you
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {settings?.email && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-primary">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}
                {settings?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <a href={`tel:${settings.phone}`} className="text-muted-foreground hover:text-primary">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}
                {settings?.address && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Address</h3>
                      <p className="text-muted-foreground">{settings.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 rounded-2xl bg-card border border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                    <Input placeholder="Your name" className={`border-primary/20 focus:border-primary ${errors.name ? 'border-red-500' : ''}`} {...register('name')} maxLength={100} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                    <Input type="email" placeholder="Your email" className={`border-primary/20 focus:border-primary ${errors.email ? 'border-red-500' : ''}`} {...register('email')} maxLength={255} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Phone (Optional)</label>
                    <Input type="tel" placeholder="Your phone number" className="border-primary/20 focus:border-primary" {...register('phone')} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
                    <Input placeholder="Subject" className={`border-primary/20 focus:border-primary ${errors.subject ? 'border-red-500' : ''}`} {...register('subject')} maxLength={200} />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                  <Textarea
                    placeholder="Your message"
                    rows={5}
                    className={`border-primary/20 focus:border-primary resize-none ${errors.message ? 'border-red-500' : ''}`}
                    {...register('message')}
                    maxLength={2000}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
