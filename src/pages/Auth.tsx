import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizationSettings } from '@/hooks/useSiteData';
import { useAuth } from '@/contexts/AuthContext';

const authSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
});

type AuthForm = z.infer<typeof authSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: settings } = useOrganizationSettings();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  const form = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  const { signIn } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await handleUserRedirect(session.user.id);
      }
      setChecking(false);
    };
    checkSession();
  }, []);

  const handleUserRedirect = async (userId: string) => {
    const { data: uRoles } = await supabase.from('user_roles').select('role').eq('user_id', userId);
    const isAdminOrEditor = uRoles && uRoles.some(r => r.role === 'super_admin' || r.role === 'admin' || r.role === 'editor');

    if (isAdminOrEditor) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (data: AuthForm) => {
    setIsSubmitting(true);
    try {
      const { error, role } = await signIn(data.email, data.password);

      if (error) {
        toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: 'Welcome!' });

      if (role === 'super_admin' || role === 'admin') {
        navigate('/admin');
      } else if (role === 'editor') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checking) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen py-20 gradient-hero flex items-center">
        <div className="container max-w-md">
          <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="font-display text-2xl">
                {settings?.name || 'Innovation Cell'} Portal
              </CardTitle>
              <CardDescription>Login to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-10" {...form.register('email')} />
                  </div>
                  {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" className="pl-10 pr-10" {...form.register('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full gradient-accent" disabled={isSubmitting}>
                  {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</>) : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
};

export default Auth;
