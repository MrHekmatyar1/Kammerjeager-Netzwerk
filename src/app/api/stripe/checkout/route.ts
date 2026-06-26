import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const serverClient = await createServerClient();
        const { data: { user } } = await serverClient.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
        }

        const { amount } = await req.json(); // e.g. 50, 100, 250 (in Euros)
        
        if (!amount || amount < 10) {
            return NextResponse.json({ error: 'Ungültiger Betrag' }, { status: 400 });
        }

        const supabase = supabaseAdmin();
        const { data: master } = await supabase
            .from('masters')
            .select('id, email, name')
            .or(`email.eq.${user.email},user_id.eq.${user.id}`)
            .single();

        if (!master) {
            return NextResponse.json({ error: 'Partner-Profil nicht gefunden' }, { status: 404 });
        }

        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const origin = `${protocol}://${host}`;

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'paypal'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Kammerjaeger-Zentrale Guthaben`,
                            description: `Aufladung von ${amount}€ Guthaben für Leads`,
                        },
                        unit_amount: amount * 100, // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/dashboard/billing?success=true`,
            cancel_url: `${origin}/dashboard/billing?canceled=true`,
            customer_email: master.email, // Pre-fill email
            client_reference_id: master.id.toString(), // Extremely important: To identify the master in webhook
            metadata: {
                master_id: master.id.toString(),
                credits_added: amount.toString()
            }
        });

        return NextResponse.json({ url: session.url });

    } catch (err: any) {
        console.error('[stripe/checkout] Error:', err);
        return NextResponse.json({ error: err.message || 'Server-Fehler' }, { status: 500 });
    }
}
