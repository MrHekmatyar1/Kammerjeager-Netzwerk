'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface MasterInfo {
    firma: string | null;
    name: string | null;
    telefon: string | null;
}

interface Lead {
    id: number;
    schaedling: string | null;
    plz: string;
    strasse?: string;
    created_at: string;
    status: string;
    masters?: MasterInfo;
}

const STATUS_LABELS: Record<string, { text: string; bg: string; color: string; border: string }> = {
    neu: { text: 'Suche nach Partner...', bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
    angenommen: { text: 'Partner gefunden', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    kontaktiert: { text: 'Wird kontaktiert', bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
    termin_vereinbart: { text: 'Termin vereinbart', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
    in_arbeit: { text: 'In Arbeit', bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
    abgeschlossen: { text: 'Abgeschlossen', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
    storniert: { text: 'Storniert', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
};

export default function KundenDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const loadLeads = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/');
                return;
            }

            const res = await fetch('/api/kunden/leads');
            if (!res.ok) {
                const d = await res.json();
                setError(d.error || 'Fehler beim Laden.');
                return;
            }
            const data = await res.json();
            setLeads(data.leads || []);
        } catch {
            setError('Netzwerkfehler.');
        } finally {
            setLoading(false);
        }
    }, [router, supabase.auth]);

    useEffect(() => {
        loadLeads();
    }, [loadLeads]);

    return (
        <div style={{ minHeight: 'calc(100vh - 70px)', background: '#f1f5f9', paddingTop: '100px', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a', marginBottom: '8px', lineHeight: 1 }}>
                        Mein Konto
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                        Ihre Anfragen und Termine im Überblick.
                    </p>
                </div>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {[1, 2].map(i => (
                            <div key={i} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', height: '120px', animation: 'pulse 2s infinite' }}>
                                <div style={{ background: '#f1f5f9', height: '20px', width: '40%', borderRadius: '4px', marginBottom: '12px' }} />
                                <div style={{ background: '#f1f5f9', height: '14px', width: '20%', borderRadius: '4px' }} />
                            </div>
                        ))}
                    </div>
                ) : leads.length === 0 ? (
                    <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '64px 32px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a', marginBottom: '8px' }}>
                            Keine Aufträge gefunden
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0' }}>
                            Sie haben noch keine Schädlingsbekämpfung über uns gebucht.
                        </p>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-quiz-modal'))}
                            className="btn-color-hover"
                            style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                            Neuen Auftrag anlegen
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {leads.map(lead => {
                            const statusObj = STATUS_LABELS[lead.status] || { text: 'Suche nach Partner...', bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
                            const partner = lead.masters;

                            return (
                                <div key={lead.id} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                    
                                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #cbd5e1', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 500 }}>
                                                Anfrage vom {new Date(lead.created_at).toLocaleDateString('de-DE')}
                                            </div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                                {lead.schaedling || 'Schädling'} · PLZ {lead.plz}
                                            </h3>
                                        </div>
                                        <span style={{ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${statusObj.border}`, background: statusObj.bg, color: statusObj.color, fontWeight: 700, fontSize: '12px' }}>
                                            {statusObj.text}
                                        </span>
                                    </div>

                                    <div style={{ padding: '24px' }}>
                                        {/* Status Message */}
                                        {lead.status === 'neu' && (
                                            <p style={{ color: '#475569', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
                                                Wir suchen aktuell einen passenden, zertifizierten Kammerjäger in Ihrer Region. 
                                                Sobald ein Partner den Auftrag übernimmt, sehen Sie hier seine Kontaktdaten.
                                            </p>
                                        )}
                                        
                                        {lead.status !== 'neu' && lead.status !== 'storniert' && partner && (
                                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px' }}>
                                                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: 0 }}>
                                                    Ihr zugewiesener Kammerjäger
                                                </h4>
                                                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                                                    {partner.firma || partner.name}
                                                </div>
                                                {partner.telefon && (
                                                    <div style={{ fontSize: '14px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        📞 <a href={`tel:${partner.telefon}`} style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>{partner.telefon}</a>
                                                    </div>
                                                )}
                                                <p style={{ fontSize: '13px', color: '#166534', margin: '12px 0 0', lineHeight: 1.4 }}>
                                                    Für Rückfragen oder Terminänderungen können Sie den Partner direkt kontaktieren.
                                                </p>
                                            </div>
                                        )}

                                        {lead.status === 'storniert' && (
                                            <p style={{ color: '#b91c1c', fontSize: '14px', margin: 0 }}>
                                                Diese Anfrage wurde storniert.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
