// POST /api/leads/complete — партнёр закрывает заказ с итоговой суммой
// Сохраняет invoice_amount, вычисляет commission_amount (20%)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

const COMMISSION_RATE = 0.20; // 20% комиссия

const supabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        // Проверка авторизации
        const serverClient = await createServerClient();
        const { data: { user } } = await serverClient.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
        }

        const { leadId, invoiceAmount } = await req.json();

        if (!leadId) {
            return NextResponse.json({ error: 'Lead-ID fehlt.' }, { status: 400 });
        }

        const amount = parseFloat(invoiceAmount);
        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: 'Ungültiger Rechnungsbetrag.' }, { status: 400 });
        }

        const supabase = supabaseAdmin();

        // Находим мастера
        const { data: master } = await supabase
            .from('masters')
            .select('id, name')
            .or(`email.eq.${user.email},user_id.eq.${user.id}`)
            .single();

        if (!master) {
            return NextResponse.json({ error: 'Kein Partner-Profil gefunden.' }, { status: 403 });
        }

        // Проверяем что лид принадлежит этому партнёру
        const { data: lead, error: fetchError } = await supabase
            .from('leads')
            .select('id, status, master_id, schaedling, plz')
            .eq('id', leadId)
            .eq('master_id', master.id)
            .single();

        if (fetchError || !lead) {
            return NextResponse.json({ error: 'Lead nicht gefunden.' }, { status: 404 });
        }

        if (lead.status === 'abgeschlossen') {
            return NextResponse.json({ error: 'Auftrag ist bereits abgeschlossen.' }, { status: 409 });
        }

        if (lead.status === 'storniert') {
            return NextResponse.json({ error: 'Stornierte Aufträge können nicht abgeschlossen werden.' }, { status: 409 });
        }

        const commissionAmount = Math.round(amount * COMMISSION_RATE * 100) / 100;

        // Обновляем лид
        const { error: updateError } = await supabase
            .from('leads')
            .update({
                status: 'abgeschlossen',
                invoice_amount: amount,
                commission_amount: commissionAmount,
                completed_at: new Date().toISOString(),
            })
            .eq('id', leadId);

        if (updateError) {
            console.error('[complete] Update error:', updateError);
            return NextResponse.json({ error: 'Fehler beim Abschließen.' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            invoiceAmount: amount,
            commissionAmount,
            commissionRate: COMMISSION_RATE,
        });
    } catch (err) {
        console.error('[leads/complete] Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}
