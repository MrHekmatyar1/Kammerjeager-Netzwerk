import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || !user.email) {
            return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
        }

        // Fetch leads that belong to this email
        // Join with masters table to get partner contact info if assigned
        const { data: leads, error } = await supabase
            .from('leads')
            .select(`
                *,
                masters (
                    firma,
                    name,
                    telefon
                )
            `)
            .eq('email', user.email)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[kunden/leads] DB Error:', error);
            throw error;
        }

        return NextResponse.json({ leads });
    } catch (err) {
        console.error('[kunden/leads] Server Error:', err);
        return NextResponse.json({ error: 'Fehler beim Laden der Aufträge.' }, { status: 500 });
    }
}
