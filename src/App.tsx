import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppWrapper } from "@/components/AppWrapper";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { SuperAdminRoute } from "@/components/layout/SuperAdminRoute";
import { ThemeProvider } from "@/components/ThemeProvider";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

// Auth
import Auth from "./pages/Auth";
import AdminAuth from "./pages/auth/AdminAuth";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Overview from "./pages/admin/Overview";
import SiteSettingsPage from "./pages/admin/SiteSettingsPage";
import AdminServicesPage from "./pages/admin/ServicesPage";
import AdminProjectsPage from "./pages/admin/ProjectsPage";
import AdminBlogPage from "./pages/admin/BlogPage";
import AdminTestimonialsPage from "./pages/admin/TestimonialsPage";
import AdminHomepagePage from "./pages/admin/HomepagePage";
import AdminSeoPage from "./pages/admin/SeoPage";
import AdminProductsPage from "./pages/admin/ProductsPage";
import TeamPage from "./pages/admin/TeamPage";
import GalleryPage from "./pages/admin/GalleryPage";
import DownloadsPage from "./pages/admin/DownloadsPage";
import InquiriesPage from "./pages/admin/InquiriesPage";

// Super Admin pages
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import SuperAdminOverview from "./pages/super-admin/SuperAdminOverview";
import SuperAdminUsersPage from "./pages/super-admin/SuperAdminUsersPage";
import SuperAdminSystemPage from "./pages/super-admin/SuperAdminSystemPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes — prevents excessive refetches
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ThemeProvider>
              <ScrollToTop />
              <AppWrapper>
                <Routes>
                  {/* ── Public Routes ── */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* ── Auth ── */}
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/admin" element={<AdminAuth />} />

                  {/* ── Admin Routes (admin / editor / super_admin) ── */}
                  <Route path="/admin" element={<ProtectedRoute />}>
                    <Route element={<AdminDashboard />}>
                      <Route index element={<Overview />} />
                      <Route path="settings" element={<SiteSettingsPage />} />
                      <Route path="services" element={<AdminServicesPage />} />
                      <Route path="projects" element={<AdminProjectsPage />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="blog" element={<AdminBlogPage />} />
                      <Route path="team" element={<TeamPage />} />
                      <Route path="testimonials" element={<AdminTestimonialsPage />} />
                      <Route path="gallery" element={<GalleryPage />} />
                      <Route path="downloads" element={<DownloadsPage />} />
                      <Route path="inquiries" element={<InquiriesPage />} />
                      <Route path="seo" element={<AdminSeoPage />} />
                      <Route path="homepage" element={<AdminHomepagePage />} />
                    </Route>
                  </Route>

                  {/* ── Super Admin Routes (super_admin only) ── */}
                  <Route path="/super-admin" element={<SuperAdminRoute />}>
                    <Route element={<SuperAdminDashboard />}>
                      <Route index element={<SuperAdminOverview />} />
                      <Route path="settings" element={<SiteSettingsPage />} />
                      <Route path="services" element={<AdminServicesPage />} />
                      <Route path="projects" element={<AdminProjectsPage />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="blog" element={<AdminBlogPage />} />
                      <Route path="team" element={<TeamPage />} />
                      <Route path="testimonials" element={<AdminTestimonialsPage />} />
                      <Route path="gallery" element={<GalleryPage />} />
                      <Route path="downloads" element={<DownloadsPage />} />
                      <Route path="inquiries" element={<InquiriesPage />} />
                      <Route path="seo" element={<AdminSeoPage />} />
                      <Route path="homepage" element={<AdminHomepagePage />} />
                      <Route path="users" element={<SuperAdminUsersPage />} />
                      <Route path="system" element={<SuperAdminSystemPage />} />
                    </Route>
                  </Route>

                  {/* ── Catch-all — must be last ── */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppWrapper>
            </ThemeProvider>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
