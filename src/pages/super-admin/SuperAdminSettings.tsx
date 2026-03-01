import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paintbrush, Save, Loader2, RotateCcw } from 'lucide-react';
import { useOrganizationSettings } from '@/hooks/useSiteData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const DEFAULT_THEME = {
  primary_color: '#004643',
  background_color: '#F0EDE5',
  accent_color: '#0a5f58'
};

const SuperAdminSettings = () => {
  const { data: settings, isLoading } = useOrganizationSettings();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  // Local state for instant preview without mutating cache until save
  const [colors, setColors] = useState({
    primary: (settings as any)?.primary_color || DEFAULT_THEME.primary_color,
    background: (settings as any)?.background_color || DEFAULT_THEME.background_color,
    accent: (settings as any)?.accent_color || DEFAULT_THEME.accent_color,
  });

  // Update local state when settings finally load
  useState(() => {
    if (settings) {
      setColors({
        primary: (settings as any).primary_color || DEFAULT_THEME.primary_color,
        background: (settings as any).background_color || DEFAULT_THEME.background_color,
        accent: (settings as any).accent_color || DEFAULT_THEME.accent_color,
      });
    }
  });

  const handleColorChange = (key: 'primary' | 'background' | 'accent', value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
    // Instantly apply for preview
    document.documentElement.style.setProperty(`--${key}`, value);
  };

  const handleSaveTheme = async () => {
    if (!settings?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from('organization_settings')
      .update({
        primary_color: colors.primary,
        background_color: colors.background,
        accent_color: colors.accent,
      })
      .eq('id', settings.id);

    setSaving(false);

    if (error) {
      toast.error('Failed to save theme: ' + error.message);
    } else {
      toast.success('Theme applied successfully!');
      qc.invalidateQueries({ queryKey: ['site-settings'] });
    }
  };

  const handleReset = () => {
    handleColorChange('primary', DEFAULT_THEME.primary_color);
    handleColorChange('background', DEFAULT_THEME.background_color);
    handleColorChange('accent', DEFAULT_THEME.accent_color);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-100">Global Theme Settings</h1>
        <p className="text-slate-400">Control the brand colors across the entire application.</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Paintbrush className="h-5 w-5 text-red-400" />
            Brand Color System
          </CardTitle>
          <CardDescription className="text-slate-400">
            Select the root colors to be injected globally. Changes apply instantly for preview.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primary Color */}
            <div className="space-y-3">
              <Label className="text-slate-300">Primary Color</Label>
              <div className="flex gap-3">
                <div
                  className="w-12 h-12 rounded-lg border border-slate-600 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: colors.primary }}
                />
                <Input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-full h-12 p-1 cursor-pointer bg-slate-900 border-slate-700"
                />
              </div>
              <Input
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="font-mono text-sm bg-slate-900 border-slate-700 text-slate-300 uppercase"
              />
              <p className="text-xs text-slate-500">Buttons, active states, main branding</p>
            </div>

            {/* Background Base */}
            <div className="space-y-3">
              <Label className="text-slate-300">Background Base</Label>
              <div className="flex gap-3">
                <div
                  className="w-12 h-12 rounded-lg border border-slate-600 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: colors.background }}
                />
                <Input
                  type="color"
                  value={colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-full h-12 p-1 cursor-pointer bg-slate-900 border-slate-700"
                />
              </div>
              <Input
                value={colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="font-mono text-sm bg-slate-900 border-slate-700 text-slate-300 uppercase"
              />
              <p className="text-xs text-slate-500">Main page backgrounds, surfaces</p>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <Label className="text-slate-300">Accent Color</Label>
              <div className="flex gap-3">
                <div
                  className="w-12 h-12 rounded-lg border border-slate-600 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: colors.accent }}
                />
                <Input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-full h-12 p-1 cursor-pointer bg-slate-900 border-slate-700"
                />
              </div>
              <Input
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="font-mono text-sm bg-slate-900 border-slate-700 text-slate-300 uppercase"
              />
              <p className="text-xs text-slate-500">Highlights, hover secondary states</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
            <Button
              onClick={handleSaveTheme}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white min-w-[140px]"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Theme
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Brand Default
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Live Preview Area */}
      <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-slate-100">Live Preview Box</CardTitle>
          <CardDescription className="text-slate-400">See how your colors look together</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="w-full rounded-xl p-8 border border-slate-700/50 shadow-inner flex flex-col items-center justify-center gap-6"
            style={{ backgroundColor: colors.background }}
          >
            <h3
              className="text-2xl font-bold font-display"
              style={{ color: colors.primary }}
            >
              Industrial Excellence
            </h3>
            <p
              className="text-center max-w-md"
              style={{ color: colors.primary, opacity: 0.8 }}
            >
              Our machinery is built to last. Preview component styling right here to ensure color contrast is acceptable.
            </p>
            <div className="flex gap-4 mt-4">
              <button
                className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: colors.primary, color: '#ffffff' }}
              >
                Primary Button
              </button>
              <button
                className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: colors.accent, color: '#ffffff' }}
              >
                Accent Button
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminSettings;
