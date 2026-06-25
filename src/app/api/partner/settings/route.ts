import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const serverClient = await createServerClient();
        const { data: { user } } = await serverClient.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
        }

        const supabase = supabaseAdmin();
        const { data: master, error } = await supabase
            .from('masters')
            .select('*')
            .or(`email.eq.${user.email},user_id.eq.${user.id}`)
            .maybeSingle();

        if (error) {
            console.error('[partner/settings GET] Error:', error);
            return NextResponse.json({ error: 'Datenbankfehler.' }, { status: 500 });
        }

        return NextResponse.json({ master: master || {} });
    } catch (err) {
        console.error('[partner/settings GET] Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const serverClient = await createServerClient();
        const { data: { user } } = await serverClient.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
        }

        const body = await req.json();
        const { 
            firma, name, telefon, service_plz, billing_model,
            is_active, telegram_chat_id, pests_handled 
        } = body;

        const supabase = supabaseAdmin();
        
        // Find master first
        const { data: master, error: lookupError } = await supabase
            .from('masters')
            .select('id')
            .or(`email.eq.${user.email},user_id.eq.${user.id}`)
            .maybeSingle();

        if (lookupError || !master) {
            return NextResponse.json({ error: 'Partner-Profil nicht gefunden.' }, { status: 404 });
        }

        // Convert UI fields to DB columns
        let plzArray = [];
        if (service_plz) {
            plzArray = service_plz.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        // Update settings
        const { error: updateError } = await supabase
            .from('masters')
            .update({
                firma: firma || null,
                name: name || null,
                phone: telefon || null,
                plz_bereiche: plzArray,
                billing_model: billing_model || 'commission',
                is_active: is_active !== false, // default true
                telegram_chat_id: telegram_chat_id || null,
                pests_handled: Array.isArray(pests_handled) ? pests_handled : []
            })
            .eq('id', master.id);

        if (updateError) {
            console.error('[partner/settings POST] Update Error:', updateError);
            
            // Helpful error if columns are missing
            if (updateError.message.includes('column') && updateError.message.includes('does not exist')) {
                return NextResponse.json({ 
                    error: `Datenbank-Fehler: Es fehlen Spalten in Supabase! Bitte erstellen Sie: "is_active" (boolean), "telegram_chat_id" (text), "pests_handled" (text) in der Tabelle "masters".`,
                    details: updateError.message
                }, { status: 400 });
            }

            return NextResponse.json({ error: 'Fehler beim Speichern der Daten.' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[partner/settings POST] Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}
