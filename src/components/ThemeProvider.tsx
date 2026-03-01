import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrganizationSettings } from '@/hooks/useSiteData';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: settings } = useOrganizationSettings();
    const location = useLocation();

    useEffect(() => {
        const root = document.documentElement;

        // Strip custom themes on admin paths so they fallback to standard tailwind
        const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin');
        if (isAdmin) {
            root.style.removeProperty('--primary');
            root.style.removeProperty('--background');
            root.style.removeProperty('--accent');
            return;
        }

        if (!settings) return;

        // Apply primary color if it exists
        if ((settings as any).primary_color) {
            root.style.setProperty('--primary', (settings as any).primary_color);
            // Generate some generic HSL derivatives for Tailwind (opacity utilities)
            // This is a simplified fallback; ideally colors are HSL in the DB, 
            // but hex works directly for most basic variables
        }

        // Apply background color if it exists
        if ((settings as any).background_color) {
            root.style.setProperty('--background', (settings as any).background_color);
        }

        // Apply accent color if it exists
        if ((settings as any).accent_color) {
            root.style.setProperty('--accent', (settings as any).accent_color);
        }

    }, [settings]);

    return <>{children}</>;
};
