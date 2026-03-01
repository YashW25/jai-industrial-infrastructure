import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Settings, LogOut, Menu, X,
    ChevronDown, Shield, Database, Globe, Activity,
    FileText, Image, Layers, MessageSquare, Download, Search, Home, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrganizationSettings, useInquiries } from '@/hooks/useSiteData';
import { useProductEnquiries } from '@/hooks/useProducts';

const superAdminNavItems = [
    { label: 'Overview', href: '/super-admin', icon: LayoutDashboard },
    {
        label: 'Content Management', icon: Layers, children: [
            { label: 'Site Settings', href: '/super-admin/settings', icon: Settings },
            { label: 'Services', href: '/super-admin/services', icon: Layers },
            { label: 'Products', href: '/super-admin/products', icon: Database },
            { label: 'Projects', href: '/super-admin/projects', icon: FileText },
            { label: 'Blog', href: '/super-admin/blog', icon: FileText },
            { label: 'Team', href: '/super-admin/team', icon: Users },
            { label: 'Testimonials', href: '/super-admin/testimonials', icon: MessageSquare },
            { label: 'Inquiries', href: '/super-admin/inquiries', icon: Mail },
            { label: 'Gallery', href: '/super-admin/gallery', icon: Image },
            { label: 'Downloads', href: '/super-admin/downloads', icon: Download },
        ]
    },
    { label: 'SEO', href: '/super-admin/seo', icon: Search },
    { label: 'Homepage', href: '/super-admin/homepage', icon: Home },
    { label: 'User Roles', href: '/super-admin/users', icon: Users },
    { label: 'System', href: '/super-admin/system', icon: Database },
];

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const { data: settings } = useOrganizationSettings();
    const { data: productEnquiries = [] } = useProductEnquiries();
    const { data: generalInquiries = [] } = useInquiries();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [expandedNavs, setExpandedNavs] = useState<Set<string>>(new Set());

    const unreadProductCount = productEnquiries.filter(e => !e.is_read).length;
    const unreadInquiryCount = generalInquiries.filter(e => !e.is_read).length;

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { navigate('/auth/admin'); return; }
            setUser(session.user);
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            if (!session) navigate('/auth/admin');
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Logged out');
        navigate('/auth/admin');
    };

    const toggleNav = (label: string) => {
        setExpandedNavs(prev => {
            const next = new Set(prev);
            if (next.has(label)) next.delete(label); else next.add(label);
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-muted/30 text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
                <div className="flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted">
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <Link to="/super-admin" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-md">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-display text-lg font-bold text-foreground">
                                    {settings?.name || 'Super Admin'}
                                </span>
                                <span className="text-xs text-primary block flex items-center gap-1">
                                    <Activity className="h-3 w-3" /> Super Admin Control Panel
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/" target="_blank">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Globe className="h-4 w-4" /> View Site
                            </Button>
                        </Link>
                        <Link to="/admin">
                            <Button variant="outline" size="sm" className="gap-2">
                                <LayoutDashboard className="h-4 w-4" /> Admin Panel
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white">
                                        {user?.email?.[0]?.toUpperCase()}
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border-border text-foreground">
                                <DropdownMenuItem className="text-muted-foreground text-xs">{user?.email}</DropdownMenuItem>
                                <DropdownMenuItem className="text-primary text-xs font-semibold">⚡ Super Admin</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                                    <LogOut className="h-4 w-4 mr-2" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={cn(
                    "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r border-border pt-16 transition-transform lg:translate-x-0 overflow-y-auto",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    {/* Super Admin Badge */}
                    <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Super Admin Access</span>
                        </div>
                    </div>

                    <nav className="p-4 space-y-1 pb-8">
                        {superAdminNavItems.map((item) => {
                            if (item.children) {
                                const isParentActive = item.children.some(c => location.pathname.startsWith(c.href));
                                const isExpanded = expandedNavs.has(item.label) || isParentActive;
                                return (
                                    <div key={item.label}>
                                        <button
                                            onClick={() => toggleNav(item.label)}
                                            className={cn(
                                                "flex items-center justify-between w-full px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                                                isParentActive
                                                    ? "text-foreground bg-muted"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            )}>
                                            <span className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5" />
                                                {item.label}
                                            </span>
                                            <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-180" : "")} />
                                        </button>
                                        {isExpanded && (
                                            <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        to={child.href}
                                                        onClick={() => setSidebarOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                                            location.pathname === child.href
                                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                        )}>
                                                        <child.icon className="h-4 w-4" />
                                                        <span className="flex-1">{child.label}</span>
                                                        {child.label === 'Products' && unreadProductCount > 0 && (
                                                            <div className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                                                                {unreadProductCount}
                                                            </div>
                                                        )}
                                                        {child.label === 'Inquiries' && unreadInquiryCount > 0 && (
                                                            <div className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                                                                {unreadInquiryCount}
                                                            </div>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}>
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                <main className="flex-1 lg:ml-64 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
