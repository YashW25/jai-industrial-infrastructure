import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_PUBLISHABLE_KEY = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.*)/)[1].trim();
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY);

async function run() {
    const { data, error } = await supabase.from('clubs').select('*').limit(1);
    if (error) console.log('ERROR:', error);
    if (data) {
        if (data.length > 0) console.log('Data keys:', Object.keys(data[0]));
        else console.log('No data, but query succeeded meaning columns exist...?');
    }

    // To check if 'address' actually exists when empty
    const { error: e2 } = await supabase.from('clubs').select('address').limit(1);
    console.log('Address test:', e2 || 'SUCCESS');

    // To check if 'email' and 'phone' actually exist when empty
    const { error: e3 } = await supabase.from('clubs').select('email, phone').limit(1);
    console.log('Email/Phone test:', e3 || 'SUCCESS');

    // Let's check the schema directly via a deliberate invalid column request
    const { error: e4 } = await supabase.from('clubs').select('this_does_not_exist').limit(1);
    console.log('Schema dump:', e4);
}
run();
