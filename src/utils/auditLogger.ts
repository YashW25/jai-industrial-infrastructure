import { supabase } from '@/integrations/supabase/client';

export const logAdminAction = async (action: 'INSERT' | 'UPDATE' | 'DELETE', tableName: string, recordId?: string, oldData?: any, newData?: any) => {
    try {
        const { error } = await supabase.rpc('log_admin_action', {
            p_action: action,
            p_table_name: tableName,
            p_record_id: recordId,
            p_old_data: oldData || null,
            p_new_data: newData || null,
        });

        if (error) {
            console.error('Failed to log admin action:', error);
        }
    } catch (err) {
        console.error('Audit logging error:', err);
    }
};
