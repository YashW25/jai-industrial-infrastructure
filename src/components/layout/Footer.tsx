import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Mail, Phone, MapPin, Building2, Eye } from 'lucide-react';
import { useOrganizationSettings, useQuickLinks } from '@/hooks/useSiteData';
import { useVisitorCount } from '@/hooks/useVisitorCount';

export const Footer = () => {
  const { data: settings } = useOrganizationSettings();
  const visitorCount = useVisitorCount();
  const { data: quickLinks } = useQuickLinks('quick');
  const { data: resourceLinks } = useQuickLinks('resource');
  return (
    <footer className="bg-[#002d2a] text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/10">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt={settings?.name} className="h-10 w-10 object-contain" />
                ) : (
                  <Building2 className="h-8 w-8" />
                )}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">{settings?.name || 'Enterprise'}</h3>
                <p className="text-sm text-white/60">{settings?.tagline || ''}</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {settings?.tagline || 'Empowering future tech leaders through innovation, collaboration, and excellence.'}
            </p>

            {/* Social Media */}
            <div className="pt-2">
              <h4 className="text-sm font-semibold mb-3">Social Media</h4>
              <div className="flex gap-2">
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-[#1877f2] hover:opacity-80 transition-opacity">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {settings?.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-[#1da1f2] hover:opacity-80 transition-opacity">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {settings?.linkedin_url && (
                  <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-[#0a66c2] hover:opacity-80 transition-opacity">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-80 transition-opacity">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}

              </div>
            </div>
          </div>

          {/* Quick Links */}
          {quickLinks && quickLinks.length > 0 ? (
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-sm text-white/70 hover:text-primary transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Products', href: '/products' }, { label: 'Projects', href: '/projects' }, { label: 'Blog', href: '/blog' }].map(l => (
                  <li key={l.href}><Link to={l.href} className="text-sm text-white/70 hover:text-primary transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {resourceLinks && resourceLinks.length > 0 ? (
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-sm text-white/70 hover:text-primary transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2.5">
                {[{ label: 'Contact Us', href: '/contact' }, { label: 'Industrial Projects', href: '/projects' }, { label: 'Blog & Insights', href: '/blog' }].map(l => (
                  <li key={l.href}><Link to={l.href} className="text-sm text-white/70 hover:text-primary transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-white/70">{settings?.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href={`tel:${settings?.phone}`} className="text-sm text-white/70 hover:text-primary transition-colors">
                  {settings?.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href={`mailto:${settings?.email}`} className="text-sm text-white/70 hover:text-primary transition-colors">
                  {settings?.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-white/50 text-center">
            © {new Date().getFullYear()} {settings?.name || 'Enterprise'} | Developed by <span className="font-semibold text-white/70">Innovara Dynamics</span>
          </p>
          {visitorCount !== null && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Eye className="h-4 w-4" />
              <span>Visitors: <span className="font-semibold text-white/70">{visitorCount.toLocaleString()}</span></span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
