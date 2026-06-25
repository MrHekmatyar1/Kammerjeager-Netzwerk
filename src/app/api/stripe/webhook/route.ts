import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
        return NextResponse.json({ error: 'Missing stripe signature or secret' }, { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err: any) {
        console.error('[stripe/webhook] Signature error:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const masterId = session.client_reference_id || session.metadata?.master_id;
        const creditsAdded = parseInt(session.metadata?.credits_added || '0', 10);

        if (masterId && creditsAdded > 0) {
            const supabase = supabaseAdmin();
            
            // Get current credits
            const { data: master } = await supabase
                .from('masters')
                .select('credits')
                .eq('id', masterId)
                .single();
                
            const currentCredits = master?.credits || 0;
            const newCredits = currentCredits + creditsAdded;

            // Update master
            const { error } = await supabase
                .from('masters')
                .update({ credits: newCredits })
                .eq('id', masterId);
                
            if (error) {
                console.error('[stripe/webhook] Error updating credits:', error);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }
            
            console.log(`[stripe/webhook] Successfully added ${creditsAdded} credits to Master ${masterId}`);
        } else {
            console.error('[stripe/webhook] Missing masterId or credits_added in session metadata');
        }
    }

    return NextResponse.json({ received: true });
}
