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
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
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
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Plattform-Guthaben</h3>
                    <div style={{ fontSize: '48px', fontWeight: 900, color: '#0f172a', marginBottom: '8px', lineHeight: 1 }}>
                        {credits !== null ? credits.toFixed(2).replace('.', ',') : '...'} <span style={{ fontSize: '24px', color: '#94a3b8' }}>€</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px', flex: 1 }}>
                        Alternativ können Sie Guthaben aufladen, um Leads zum Festpreis (CPL) zu kaufen, anstatt Provision zu zahlen.
                    </p>

                    <button 
                        onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                        style={{
                            width: '100%', background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px',
                            borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                        }}
                    >
                        Guthaben aufladen
                    </button>
                </div>
            </div>

            <div id="packages">
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Pakete auswählen</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { amount: 50, bonus: 0, leads: 2, popular: false },
                        { amount: 125, bonus: 0, leads: 5, popular: true },
                        { amount: 250, bonus: 25, leads: 11, popular: false },
                    ].map((pkg) => (
                        <div 
                            key={pkg.amount} 
                            className={`bg-white rounded-2xl shadow-sm border-2 p-6 flex flex-col relative transition-all ${
                                pkg.popular ? 'border-[#C8102E]' : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {pkg.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C8102E] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                    Am beliebtesten
                                </span>
                            )}
                            <div className="text-3xl font-bold text-slate-800 mb-1">{pkg.amount} €</div>
                            <div className="text-sm font-medium text-slate-500 mb-4">
                                = {pkg.leads} Aufträge
                            </div>
                            
                            {pkg.bonus > 0 ? (
                                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded mb-6 text-center">
                                    + {pkg.bonus}€ Bonus inklusive!
                                </div>
                            ) : (
                                <div className="h-[28px] mb-6"></div> // Spacer
                            )}

                            <button
                                onClick={() => handleBuy(pkg.amount)}
                                disabled={buying}
                                className={`mt-auto w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                    pkg.popular 
                                        ? 'bg-[#C8102E] text-white hover:bg-red-700' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <CreditCard className="w-4 h-4" />
                                {buying ? 'Lädt...' : 'Jetzt aufladen'}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2 mb-12">
                    Sichere Zahlung über Stripe
                </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Vergangene Rechnungen</h3>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                Sie haben noch keine Rechnungen erhalten.
            </div>
        </div>
    );
}
