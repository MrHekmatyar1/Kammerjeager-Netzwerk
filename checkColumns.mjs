import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'leads' });
    if (error) {
        // If RPC doesn't exist, we can't query information_schema directly from PostgREST unless we have a view.
        // Let's just do a manual insert with all columns and see which one fails.
        const entry = {
            id: 1,
            plz: '12345',
            name: 'test',
            erstellt_am: new Date().toISOString()
        };
        const { error: insertError } = await supabase.from('leads').insert([entry]);
        console.error(insertError);
    }
}
check();
