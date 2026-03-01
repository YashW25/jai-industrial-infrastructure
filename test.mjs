import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=[\"\']?(.*?)[\"\']?(?:\n|\r|$)/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=[\"\']?(.*?)[\"\']?(?:\n|\r|$)/);
const url = urlMatch ? urlMatch[1] : null;
const key = keyMatch ? keyMatch[1] : null;

if (!url || !key) { console.log('Missing env'); process.exit(1); }

async function run() {
    try {
        const r1 = await fetch(url + '/rest/v1/user_profiles?select=*&user_id=eq.74530cb5-34bd-4842-8619-4059fe8e697d', {
            headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
        });
        console.log("user_profiles:", r1.status, await r1.text());

        const r2 = await fetch(url + '/rest/v1/platform_admins?select=*&user_id=eq.74530cb5-34bd-4842-8619-4059fe8e697d', {
            headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
        });
        console.log("platform_admins:", r2.status, await r2.text());
    } catch (err) {
        console.error(err);
    }
}
run();
