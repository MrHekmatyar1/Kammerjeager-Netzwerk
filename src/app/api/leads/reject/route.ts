// POST /api/leads/reject — партнёр отклоняет лид
// Ищет следующего подходящего партнёра (re-assignment)
// Если никого нет — статус 'unassigned', уведомление Admin

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { sendPartnerLeadNotification, cancelScheduledEmail } from '@/lib/email/resend';
import { sendTelegramMessage } from '@/lib/telegram';

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

        const { leadId, reason } = await req.json();
        if (!leadId) {
            return NextResponse.json({ error: 'Lead-ID fehlt.' }, { status: 400 });
        }

        const supabase = supabaseAdmin();

        // Находим текущего мастера
        const { data: currentMaster } = await supabase
            .from('masters')
            .select('id, name, email')
            .or(`email.eq.${user.email},user_id.eq.${user.id}`)
            .single();

        if (!currentMaster) {
            return NextResponse.json({ error: 'Kein Partner-Profil gefunden.' }, { status: 403 });
        }

        // Проверяем что лид принадлежит этому партнёру
        const { data: lead, error: fetchError } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .eq('master_id', currentMaster.id)
            .single();

        if (fetchError || !lead) {
            return NextResponse.json({ error: 'Lead nicht gefunden.' }, { status: 404 });
        }

        if (!['neu', 'angenommen'].includes(lead.status)) {
            return NextResponse.json({ error: `Lead kann nicht abgelehnt werden (Status: ${lead.status})` }, { status: 409 });
        }

        // Ищем следующего подходящего партнёра в этой PLZ-зоне
        // Исключаем текущего (он отклонил)
        // Исключаем партнёров из поля rejected_by (если есть)
        const rejectedBy: string[] = lead.rejected_by || [];
        rejectedBy.push(currentMaster.id);

        const { data: allMasters } = await supabase
            .from('masters')
            .select('*')
            .eq('is_active', true)
            .not('id', 'in', `(${rejectedBy.join(',')})`);

        const eligible = (allMasters || []).filter((m: any) => {
            if (!m.plz_bereiche || m.plz_bereiche.length === 0) return false;
            return m.plz_bereiche.some((prefix: string) => lead.plz?.startsWith(prefix));
        });

        let newStatus = 'unassigned';
        let newMasterId = null;
        let nextMaster = null;

        if (eligible.length > 0) {
            // Load balancing среди оставшихся кандидатов
            const ACTIVE_STATUSES = ['neu', 'angenommen', 'in_arbeit'];
            const { data: activeLids } = await supabase
                .from('leads')
                .select('master_id')
                .in('status', ACTIVE_STATUSES)
                .in('master_id', eligible.map((m: any) => m.id));

            const loadMap: Record<string, number> = {};
            eligible.forEach((m: any) => { loadMap[m.id] = 0; });
            (activeLids || []).forEach((l: any) => {
                if (l.master_id) loadMap[l.master_id] = (loadMap[l.master_id] || 0) + 1;
            });

            nextMaster = eligible.sort((a: any, b: any) => (loadMap[a.id] || 0) - (loadMap[b.id] || 0))[0];
            newMasterId = nextMaster.id;
            newStatus = 'neu';
        }

        // Обновляем лид
        const updatePayload: any = {
            status: newStatus,
            master_id: newMasterId,
            rejected_by: rejectedBy,
            rejection_reason: reason || null,
            rejected_at: new Date().toISOString(),
        };

        // Если отменяется уже принятый лид (возврат средств)
        if (lead.status === 'angenommen') {
            const LEAD_PRICE = 25;
            // Refund the credits to current master
            const { data: currentMasterData } = await supabase
                .from('masters')
                .select('credits')
                .eq('id', currentMaster.id)
                .single();
                
            if (currentMasterData) {
                await supabase
                    .from('masters')
                    .update({ credits: (currentMasterData.credits || 0) + LEAD_PRICE })
                    .eq('id', currentMaster.id);
            }
        }

        // Если есть запланированное письмо клиенту, отменяем его
        if (lead.client_notif_email_id) {
            await cancelScheduledEmail(lead.client_notif_email_id);
            updatePayload.client_notif_email_id = null;
        }

        const { error: updateError } = await supabase
            .from('leads')
            .update(updatePayload)
            .eq('id', leadId);

        if (updateError) {
            console.error('[reject] Update error:', updateError);
            return NextResponse.json({ error: 'Fehler beim Aktualisieren.' }, { status: 500 });
        }

        // Уведомляем нового партнёра
        if (nextMaster) {
            if (nextMaster.telegram_chat_id) {
                const tgMessage =
                    `🔄 <b>Neuer Auftrag (Weitergeleitet)</b>\n\n` +
                    `<b>PLZ:</b> ${lead.plz}\n` +
                    `<b>Schädling:</b> ${lead.schaedling || 'Nicht angegeben'}\n` +
                    `<b>Befall:</b> ${lead.befall || '-'}\n\n` +
                    `📲 Jetzt im Dashboard: https://kammerjaeger-structon.de/dashboard`;
                sendTelegramMessage(nextMaster.telegram_chat_id, tgMessage)
                    .catch(e => console.error('[TG reject] Error:', e));
            }
            if (nextMaster.email) {
                sendPartnerLeadNotification(nextMaster.email, nextMaster.name || '', lead)
                    .catch(e => console.error('[Email reject] Error:', e));
            }
        } else {
            // Admin: лид без партнёра
            console.warn(`[leads/reject] Lead ${leadId} PLZ=${lead.plz} ist nun UNASSIGNED`);
        }

        return NextResponse.json({
            success: true,
            reassigned: !!nextMaster,
            newStatus,
        });
    } catch (err) {
        console.error('[leads/reject] Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}
