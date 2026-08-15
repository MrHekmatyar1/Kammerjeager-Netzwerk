// GET /api/partner/leads?status=neu,angenommen — лиды текущего партнёра
// PATCH /api/partner/leads — обновление статуса лида (in_arbeit)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

const supabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── GET: список лидов партнёра ────────────────────────────────────────────
export async function GET(req: NextRequest) {
    try {
        const serverClient = await createServerClient();
        const { data: { user } } = await serverClient.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
        }

        const supabase = supabaseAdmin();

        // Найти мастера по email или user_id
        const { data: master, error: masterError } = await supabase
            .from('masters')
            .select('id, name, email')
            .or(`email.eq.${user.email},user_id.eq.${user.id}`)
            .maybeSingle();

        if (masterError) {
            console.error('[partner/leads] Master lookup error:', masterError);
            return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
        }

        if (!master) {
            // Партнёр ещё не в БД — возвращаем пустой массив
            return NextResponse.json({ leads: [], master: null });
        }

        // Фильтр по статусам (опционально из query params)
        const { searchParams } = new URL(req.url);
        const statusParam = searchParams.get('status');
        const statuses = statusParam
            ? statusParam.split(',').map(s => s.trim())
            : ['neu', 'angenommen', 'in_arbeit', 'abgeschlossen', 'storniert'];

        let query = supabase
            .from('leads')
            .select('*')
            .eq('master_id', master.id)
            .in('status', statuses)
            .order('created_at', { ascending: false });

        const { data: leads, error: leadsError } = await query;

        if (leadsError) {
            console.error('[partner/leads] Leads fetch error:', leadsError);
            return NextResponse.json({ error: 'Fehler beim Laden der Leads.' }, { status: 500 });
        }

        return NextResponse.json({ leads: leads || [], master });
    } catch (err) {
        console.error('[partner/leads GET] Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}

// ─── PATCH: обновить статус лида (например: neu → in_arbeit) ──────────────
export async function PATCH(req: NextRequest) {
    try {
        const serverClient = await createServerClient();
        const { data: { user } } = await serverClient.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
        }

        const { leadId, status } = await req.json();
        const ALLOWED_STATUSES = ['angenommen', 'in_arbeit', 'kontaktiert', 'termin_vereinbart'];
        if (!leadId || !status || !ALLOWED_STATUSES.includes(status)) {
            return NextResponse.json({ error: 'Ungültige Parameter.' }, { status: 400 });
        }

        const supabase = supabaseAdmin();

        const { data: master } = await supabase
            .from('masters')
            .select('id')
            .or(`email.eq.${user.email},user_id.eq.${user.id}`)
            .single();

        if (!master) {
            return NextResponse.json({ error: 'Kein Partner-Profil.' }, { status: 403 });
        }

        const { error } = await supabase
            .from('leads')
            .update({ status })
            .eq('id', leadId)
            .eq('master_id', master.id);

        if (error) {
            return NextResponse.json({ error: 'Fehler beim Aktualisieren.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, status });
    } catch (err) {
        console.error('[partner/leads PATCH] Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}
