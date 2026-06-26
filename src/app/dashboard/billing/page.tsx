'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardBilling() {
    const [buying, setBuying] = useState(false);
    const [error, setError] = useState('');
    const [credits, setCredits] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<number | ''>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            if (!amount || amount < 10) {
                setError('Der Mindestbetrag beträgt 10 €');
                setBuying(false);
                return;
            }
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
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            width: '100%', background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px',
                            borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                        <CreditCard className="w-4 h-4" />
                        Jetzt aufladen
                    </button>
                </div>
            </div>



            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Vergangene Rechnungen</h3>
            <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                Sie haben noch keine Rechnungen erhalten.
            </div>

            {isModalOpen && (
                <>
                    <style>{`
                        @keyframes am-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes am-card-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    `}</style>
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.60)', zIndex: 99999, animation: 'am-backdrop-in 0.18s ease forwards', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setIsModalOpen(false)}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '400px', zIndex: 1 }}>
                            {/* Peeking Roach - Right Side */}
                            <img src="/pests/roach_runner.png" alt="Roach" style={{ position: 'absolute', top: '40px', right: '-35px', width: '100px', height: 'auto', transform: 'rotate(70deg)', zIndex: -1 }} />

                            <div style={{ background: '#fff', width: '100%', position: 'relative', zIndex: 10, animation: 'am-card-in 0.22s ease forwards', borderRadius: '16px', border: '2px solid #f0f0f0', boxShadow: '0 12px 48px rgba(0,0,0,0.12)', padding: '24px' }} onClick={e => e.stopPropagation()}>

                            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', border: '1px solid #edf0f4', background: '#fff', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>

                            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', marginBottom: '6px', textAlign: 'center', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase' }}>Guthaben aufladen</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', textAlign: 'center' }}>Geben Sie den gewünschten Betrag ein. Der Mindestbetrag ist 10 €.</p>
                            
                            <div style={{ position: 'relative', marginBottom: '16px' }}>
                                <input 
                                    type="number" min="10" 
                                    value={customAmount} onChange={e => setCustomAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                    style={{ width: '100%', padding: '10px 32px 10px 12px', fontSize: '14px', fontWeight: 600, color: '#0f172a', border: '1px solid #94a3b8', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                    placeholder="Betrag eingeben"
                                    onFocus={e => { e.currentTarget.style.borderColor = '#0f172a'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,23,42,0.1)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>€</span>
                            </div>

                            {error && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}

                            <div style={{ position: 'relative', zIndex: 20 }}>
                                {/* Peeking Roach - Under Confirm Button (Left Side) */}
                                <img src="/pests/roach_runner.png" alt="Roach" style={{ position: 'absolute', bottom: '-15px', left: '-45px', width: '90px', height: 'auto', transform: 'rotate(-120deg)', zIndex: 5 }} />
                                
                                <button
                                    onClick={() => {
                                        if (customAmount && customAmount >= 10) handleBuy(Number(customAmount));
                                        else setError('Bitte geben Sie einen gültigen Betrag (min. 10 €) ein.');
                                    }}
                                    disabled={buying || !customAmount || customAmount < 10}
                                    style={{ position: 'relative', zIndex: 10, width: '100%', background: (buying || !customAmount || customAmount < 10) ? '#94a3b8' : '#0f172a', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: (buying || !customAmount || customAmount < 10) ? 'not-allowed' : 'pointer', border: 'none', transition: 'all 0.2s', opacity: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    {buying ? 'Lädt...' : 'Jetzt aufladen'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
