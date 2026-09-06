import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendTerminUpdateEmail } from '@/lib/email/resend';

export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || !user.email) {
            return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
        }

        const { leadId, name, telefon, termin_time } = await req.json();

        if (!leadId) {
            return NextResponse.json({ error: 'Lead ID fehlt.' }, { status: 400 });
        }

        // Верify that the lead belongs to the user
        const { data: existingLead, error: leadError } = await supabase
            .from('leads')
            .select('id, master_id')
            .eq('id', leadId)
            .eq('email', user.email)
            .single();

        if (leadError || !existingLead) {
            return NextResponse.json({ error: 'Auftrag nicht gefunden oder kein Zugriff.' }, { status: 404 });
        }

        // Update the lead
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (telefon !== undefined) updateData.telefon = telefon;
        if (termin_time !== undefined) updateData.termin_time = termin_time;

        const { error: updateError } = await supabase
            .from('leads')
            .update(updateData)
            .eq('id', leadId)
            .select()
            .single();

        if (updateError) {
            console.error('[kunden/leads/update] Update error:', updateError);
            return NextResponse.json({ error: 'Fehler beim Speichern der Daten.' }, { status: 500 });
        }

        // If assigned to a master, notify the master
        if (existingLead.master_id) {
            const { data: master } = await supabase
                .from('masters')
                .select('email, name')
                .eq('id', existingLead.master_id)
                .single();

            if (master && master.email) {
                // We fetch the updated lead to have full context for the email
                const { data: updatedLead } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('id', leadId)
                    .single();
                    
                if (updatedLead) {
                    await sendTerminUpdateEmail(master.email, master.name || 'Partner', updatedLead);
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[kunden/leads/update] Server Error:', err);
        return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 });
    }
}
