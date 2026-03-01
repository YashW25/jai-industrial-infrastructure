import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=[\"\']?(.*?)[\"\']?(?:\n|\r|$)/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=[\"\']?(.*?)[\"\']?(?:\n|\r|$)/);
const url = urlMatch ? urlMatch[1] : null;
const key = keyMatch ? keyMatch[1] : null;

async function run() {
    try {
        const r = await fetch(url + '/rest/v1/', { headers: { 'apikey': key, 'Authorization': 'Bearer ' + key } });
        const schema = await r.json();

        console.log("user_profiles columns:", Object.keys(schema.definitions.user_profiles?.properties || {}));
        console.log("platform_admins columns:", Object.keys(schema.definitions.platform_admins?.properties || {}));
        console.log("user_roles columns:", Object.keys(schema.definitions.user_roles?.properties || {}));
        console.log("clubs columns:", Object.keys(schema.definitions.clubs?.properties || {}));

    } catch (err) {
        console.error(err);
    }
}
run();
