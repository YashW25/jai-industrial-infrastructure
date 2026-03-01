import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useOrganizationSettings } from '@/hooks/useSiteData';
import { useUpdateOrganizationSettings } from '@/hooks/useAdminData';
import type { OrganizationSettings } from '@/types/database';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const settingsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Organization name is required'),
  tagline: z.string().optional(),
  email: z.string().email('Valid email is required').or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  logo_url: z.string().optional(),
  facebook_url: z.string().url('Must be a valid URL').or(z.literal('')),
  instagram_url: z.string().url('Must be a valid URL').or(z.literal('')),
  linkedin_url: z.string().url('Must be a valid URL').or(z.literal('')),
  twitter_url: z.string().url('Must be a valid URL').or(z.literal('')),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').or(z.literal('')),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SiteSettingsPage = () => {
  const { data: settings, isLoading } = useOrganizationSettings();
  const updateMutation = useUpdateOrganizationSettings();
  const { register, handleSubmit, reset, setValue, watch, formState: { isDirty, errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema)
  });

  useEffect(() => {
    if (settings) {
      reset({
        id: settings.id,
        name: settings.name || '',
        tagline: settings.tagline || '',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        logo_url: settings.logo_url || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        linkedin_url: settings.linkedin_url || '',
        twitter_url: settings.twitter_url || '',
        primary_color: settings.primary_color || '',
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: SettingsFormData) => {
    // Explicit payload mapping to prevent over-posting and ensure Zod hygiene
    const payload = {
      ...(settings?.id ? { id: settings.id } : {}),
      name: data.name?.trim(),
      tagline: data.tagline?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      address: data.address?.trim(),
      logo_url: data.logo_url,
      facebook_url: data.facebook_url,
      instagram_url: data.instagram_url,
      linkedin_url: data.linkedin_url,
      twitter_url: data.twitter_url,
      primary_color: data.primary_color,
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Organization Settings</h1>
        <p className="text-muted-foreground">Manage the global configuration for your enterprise business</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Logo</h2>
          <div className="max-w-xs">
            <ImageUpload
              value={watch('logo_url') || ''}
              onChange={(url) => setValue('logo_url', url, { shouldDirty: true })}
              folder="logos"
              fileName="organization-logo"
            />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input id="name" {...register('name')} placeholder="Jai Industrial Infrastructure" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Brand Color (Hex)</Label>
              <Input id="primary_color" {...register('primary_color')} placeholder="#2563eb" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tagline">Tagline / Mission Statement</Label>
              <Textarea id="tagline" {...register('tagline')} placeholder="Leading the industry in innovation..." className="resize-none" rows={3} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Public Email Address</Label>
              <Input id="email" type="email" {...register('email')} placeholder="contact@organization.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...register('phone')} placeholder="+1 234 567 890" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Physical Address</Label>
              <Textarea id="address" {...register('address')} placeholder="123 Industry Park..." className="resize-none" rows={2} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Social Media Links</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" type="url" {...register('linkedin_url')} placeholder="https://linkedin.com/company/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input id="twitter_url" type="url" {...register('twitter_url')} placeholder="https://twitter.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input id="facebook_url" type="url" {...register('facebook_url')} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input id="instagram_url" type="url" {...register('instagram_url')} placeholder="https://instagram.com/..." />
            </div>
          </div>
        </div>

        <div className="sticky bottom-6 flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!isDirty || updateMutation.isPending}
            className="w-full sm:w-auto shadow-xl"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettingsPage;
