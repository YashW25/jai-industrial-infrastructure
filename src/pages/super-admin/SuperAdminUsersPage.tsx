import { useEffect, useState } from 'react';
import { Shield, Plus, Trash2, Loader2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = { id: string; user_id: string; role: string; email?: string };

const ROLE_COLORS: Record<string, string> = {
    super_admin: 'bg-red-900/50 text-red-300 border-red-700',
    admin: 'bg-orange-900/50 text-orange-300 border-orange-700',
    editor: 'bg-blue-900/50 text-blue-300 border-blue-700',
    user: 'bg-slate-700/50 text-slate-300 border-slate-600',
};

const SuperAdminUsersPage = () => {
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState<string>('admin');
    const [adding, setAdding] = useState(false);

    const fetchRoles = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('user_roles').select('*');
        if (error) { toast.error(error.message); setLoading(false); return; }

        // Enrich with emails from auth.users via an RPC or just show user_id truncated
        const enriched = (data || []).map(r => ({
            ...r,
            email: r.user_id, // Will show user_id — only super admins can access auth.users via service role
        }));
        setRoles(enriched);
        setLoading(false);
    };

    useEffect(() => { fetchRoles(); }, []);

    const handleAddRole = async () => {
        if (!newEmail.trim()) { toast.error('Enter a user ID or email'); return; }
        setAdding(true);
        try {
            // Try to find user by email first
            const { data: inserted, error } = await supabase
                .from('user_roles')
                .insert({ user_id: newEmail.trim(), role: newRole })
                .select();
            if (error) throw error;
            toast.success('Role assigned');
            setNewEmail('');
            fetchRoles();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (id: string) => {
        const { error } = await supabase.from('user_roles').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Role removed');
        fetchRoles();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-600/30">
                    <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">User Role Management</h1>
                    <p className="text-slate-400 text-sm">Assign and remove admin roles</p>
                </div>
            </div>

            {/* Add Role */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        <Plus className="h-4 w-4 text-green-400" /> Assign New Role
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="User UUID (from Supabase Auth)"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                            className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
                        />
                        <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger className="w-40 bg-slate-900 border-slate-700 text-slate-100">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                <SelectItem value="super_admin">super_admin</SelectItem>
                                <SelectItem value="admin">admin</SelectItem>
                                <SelectItem value="editor">editor</SelectItem>
                                <SelectItem value="user">user</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAddRole} disabled={adding} className="bg-green-600 hover:bg-green-700 text-white">
                            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Assign
                        </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        💡 Find user UUIDs in your Supabase Dashboard → Authentication → Users
                    </p>
                </CardContent>
            </Card>

            {/* Roles Table */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-400" /> All Assigned Roles ({roles.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                        </div>
                    ) : roles.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-8">No roles assigned yet</p>
                    ) : (
                        <div className="space-y-2">
                            {roles.map(r => (
                                <div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Badge className={`${ROLE_COLORS[r.role] || ROLE_COLORS.user} border text-xs font-semibold shrink-0`}>
                                            {r.role}
                                        </Badge>
                                        <span className="text-slate-300 text-sm font-mono truncate">{r.user_id}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemove(r.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SuperAdminUsersPage;
