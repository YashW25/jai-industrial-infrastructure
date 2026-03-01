import type { ReactNode } from 'react';

interface EnvValidatorProps {
    children: ReactNode;
}

const REQUIRED_VARS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'] as const;

/**
 * EnvValidator - Gates app rendering behind a check for required environment variables.
 * Shows a clear setup error screen instead of cryptic network failures.
 */
export const EnvValidator = ({ children }: EnvValidatorProps) => {
    const missing: string[] = [];
    if (!import.meta.env.VITE_SUPABASE_URL) missing.push('VITE_SUPABASE_URL');
    if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');


    if (missing.length > 0) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    background: '#0f172a',
                    color: '#f8fafc',
                    padding: '2rem',
                    textAlign: 'center',
                }}
            >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔑</div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Configuration Required
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: 520, marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    The following environment variables are missing. Please configure your{' '}
                    <code style={{ color: '#fb923c' }}>.env</code> file and restart the development server.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                    {missing.map((key) => (
                        <li
                            key={key}
                            style={{
                                background: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '0.5rem',
                                padding: '0.5rem 1.25rem',
                                margin: '0.4rem 0',
                                fontFamily: 'monospace',
                                color: '#f87171',
                                fontSize: '0.95rem',
                            }}
                        >
                            {key}
                        </li>
                    ))}
                </ul>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Add the missing keys to <code>.env</code> in the project root.
                </p>
            </div>
        );
    }

    return <>{children}</>;
};
