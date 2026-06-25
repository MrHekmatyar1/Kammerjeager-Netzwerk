import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendClientStatusUpdate } from '@/lib/email/resend';

// We use service role to bypass RLS for this specific one-click action
const supabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const leadId = searchParams.get('lead_id');
        const masterId = searchParams.get('master_id');

        if (!leadId || !masterId) {
            return new NextResponse('Missing parameters', { status: 400 });
        }

        const supabase = supabaseAdmin();

        // Check lead status
        const { data: lead, error: fetchError } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .eq('master_id', masterId)
            .single();

        if (fetchError || !lead) {
            return new NextResponse('Lead nicht gefunden.', { status: 404 });
        }

        if (lead.status !== 'neu') {
            // Already accepted or cancelled. Just redirect to dashboard.
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // Update status to 'angenommen'
        const { error: updateError } = await supabase
            .from('leads')
            .update({
                status: 'angenommen',
                accepted_at: new Date().toISOString(),
            })
            .eq('id', leadId);

        if (updateError) {
            console.error('[accept-from-email] Update error:', updateError);
            return new NextResponse('Fehler beim Aktualisieren.', { status: 500 });
        }

        // Get master details for the email
        const { data: master } = await supabase
            .from('masters')
            .select('name')
            .eq('id', masterId)
            .single();

        // Send delayed email to client (10 minutes)
        const emailResult = await sendClientStatusUpdate(lead, master?.name || undefined, 10);
        
        if (emailResult?.success && emailResult.data?.id) {
            // Save the scheduled email ID so we can cancel it later
            await supabase
                .from('leads')
                .update({ client_notif_email_id: emailResult.data.id })
                .eq('id', leadId);
        }

        // Redirect to dashboard with success message
        return NextResponse.redirect(new URL('/dashboard/orders?accepted=true', req.url));

    } catch (err) {
        console.error('[leads/accept-from-email] Error:', err);
        return new NextResponse('Server-Fehler.', { status: 500 });
    }
}
