import { LayoutDashboard, Users, ClipboardList, Layers, MessageSquare } from 'lucide-react';
import { useTeamMembers, useServices, useProjects } from '@/hooks/useSiteData';
import { useProductEnquiries, useAllProducts } from '@/hooks/useProducts';

const Overview = () => {
  const { data: team } = useTeamMembers();
  const { data: services } = useServices();
  const { data: projects } = useProjects();
  const { data: products } = useAllProducts();
  const { data: enquiries = [] } = useProductEnquiries();

  const unreadEnquiries = enquiries.filter(e => !e.is_read).length;

  const dashboardStats = [
    { label: 'Products', value: products?.length || 0, icon: Layers, color: 'bg-teal-500' },
    { label: 'Enquiries (Unread)', value: unreadEnquiries, icon: MessageSquare, color: 'bg-red-500' },
    { label: 'Projects', value: projects?.length || 0, icon: ClipboardList, color: 'bg-blue-500' },
    { label: 'Services', value: services?.length || 0, icon: LayoutDashboard, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard. Manage your club website from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} mb-4`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="font-display text-3xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <Layers className="h-6 w-6 text-primary mb-2" />
            <div className="font-medium text-foreground">Manage Products</div>
            <div className="text-sm text-muted-foreground">Add or edit machinery</div>
          </a>
          <a
            href="/admin/projects"
            className="p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <ClipboardList className="h-6 w-6 text-primary mb-2" />
            <div className="font-medium text-foreground">Update Projects</div>
            <div className="text-sm text-muted-foreground">Log completed work</div>
          </a>
          <a
            href="/admin/services"
            className="p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <LayoutDashboard className="h-6 w-6 text-primary mb-2" />
            <div className="font-medium text-foreground">Edit Services</div>
            <div className="text-sm text-muted-foreground">Manage core offerings</div>
          </a>
        </div>
      </div>

      {/* System Status Preview */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">System Status</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted">
            <div className="font-display text-2xl font-bold text-foreground">{team?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Active Team Members</div>
          </div>
          <div className="p-4 rounded-xl bg-muted">
            <div className="font-display text-2xl font-bold text-foreground">{enquiries.length}</div>
            <div className="text-sm text-muted-foreground">Total Enquiries Logged</div>
          </div>
          <div className="p-4 rounded-xl bg-muted">
            <div className="font-display text-2xl font-bold text-green-500">Live</div>
            <div className="text-sm text-muted-foreground">Production Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
