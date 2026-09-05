// POST /api/leads — сохраняет лид, автоматически назначает партнёра
// Smart matching: 4km-Radius Haversine + load balancing (минимум активных лидов)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendAdminNotification, sendCustomerConfirmation, sendPartnerLeadNotification } from '@/lib/email/resend';
import { isWithinRadius, distanceBetweenPlz } from '@/lib/plzDistance';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ─── Умный поиск лучшего партнёра (4km Radius) ─────────────────────────────
// 1. Фильтр по is_active
// 2. Проверяем, что первый PLZ мастера находится в 4km от PLZ лида
// 3. Load balancing: выбираем партнёра с наименьшим числом активных лидов
async function findBestPartner(supabase: any, leadPlz: string) {
    const { data: masters, error } = await supabase
        .from('masters')
        .select('*')
        .eq('is_active', true);

    if (error || !masters || masters.length === 0) return null;

    // Фильтр по 4km радиусу от базовой PLZ мастера
    // Базовая точка = первый элемент plz_bereiche
    const eligible = masters.filter((m: any) => {
        if (!m.plz_bereiche || m.plz_bereiche.length === 0) return false;
        const masterHomePlz: string = m.plz_bereiche[0]; // первая PLZ = домашняя
        return isWithinRadius(masterHomePlz, leadPlz, 4);
    });

    if (eligible.length === 0) return null;
    if (eligible.length === 1) return eligible[0];

    // Load balancing: считаем активные лиды у каждого кандидата
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

    // Возвращаем партнёра с наименьшей нагрузкой. При равной нагрузке — того, кто ближе.
    return eligible.sort((a: any, b: any) => {
        const loadA = loadMap[a.id] || 0;
        const loadB = loadMap[b.id] || 0;
        if (loadA !== loadB) return loadA - loadB;

        // Если нагрузка равна, смотрим кто ближе
        const dA = distanceBetweenPlz(a.plz_bereiche[0], leadPlz);
        const dB = distanceBetweenPlz(b.plz_bereiche[0], leadPlz);
        return dA - dB;
    })[0];
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            plz, name, firma, telefon, email, schaedling, raeume, befall, zugang, zugangInfo,
            strasse, hausnummer, etage, kundeTyp, objektTyp, flaeche
        } = body;

        if (!name || !telefon || !email || !plz) {
            return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
        }

        const entry: Record<string, unknown> = {
            plz: plz?.trim(),
            name: name?.trim(),
            firma: firma?.trim() || null,
            telefon: telefon?.trim(),
            email: email?.trim().toLowerCase(),
            strasse: strasse?.trim() || null,
            hausnummer: hausnummer?.trim() || null,
            etage: etage?.trim() || null,
            kunde_typ: kundeTyp || null,
            objekt_typ: objektTyp || null,
            flaeche: flaeche || null,
            schaedling: schaedling || null,
            raeume: raeume || null,
            befall: befall || null,
            zugang: zugang || null,
            zugang_beschreibung: zugangInfo?.trim() || null,
            created_at: new Date().toISOString(),
            status: 'neu',
            master_id: null,
        };

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);

            // 1. Умный выбор партнёра
            const assignedMaster = await findBestPartner(supabase, entry.plz as string);

            if (assignedMaster) {
                entry.master_id = assignedMaster.id;
                entry.status = 'neu'; // назначен, ожидает принятия
            } else {
                entry.status = 'unassigned'; // никого нет в этой зоне
            }

            // 2. Сохраняем лид
            const { error: dbError } = await supabase.from('leads').insert([entry]);

            if (dbError) {
                console.error('[leads] Supabase error:', dbError);
                await saveFallback(entry);
            } else {
                // 3. Уведомляем партнёра (Telegram + Email)
                if (assignedMaster) {
                    // Telegram
                    if (assignedMaster.telegram_chat_id) {
                        const { sendTelegramMessage } = await import('@/lib/telegram');
                        const tgMessage =
                            `<b>Neuer Auftrag!</b>\n\n` +
                            `<b>PLZ:</b> ${entry.plz}\n` +
                            `<b>Schädling:</b> ${entry.schaedling || 'Nicht angegeben'}\n` +
                            `<b>Kundentyp:</b> ${entry.kunde_typ || ''} ${entry.objekt_typ ? `(${entry.objekt_typ})` : ''}\n` +
                            `<b>Befall:</b> ${entry.befall || '-'}, ${entry.raeume ? `${entry.raeume} Räume` : ''}\n\n` +
                            `Jetzt im Dashboard ansehen: https://kammerjaeger-structon.de/dashboard`;
                        sendTelegramMessage(assignedMaster.telegram_chat_id, tgMessage)
                            .catch(e => console.error('[TG] Send Error:', e));
                    }

                    // Email партнёру
                    if (assignedMaster.email) {
                        sendPartnerLeadNotification(assignedMaster.email, assignedMaster.name || '', entry)
                            .catch(e => console.error('[Email Partner] Error:', e));
                    }
                } else {
                    // Нет партнёра — уведомляем Admin
                    console.warn(`[leads] No partner found for PLZ ${entry.plz} — lead is UNASSIGNED`);
                }
            }

        } else {
            try {
                await saveFallback(entry);
            } catch (fsErr) {
                console.error('[leads] Fallback save failed:', fsErr);
            }
        }

        // Admin Telegram Notification (ALWAYS run)
        const adminTgId = process.env.ADMIN_TELEGRAM_CHAT_ID;
        
        if (adminTgId) {
            const { sendTelegramMessage } = await import('@/lib/telegram');
            const masterName = entry.master_id ? 'Ein Partner' : 'UNASSIGNED'; // simplification for fallback
            const tgMessage = 
                `<b>Neuer Lead eingegangen!</b>\n\n` +
                `<b>Name:</b> ${entry.name}\n` +
                `<b>Telefon:</b> <a href="tel:${entry.telefon}">${entry.telefon}</a>\n` +
                `<b>PLZ:</b> ${entry.plz}\n` +
                `<b>Schädling:</b> ${entry.schaedling || 'Nicht angegeben'}\n` +
                `<b>Kundentyp:</b> ${entry.kunde_typ || '-'}\n` +
                `<b>Status:</b> ${masterName}\n\n` +
                `<a href="https://kammerjaeger-structon.de/admin">Admin Dashboard öffnen</a>`;
            try {
                await sendTelegramMessage(adminTgId, tgMessage);
            } catch (e) {
                console.error('[Admin TG Error]:', e);
            }
        }

        // Email клиенту и Admin — всегда асинхронно
        sendAdminNotification(entry).catch(e => console.error('[Email Admin] Error:', e));
        sendCustomerConfirmation(entry).catch(e => console.error('[Email Customer] Error:', e));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[leads] Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}

async function saveFallback(data: Record<string, unknown>) {
    const { readFileSync, writeFileSync, mkdirSync, existsSync } = await import('fs');
    const { join } = await import('path');
    const dir = join(process.cwd(), 'data');
    const file = join(dir, 'leads.json');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    let entries: unknown[] = [];
    if (existsSync(file)) {
        try { entries = JSON.parse(readFileSync(file, 'utf8')); } catch { entries = []; }
    }
    entries.push(data);
    writeFileSync(file, JSON.stringify(entries, null, 2), 'utf8');
}
