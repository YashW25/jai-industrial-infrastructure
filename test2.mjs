import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=[\"\']?(.*?)[\"\']?(?:\n|\r|$)/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=[\"\']?(.*?)[\"\']?(?:\n|\r|$)/);
const url = urlMatch ? urlMatch[1] : null;
const key = keyMatch ? keyMatch[1] : null;

async function run() {
    try {
        const r1 = await fetch(url + '/rest/v1/user_profiles?limit=1', { headers: { 'apikey': key, 'Authorization': 'Bearer ' + key } });
        console.log("user_profiles schema:", Object.keys((await r1.json())[0] || {}));

        const r2 = await fetch(url + '/rest/v1/platform_admins?limit=1', { headers: { 'apikey': key, 'Authorization': 'Bearer ' + key } });
        console.log("platform_admins schema:", Object.keys((await r2.json())[0] || {}));

        const r3 = await fetch(url + '/rest/v1/user_roles?limit=1', { headers: { 'apikey': key, 'Authorization': 'Bearer ' + key } });
        console.log("user_roles schema:", Object.keys((await r3.json())[0] || {}).length ? Object.keys((await r3.json())[0] || {}) : await r3.text());

    } catch (err) {
        console.error(err);
    }
}
run();
