import fs from 'fs';

const targetPath = 'y:\\materproject-yash-main\\materproject-yash-main\\src\\integrations\\supabase\\types.ts';
let content = fs.readFileSync(targetPath, 'utf8');

const tablesToPatch = ['occasions'];

for (const tableName of tablesToPatch) {
    content = content.replace(
        new RegExp(`(${tableName}: \\{[\\s\\S]*?Row: \\{[\\s\\S]*?id: string\\n)`),
        `$1          status?: "draft" | "published" | "archived" | null\n`
    );

    content = content.replace(
        new RegExp(`(${tableName}: \\{[\\s\\S]*?Insert: \\{[\\s\\S]*?id\\?: string\\n)`),
        `$1          status?: "draft" | "published" | "archived" | null\n`
    );

    content = content.replace(
        new RegExp(`(${tableName}: \\{[\\s\\S]*?Update: \\{[\\s\\S]*?id\\?: string\\n)`),
        `$1          status?: "draft" | "published" | "archived" | null\n`
    );
}

fs.writeFileSync(targetPath, content);
console.log('Finished patching types.ts occasions table');
