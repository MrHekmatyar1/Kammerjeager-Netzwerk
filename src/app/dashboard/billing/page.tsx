'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardBilling() {
    const [buying, setBuying] = useState(false);
    const [error, setError] = useState('');
    const [credits, setCredits] = useState<number | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: master } = await supabase
                    .from('masters')
                    .select('credits')
                    .or(`email.eq.${user.email},user_id.eq.${user.id}`)
                    .single();
                if (master) {
                    setCredits(Number(master.credits) || 0);
                }
            }
        };
        fetchCredits();
    }, [supabase]);

    const handleBuy = async (amount: number) => {
        try {
            setBuying(true);
            setError('');
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Fehler beim Erstellen der Zahlung');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Zahlung fehlgeschlagen');
            setBuying(false);
        }
    };

    return (
        <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a', lineHeight: 1 }}>
                Abrechnung
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
                Verwalten Sie Ihre Zahlungsmethoden und Rechnungen über Stripe Connect.
            </p>

            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle className="w-5 h-5" />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{error}</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* Stripe Status */}
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '320px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 91, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <path d="M2 10h20" />
                            </svg>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Stripe Account</h3>
                            <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                                Nicht verbunden
                            </div>
                        </div>
                    </div>

                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                        Um Leads auf Provisionsbasis zu erhalten, müssen Sie Ihr Bankkonto oder eine Kreditkarte über Stripe hinterlegen.
                        Es fallen nur Gebühren an, wenn Sie einen Auftrag erfolgreich abschließen.
                    </p>

                    <button style={{
                        width: '100%', background: '#635BFF', color: '#fff', border: 'none', padding: '12px',
                        borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'opacity 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                        Mit Stripe verbinden
                    </button>
                </div>

                {/* Balance */}
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '320px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Plattform-Guthaben</h3>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', marginBottom: '8px', lineHeight: 1 }}>
                        {credits !== null ? credits.toFixed(2).replace('.', ',') : '0,00'} <span style={{ fontSize: '16px', color: '#94a3b8' }}>€</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px', flex: 1 }}>
                        Alternativ können Sie Guthaben aufladen, um Leads zum Festpreis (CPL) zu kaufen, anstatt Provision zu zahlen.
                    </p>

                    <button
                        onClick={() => handleBuy(50)}
                        disabled={buying}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
                        style={{
                            width: '100%', border: 'none', padding: '12px',
                            borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: buying ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                            transition: 'all 0.2s', opacity: buying ? 0.7 : 1
                        }}
                    >
                        <CreditCard className="w-4 h-4" />
                        {buying ? 'Lädt...' : 'Jetzt aufladen'}
                    </button>
                </div>
            </div>



            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Vergangene Rechnungen</h3>
            <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                Sie haben noch keine Rechnungen erhalten.
            </div>
        </div>
    );
}
