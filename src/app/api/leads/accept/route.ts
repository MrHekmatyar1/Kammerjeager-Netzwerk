// POST /api/leads/accept — партнёр принимает лид
// Меняет статус на 'angenommen', уведомляет клиента

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { sendClientStatusUpdate, sendCompletionLinkEmail } from '@/lib/email/resend';
import { getLeadPricing } from '@/lib/pricing';

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
            .select('id, name, email, credits, billing_model')
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

        const pricing = getLeadPricing(lead.schaedling, master.billing_model || 'pay_per_lead', lead.billing_override_type, lead.billing_override_value);
        let deductAmount = 0;
        
        if (pricing.type === 'fixed') {
            deductAmount = pricing.numericValue;
        }

        if (deductAmount > 0 && (master.credits || 0) < deductAmount) {
            return NextResponse.json({ error: `Nicht genügend Guthaben. Preis: ${deductAmount} €. Bitte laden Sie Ihr Konto auf.` }, { status: 402 });
        }

        // Меняем статус на 'angenommen' и списываем кредиты
        const { error: updateError } = await supabase
            .from('leads')
            .update({
                status: 'angenommen',
                accepted_at: new Date().toISOString(),
            })
            .eq('id', leadId);

        if (updateError) {
            console.error('[accept] Update error:', updateError);
            return NextResponse.json({ error: 'Fehler beim Aktualisieren des Leads.' }, { status: 500 });
        }

        // Deduct credits if needed
        if (deductAmount > 0) {
            await supabase
                .from('masters')
                .update({ credits: master.credits - deductAmount })
                .eq('id', master.id);
        }

        // Email клиенту: подтверждение что эксперт найден (задержка 10 минут)
        const emailResult = await sendClientStatusUpdate(lead, master.name || undefined, 10);
        
        if (emailResult?.success && emailResult.data?.id) {
            await supabase
                .from('leads')
                .update({ client_notif_email_id: emailResult.data.id })
                .eq('id', leadId);
        }

        // Email мастеру: ссылка для завершения заказа (отправляется без задержки)
        await sendCompletionLinkEmail(master.email, master.name || 'Partner', lead);

        return NextResponse.json({ success: true, status: 'angenommen' });
    } catch (err) {
        console.error('[leads/accept] Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}
