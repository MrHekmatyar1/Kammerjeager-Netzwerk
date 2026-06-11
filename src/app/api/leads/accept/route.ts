// POST /api/leads/accept — партнёр принимает лид
// Меняет статус на 'angenommen', уведомляет клиента

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { sendClientStatusUpdate } from '@/lib/email/resend';

const supabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        // Проверка авторизации партнёра
        const serverClient = await createServerClient();
        const { data: { user } } = await serverClient.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
        }

        const { leadId } = await req.json();
        if (!leadId) {
            return NextResponse.json({ error: 'Lead-ID fehlt.' }, { status: 400 });
        }

        const supabase = supabaseAdmin();

        // Находим мастера по email текущего пользователя
        const { data: master } = await supabase
            .from('masters')
            .select('id, name, email')
            .or(`email.eq.${user.email},user_id.eq.${user.id}`)
            .single();

        if (!master) {
            return NextResponse.json({ error: 'Kein Partner-Profil gefunden.' }, { status: 403 });
        }

        // Проверяем что лид принадлежит этому партнёру
        const { data: lead, error: fetchError } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .eq('master_id', master.id)
            .single();

        if (fetchError || !lead) {
            return NextResponse.json({ error: 'Lead nicht gefunden oder nicht zugewiesen.' }, { status: 404 });
        }

        if (lead.status !== 'neu') {
            return NextResponse.json({ error: `Lead ist bereits im Status: ${lead.status}` }, { status: 409 });
        }

        // Меняем статус на 'angenommen'
        const { error: updateError } = await supabase
            .from('leads')
            .update({
                status: 'angenommen',
                accepted_at: new Date().toISOString(),
            })
            .eq('id', leadId);

        if (updateError) {
            console.error('[accept] Update error:', updateError);
            return NextResponse.json({ error: 'Fehler beim Aktualisieren.' }, { status: 500 });
        }

        // Email клиенту: подтверждение что эксперт найден
        sendClientStatusUpdate(lead, master.name || undefined)
            .catch(e => console.error('[accept] Client email error:', e));

        return NextResponse.json({ success: true, status: 'angenommen' });
    } catch (err) {
        console.error('[leads/accept] Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}
