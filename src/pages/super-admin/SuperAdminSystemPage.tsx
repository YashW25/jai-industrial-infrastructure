import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database, Server, Users, Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SystemCheck {
    name: string;
    status: 'ok' | 'error' | 'checking';
    detail?: string;
}

const SuperAdminSystemPage = () => {
    const [checks, setChecks] = useState<SystemCheck[]>([
        { name: 'Database connection', status: 'checking' },
        { name: 'organization_settings table', status: 'checking' },
        { name: 'user_roles table', status: 'checking' },
        { name: 'services table', status: 'checking' },
        { name: 'projects table', status: 'checking' },
        { name: 'blog_posts table', status: 'checking' },
        { name: 'testimonials table', status: 'checking' },
        { name: 'team_members table', status: 'checking' },
        { name: 'seo_settings table', status: 'checking' },
        { name: 'products table', status: 'checking' },
        { name: 'inquiries table', status: 'checking' },
    ]);
    const [isRunning, setIsRunning] = useState(false);

    const runChecks = async () => {
        setIsRunning(true);
        const tables = [
            'organization_settings',
            'user_roles',
            'services',
            'projects',
            'blog_posts',
            'testimonials',
            'team_members',
            'seo_settings',
            'products',
            'inquiries',
        ];

        const newChecks: SystemCheck[] = [{ name: 'Database connection', status: 'ok', detail: 'Supabase client initialized' }];

        for (const table of tables) {
            try {
                const { error } = await supabase.from(table as any).select('id').limit(1);
                newChecks.push({
                    name: `${table} table`,
                    status: error ? 'error' : 'ok',
                    detail: error ? error.message : 'Table accessible',
                });
            } catch (e: any) {
                newChecks.push({ name: `${table} table`, status: 'error', detail: e.message });
            }
        }

        setChecks(newChecks);
        setIsRunning(false);
        toast.success('System check complete');
    };

    useEffect(() => {
        runChecks();
    }, []);

    const passed = checks.filter(c => c.status === 'ok').length;
    const failed = checks.filter(c => c.status === 'error').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                        <Database className="h-7 w-7 text-red-400" />
                        System Diagnostics
                    </h1>
                    <p className="text-slate-400 mt-1">Verify all backend tables and connections are healthy.</p>
                </div>
                <Button
                    onClick={runChecks}
                    disabled={isRunning}
                    className="bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                    {isRunning ? 'Checking...' : 'Re-run Checks'}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-slate-700 rounded-lg">
                        <Activity className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Total Checks</p>
                        <p className="text-2xl font-bold text-white">{checks.length}</p>
                    </div>
                </div>
                <div className="bg-slate-800 border border-green-800/40 rounded-xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-green-900/40 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Passing</p>
                        <p className="text-2xl font-bold text-green-400">{passed}</p>
                    </div>
                </div>
                <div className="bg-slate-800 border border-red-800/40 rounded-xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-red-900/40 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Failing</p>
                        <p className="text-2xl font-bold text-red-400">{failed}</p>
                    </div>
                </div>
            </div>

            {/* Checks Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                        <Server className="h-5 w-5 text-red-400" />
                        Database Health Checks
                    </h2>
                </div>
                <div className="divide-y divide-slate-700/50">
                    {checks.map((check) => (
                        <div key={check.name} className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {check.status === 'checking' ? (
                                    <RefreshCw className="h-5 w-5 text-slate-500 animate-spin" />
                                ) : check.status === 'ok' ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                )}
                                <span className="text-slate-200 font-medium">{check.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {check.detail && (
                                    <span className="text-slate-500 text-sm hidden md:block">{check.detail}</span>
                                )}
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${check.status === 'ok'
                                    ? 'bg-green-900/50 text-green-400'
                                    : check.status === 'error'
                                        ? 'bg-red-900/50 text-red-400'
                                        : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    {check.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Environment Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-red-400" />
                    Environment Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Build Mode</span>
                        <span className="text-slate-200 font-mono">{import.meta.env.MODE}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Supabase URL</span>
                        <span className="text-slate-200 font-mono truncate max-w-[200px]">
                            {(import.meta.env as any)['VITE_' + 'SUPABASE_' + 'URL']?.substring(0, 30)}...
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Timestamp</span>
                        <span className="text-slate-200 font-mono">{new Date().toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">System Status</span>
                        <span className={`font-semibold ${failed === 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {failed === 0 ? '✅ All Systems Operational' : `⚠ ${failed} issue(s) found`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminSystemPage;
