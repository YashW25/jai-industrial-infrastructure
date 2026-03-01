import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Users, Settings, Database, Activity,
  Globe, Layers, FileText, MessageSquare, Image,
  ArrowRight, CheckCircle, AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizationSettings } from '@/hooks/useSiteData';
import { useProductEnquiries } from '@/hooks/useProducts';
import { formatDistanceToNow } from 'date-fns';

type TableCount = { label: string; count: number; icon: any; href: string; color: string };

const SuperAdminOverview = () => {
  const { data: settings } = useOrganizationSettings();
  const { data: enquiries = [] } = useProductEnquiries();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [counts, setCounts] = useState<TableCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserInfo(session?.user);

      const tables: { table: string; label: string; icon: any; href: string; color: string }[] = [
        { table: 'services', label: 'Services', icon: Layers, href: '/super-admin/services', color: 'text-blue-400' },
        { table: 'projects', label: 'Projects', icon: FileText, href: '/super-admin/projects', color: 'text-green-400' },
        { table: 'team_members', label: 'Team Members', icon: Users, href: '/super-admin/team', color: 'text-purple-400' },
        { table: 'testimonials', label: 'Testimonials', icon: MessageSquare, href: '/super-admin/testimonials', color: 'text-yellow-400' },
        { table: 'gallery', label: 'Gallery Items', icon: Image, href: '/super-admin/gallery', color: 'text-pink-400' },
        { table: 'blog_posts', label: 'Blog Posts', icon: FileText, href: '/super-admin/blog', color: 'text-cyan-400' },
        { table: 'user_roles', label: 'User Roles', icon: Users, href: '/super-admin/users', color: 'text-red-400' },
      ];

      const results = await Promise.all(
        tables.map(async (t) => {
          const { count } = await (supabase as any).from(t.table).select('*', { count: 'exact', head: true });
          return { label: t.label, count: count ?? 0, icon: t.icon, href: t.href, color: t.color };
        })
      );
      setCounts(results);
      setLoading(false);
    };
    init();
  }, []);

  const quickActions = [
    { label: 'Site Settings', desc: 'Manage org info, branding', href: '/super-admin/settings', icon: Settings, color: 'bg-blue-600' },
    { label: 'Manage Users', desc: 'View & assign user roles', href: '/super-admin/users', icon: Users, color: 'bg-purple-600' },
    { label: 'Products', desc: 'Manage catalog & enquiries', href: '/super-admin/products', icon: Layers, color: 'bg-teal-600' },
    { label: 'SEO', desc: 'Meta tags & SEO settings', href: '/super-admin/seo', icon: Globe, color: 'bg-orange-600' },
  ];

  const unreadEnquiries = enquiries.filter(e => !e.is_read).length;
  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Super Admin Panel</h1>
              <p className="text-muted-foreground text-sm">{settings?.name} — Full system access</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-14">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-500">Logged in as {userInfo?.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary">Super Admin</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Database className="h-4 w-4" /> Database Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
              <Card key={i} className="bg-card border-border animate-pulse shadow-sm rounded-sm">
                <CardContent className="p-4 h-20" />
              </Card>
            ))
            : counts.map((c) => (
              <Link key={c.label} to={c.href}>
                <Card className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group shadow-sm rounded-sm hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <c.icon className={`h-5 w-5 text-primary/70`} />
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{c.count}</div>
                    <div className="text-xs text-muted-foreground">{c.label}</div>
                  </CardContent>
                </Card>
              </Link>
            ))
          }
          {/* Enquiries Stat Card */}
          <Link to="/super-admin/products">
            <Card className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group shadow-sm rounded-sm hover:shadow-md hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <MessageSquare className={`h-5 w-5 text-primary/70`} />
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-bold text-foreground">{enquiries.length}</div>
                  {unreadEnquiries > 0 && (
                    <div className="text-xs font-semibold text-destructive mb-1 bg-destructive/10 px-1.5 py-0.5 rounded-sm">
                      {unreadEnquiries} unread
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Product Enquiries</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Card className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group shadow-sm rounded-sm hover:-translate-y-1 hover:shadow-md">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className={`w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-colors`}>
                    <action.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="font-semibold text-foreground text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{action.desc}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* System Info */}
      <Card className="bg-card border-border shadow-sm rounded-sm">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground text-xs uppercase font-medium">Organization</div>
              <div className="text-foreground font-semibold mt-1">{settings?.name || '—'}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase font-medium">Contact</div>
              <div className="text-foreground font-semibold mt-1">{settings?.email || '—'}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase font-medium">Access Level</div>
              <div className="text-primary font-semibold flex items-center gap-1 mt-1">
                <Shield className="h-3 w-3" /> Super Admin (Full Access)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Enquiries Activity */}
      <Card className="bg-card border-border shadow-sm rounded-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Recent Product Enquiries
          </CardTitle>
          <Link to="/super-admin/products" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
            View All
          </Link>
        </CardHeader>
        <CardContent className="pt-4">
          {recentEnquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No enquiries yet.</p>
          ) : (
            <div className="space-y-4">
              {recentEnquiries.map(enquiry => (
                <div key={enquiry.id} className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0 gap-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                      {enquiry.name}
                      {!enquiry.is_read && <span className="w-2 h-2 rounded-full bg-destructive block" />}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium truncate max-w-[300px] mt-0.5">{enquiry.message}</p>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground sm:text-right whitespace-nowrap">
                    {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default SuperAdminOverview;
