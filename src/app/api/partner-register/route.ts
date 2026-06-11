import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase — add your keys to .env.local:
// NEXT_PUBLIC_SUPABASE_URL=...
// SUPABASE_SERVICE_ROLE_KEY=...
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            typ,          // 'schaedlingsbekaempfer' | 'kooperation'
            name,
            email,
            telefon,
            firma,
            plz,
            anmerkung,
            datenschutz,  // boolean
        } = body;

        // Validation
        if (!name || !email || !telefon || !typ || !datenschutz) {
            return NextResponse.json(
                { error: 'Pflichtfelder fehlen.' },
                { status: 400 }
            );
        }

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Ungültige E-Mail-Adresse.' },
                { status: 400 }
            );
        }

        // If Supabase is configured — save to DB
        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);

            const { error: dbError } = await supabase
                .from('partner_anfragen')
                .insert([{
                    typ,
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    telefon: telefon.trim(),
                    firma: firma?.trim() || null,
                    plz: plz?.trim() || null,
                    anmerkung: anmerkung?.trim() || null,
                    erstellt_am: new Date().toISOString(),
                    status: 'neu',
                }]);

            if (dbError) {
                console.error('[partner-register] Supabase error:', dbError);
                // Save to fallback JSON file if Supabase fails
                await saveFallback(body);
            }
        } else {
            // No Supabase — save to fallback JSON file locally
            await saveFallback(body);
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[partner-register] Error:', err);
        return NextResponse.json(
            { error: 'Server-Fehler. Bitte versuchen Sie es später erneut.' },
            { status: 500 }
        );
    }
}

// Fallback: save to a local JSON file
async function saveFallback(data: Record<string, unknown>) {
    const { readFileSync, writeFileSync, mkdirSync, existsSync } = await import('fs');
    const { join } = await import('path');

    const dir = join(process.cwd(), 'data');
    const file = join(dir, 'partner_anfragen.json');

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    let entries: unknown[] = [];
    if (existsSync(file)) {
        try { entries = JSON.parse(readFileSync(file, 'utf8')); } catch { entries = []; }
    }

    entries.push({ ...data, erstellt_am: new Date().toISOString(), status: 'neu' });
    writeFileSync(file, JSON.stringify(entries, null, 2), 'utf8');
}
