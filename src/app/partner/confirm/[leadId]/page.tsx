import { redirect } from 'next/navigation';
import { createClient as createServerClient } from '@/lib/supabase/server';
import ConfirmClient from './ConfirmClient';

export default async function PartnerConfirmPage({ params }: { params: { leadId: string } }) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login if not authenticated
        redirect(`/?next=/partner/confirm/${params.leadId}`);
    }

    // Fetch the lead
    const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', params.leadId)
        .single();

    if (!lead) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                <h2>Auftrag nicht gefunden</h2>
            </div>
        );
    }

    // Check if it belongs to the current user
    const { data: master } = await supabase
        .from('masters')
        .select('id, billing_model')
        .or(`email.eq.${user.email},user_id.eq.${user.id}`)
        .single();

    if (!master || lead.master_id !== master.id) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                <h2>Kein Zugriff auf diesen Auftrag</h2>
            </div>
        );
    }

    if (lead.status === 'abgeschlossen') {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
                <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '400px', margin: '40px auto' }}>
                    <div style={{ fontSize: '48px', margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>✅</div>
                    <h2 style={{ color: '#0f172a', marginBottom: '12px', fontSize: '20px' }}>Bereits abgeschlossen</h2>
                    <p style={{ color: '#475569', fontSize: '15px' }}>Dieser Auftrag wurde bereits erfolgreich abgeschlossen.</p>
                </div>
            </div>
        );
    }

    return (
        <ConfirmClient lead={lead} billingModel={master.billing_model || 'pay_per_lead'} />
    );
}
