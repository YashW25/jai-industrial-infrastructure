import fs from 'fs';
import path from 'path';

const file = path.resolve('y:/materproject-yash-main/materproject-yash-main/src/hooks/useAdminData.ts');
let content = fs.readFileSync(file, 'utf8');

// 1. Add import
if (!content.includes('logAdminAction')) {
    content = content.replace(
        `import { toast } from 'sonner';`,
        `import { toast } from 'sonner';\nimport { logAdminAction } from '@/utils/auditLogger';`
    );
}

// 2. Replace upserts
const tables = [
    'organization_settings',
    'services',
    'projects',
    'testimonials',
    'team_members',
    'blog_posts',
    'gallery',
    'downloads',
    'homepage_sections',
    'seo_settings'
];

tables.forEach(table => {
    // Upsert
    const upsertRegex = new RegExp(
        `const { data, error } = await supabase\\.from\\('${table}'\\)\\.upsert\\(payload\\)\\.select\\(\\)\\.single\\(\\);\\s+if \\(error\\) throw error;\\s+return data;`,
        'g'
    );
    content = content.replace(upsertRegex, `const { data, error } = await supabase.from('${table}').upsert(payload).select().single();
      if (error) throw error;
      await logAdminAction(payload.id ? 'UPDATE' : 'INSERT', '${table}', data.id, null, data);
      return data;`);

    // Delete
    const deleteRegex = new RegExp(
        `const { error } = await supabase\\.from\\('${table}'\\)\\.delete\\(\\)\\.eq\\('id', id\\);\\s+if \\(error\\) throw error;`,
        'g'
    );

    // Organization settings and seo_settings might not have delete, that's fine.
    // We use Soft Delete (deleted_at)
    content = content.replace(deleteRegex, `const { error } = await supabase.from('${table}').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      await logAdminAction('DELETE', '${table}', id);`);
});

fs.writeFileSync(file, content);
console.log('Hooks updated successfully.');
