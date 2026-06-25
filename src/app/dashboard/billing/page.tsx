'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CreditCard, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BillingPage() {
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const error = searchParams.get('error');

    useEffect(() => {
        const fetchCredits = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase
                    .from('masters')
                    .select('credits')
                    .or(`email.eq.${session.user.email},user_id.eq.${session.user.id}`)
                    .single();
                setCredits(data?.credits || 0);
            }
            setLoading(false);
        };
        fetchCredits();
    }, []);

    const handleBuy = async (amount: number) => {
        setBuying(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Ein Fehler ist aufgetreten');
            }
        } catch (err) {
            console.error(err);
            alert('Netzwerkfehler');
        } finally {
            setBuying(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-slate-500">Lade Abrechnungsdaten...</div>;
    }

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Abrechnung & Guthaben</h1>

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-emerald-800 font-medium">Zahlung erfolgreich!</p>
                        <p className="text-emerald-700 text-sm mt-1">Ihr Guthaben wurde aufgeladen. Es kann 1-2 Minuten dauern, bis es oben angezeigt wird.</p>
                    </div>
                </div>
            )}

            {canceled && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                    Die Zahlung wurde abgebrochen.
                </div>
            )}

            {error === 'insufficient_funds' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-800 font-medium">Nicht genügend Guthaben</p>
                        <p className="text-red-700 text-sm mt-1">Sie müssen Ihr Guthaben aufladen, um diesen Auftrag annehmen zu können (Kosten: 25€ pro Auftrag).</p>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Current Balance Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:col-span-1">
                    <div className="flex items-center gap-3 mb-4 text-slate-500 font-medium">
                        <Wallet className="w-5 h-5" />
                        Aktuelles Guthaben
                    </div>
                    <div className="text-4xl font-bold text-slate-800">
                        {credits.toFixed(2)} <span className="text-xl text-slate-500 font-normal">€</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                        Ausreichend für {Math.floor(credits / 25)} Aufträge
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:col-span-2">
                    <h3 className="font-bold text-slate-800 mb-2">Wie funktioniert es?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        Um Aufträge über unser Netzwerk anzunehmen, benötigen Sie Guthaben. 
                        Jeder angenommene Auftrag kostet pauschal <strong>25,00 €</strong>.
                        Das Guthaben wird nur abgebucht, wenn Sie den Auftrag erfolgreich annehmen.
                    </p>
                    <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Keine versteckten Gebühren oder monatliche Fixkosten
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Volle Kostenkontrolle dank Prepaid-System
                        </li>
                    </ul>
                </div>
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-4">Guthaben aufladen</h2>
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
                            <div className="h-[28px] mb-6"></div> // Spacer to align buttons
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
            <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                Sichere Zahlung über Stripe
            </div>
        </div>
    );
}
