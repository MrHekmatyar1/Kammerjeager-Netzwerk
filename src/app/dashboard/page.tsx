'use client';

// ==========================================
// [DE] PARTNER DASHBOARD — Marktplatz
// Zeigt neue (zugewiesene) Leads, die noch nicht angenommen wurden.
// Echte Daten aus Supabase via /api/partner/leads
// ==========================================

import { useEffect, useState, useCallback } from 'react';

interface Lead {
    id: number;
    plz: string;
    strasse?: string;
    hausnummer?: string;
    schaedling: string | null;
    kunde_typ: string | null;
    objekt_typ: string | null;
    befall: string | null;
    raeume: string | null;
    flaeche: string | null;
    zugang: string | null;
    zugang_beschreibung: string | null;
    created_at: string;
    status: string;
}

// Время с момента создания в читаемом формате
function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Gerade eben';
    if (mins < 60) return `Vor ${mins} Min.`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Vor ${hours} Std.`;
    return `Vor ${Math.floor(hours / 24)} Tag(en)`;
}

// Urgency: чем свежее — тем краснее
function getUrgencyColor(dateStr: string): string {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 30) return '#C8102E';
    if (mins < 120) return '#f97316';
    return '#64748b';
}

export default function DashboardMarketplace() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const loadLeads = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await fetch('/api/partner/leads?status=neu');
            if (!res.ok) {
                const d = await res.json();
                if (res.status === 401) {
                    setLeads([]);
                    return;
                }
                setError(d.error || 'Fehler beim Laden.');
                return;
            }
            const { leads: data } = await res.json();
            setLeads(data || []);
        } catch {
            setError('Netzwerkfehler. Bitte Seite neu laden.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadLeads(); }, [loadLeads]);

    // Синхронизируем data-modal-open на body чтобы layout мог скрывать стрелку
    useEffect(() => {
        if (selectedLead) {
            document.body.setAttribute('data-modal-open', '1');
        } else {
            document.body.removeAttribute('data-modal-open');
        }
        return () => { document.body.removeAttribute('data-modal-open'); };
    }, [selectedLead]);

    const handleAccept = async () => {
        if (!selectedLead || !agreed) return;
        setActionLoading(true);
        try {
            const res = await fetch('/api/leads/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: selectedLead.id }),
            });
            const data = await res.json();
            if (!res.ok) { alert(data.error || 'Fehler beim Annehmen.'); return; }

            // Убираем из списка
            setLeads(prev => prev.filter(l => l.id !== selectedLead.id));
            setSelectedLead(null);
            setAgreed(false);
            alert('Auftrag erfolgreich angenommen! Sie finden ihn unter "Meine Aufträge".');
        } catch {
            alert('Netzwerkfehler. Bitte versuchen Sie es erneut.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedLead) return;
        setActionLoading(true);
        try {
            const res = await fetch('/api/leads/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: selectedLead.id, reason: rejectReason }),
            });
            const data = await res.json();
            if (!res.ok) { alert(data.error || 'Fehler beim Ablehnen.'); return; }

            setLeads(prev => prev.filter(l => l.id !== selectedLead.id));
            setSelectedLead(null);
            setShowRejectModal(false);
            setRejectReason('');
        } catch {
            alert('Netzwerkfehler.');
        } finally {
            setActionLoading(false);
        }
    };

    // ─── Loading State ─────────────────────────────────────────────────────
    if (loading) return (
        <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a', lineHeight: 1 }}>
                Neue Aufträge
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Lädt Aufträge<span className="loading-dots"><span></span><span></span><span></span></span></p>
            <div style={{ display: 'grid', gap: '16px' }}>
                {[1, 2].map(i => (
                    <div key={i} className="animate-pulse" style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', height: '100px' }}>
                        <div style={{ background: '#e2e8f0', height: '16px', width: '60%', borderRadius: '4px', marginBottom: '12px' }} />
                        <div style={{ background: '#e2e8f0', height: '12px', width: '40%', borderRadius: '4px' }} />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a', lineHeight: 1 }}>
                        Neue Aufträge
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                        Verfügbare Aufträge in Ihrem Einsatzgebiet.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {leads.length > 0 && (
                        <span style={{ background: '#C8102E', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '5px 13px', borderRadius: '20px' }}>
                            {leads.length} Neu
                        </span>
                    )}
                    <button
                        onClick={loadLeads}
                        className="bg-slate-600 text-white border border-transparent hover:bg-white hover:text-slate-600 hover:border-slate-600 px-[17px] py-[9px] rounded-lg text-[13px] font-semibold transition-colors"
                    >
                        ↻ Aktualisieren
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            {/* Empty state */}
            {!error && leads.length === 0 && (
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '64px 32px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a', marginBottom: '8px' }}>
                        Keine neuen Aufträge
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                        Aktuell liegen keine neuen Aufträge in Ihrem Einsatzgebiet vor.<br />
                        Sie werden per E-Mail & Telegram benachrichtigt, sobald ein neuer Auftrag eingeht.
                    </p>
                </div>
            )}

            {/* Lead cards */}
            <div style={{ display: 'grid', gap: '16px' }}>
                {leads.map(lead => (
                    <div key={lead.id} style={{
                        background: '#fff', border: '1px solid #94a3b8', borderRadius: '12px', padding: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        transition: 'box-shadow 0.2s',
                        flexWrap: 'wrap', gap: '16px'
                    }}>
                        <div style={{ flex: 1, minWidth: '220px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                <span style={{ background: '#C8102E', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Neu</span>
                                <span style={{ color: getUrgencyColor(lead.created_at), fontSize: '12px', fontWeight: 600 }}>
                                    {timeAgo(lead.created_at)}
                                </span>
                                {lead.kunde_typ && (
                                    <span style={{ background: '#475569', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '4px' }}>
                                        {lead.kunde_typ}
                                    </span>
                                )}
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                                {lead.schaedling || 'Schädling unbekannt'} · {lead.plz}
                            </h3>
                            <div style={{ color: '#64748b', fontSize: '13px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                {lead.objekt_typ && <span>{lead.objekt_typ}</span>}
                                {lead.objekt_typ && lead.raeume && <span>·</span>}
                                {lead.raeume && <span>{lead.raeume} Räume</span>}
                                {(lead.objekt_typ || lead.raeume) && lead.befall && <span>·</span>}
                                {lead.befall && <span>{lead.befall}</span>}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Provision: <strong>20%</strong></div>
                            <button
                                onClick={() => { setSelectedLead(lead); setAgreed(false); setShowRejectModal(false); }}
                                className="bg-slate-900 text-white border border-transparent hover:bg-white hover:text-slate-900 hover:border-slate-900 px-[22px] py-[10px] rounded-lg text-[14px] font-semibold transition-colors whitespace-nowrap"
                            >
                                Auftrag ansehen →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Modal: Lead Detail / Accept ──────────────────────────────── */}
            {selectedLead && !showRejectModal && (
                <div style={{ position: 'fixed', top: '68px', left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.28)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '20px 16px 16px' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '540px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.25)', maxHeight: 'calc(100vh - 68px - 40px)', overflowY: 'auto' }}>

                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Auftragsdetails</h2>
                                <p style={{ color: '#64748b', fontSize: '13px', margin: '6px 0 0' }}>
                                    {selectedLead.schaedling} · PLZ {selectedLead.plz} · {timeAgo(selectedLead.created_at)}
                                </p>
                            </div>
                            <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1, padding: '4px' }}>×</button>
                        </div>

                        {/* Lead Details */}
                        <div style={{ padding: '20px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                    { label: 'Schädling', value: selectedLead.schaedling },
                                    { label: 'PLZ', value: selectedLead.plz },
                                    { label: 'Kundentyp', value: selectedLead.kunde_typ },
                                    { label: 'Objekt', value: selectedLead.objekt_typ },
                                    { label: 'Befall', value: selectedLead.befall },
                                    { label: 'Räume', value: selectedLead.raeume },
                                    { label: 'Fläche', value: selectedLead.flaeche },
                                    { label: 'Zugang', value: selectedLead.zugang },
                                ].filter(f => f.value).map(f => (
                                    <div key={f.label} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px' }}>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{f.label}</div>
                                        <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>{f.value}</div>
                                    </div>
                                ))}
                            </div>
                            {selectedLead.zugang_beschreibung && (
                                <div style={{ marginTop: '12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px' }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>Zugangsbeschreibung</div>
                                    <div style={{ fontSize: '14px', color: '#0f172a' }}>{selectedLead.zugang_beschreibung}</div>
                                </div>
                            )}
                        </div>

                        {/* Legal agreement */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Rechtliche Vereinbarung</div>
                                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                                    Durch Annahme verpflichten Sie sich, im Falle einer Barzahlung den <strong>korrekten und vollständigen Rechnungsbetrag</strong> im Portal einzutragen.
                                    Bei Falschangaben wird eine <strong style={{ color: '#b91c1c' }}>Vertragsstrafe von 480 € + entgangene Provision</strong> fällig.
                                </p>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={e => setAgreed(e.target.checked)}
                                    style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#C8102E', flexShrink: 0 }}
                                />
                                <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 500, lineHeight: 1.5 }}>
                                    Ich akzeptiere die Bedingungen und bestätige, den korrekten Rechnungsbetrag einzutragen.
                                </span>
                            </label>
                        </div>

                        {/* Action buttons */}
                        <div style={{ padding: '20px 24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                disabled={actionLoading}
                                className="bg-white text-slate-500 border border-slate-200 hover:bg-slate-500 hover:text-white hover:border-slate-500 px-[20px] py-[10px] rounded-lg text-[14px] font-semibold transition-all duration-300 ease-in-out cursor-pointer"
                            >
                                Ablehnen
                            </button>
                            <button
                                disabled={!agreed || actionLoading}
                                onClick={handleAccept}
                                className="btn-color-hover bg-[#C8102E] text-white border border-transparent px-[24px] py-[10px] rounded-lg text-[14px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading ? 'Wird verarbeitet...' : 'Auftrag annehmen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Reject Reason ─────────────────────────────────────── */}
            {selectedLead && showRejectModal && (
                <div style={{ position: 'fixed', top: '68px', left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.28)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1001, padding: '20px 16px 16px' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Auftrag ablehnen</h2>
                        </div>
                        <div style={{ padding: '20px 24px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', fontWeight: 600, marginBottom: '8px' }}>
                                Grund (optional)
                            </label>
                            <select
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', marginBottom: '20px' }}
                            >
                                <option value="">Kein Grund angeben</option>
                                <option value="Keine Kapazität">Keine Kapazität</option>
                                <option value="Zu weit entfernt">Zu weit entfernt</option>
                                <option value="Nicht meine Spezialisierung">Nicht meine Spezialisierung</option>
                                <option value="Urlaub / Krankheit">Urlaub / Krankheit</option>
                            </select>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    disabled={actionLoading}
                                    className="bg-white text-slate-500 border border-slate-200 hover:bg-slate-500 hover:text-white hover:border-slate-500 px-[20px] py-[10px] rounded-lg text-[14px] font-semibold transition-all duration-300 ease-in-out cursor-pointer"
                                >
                                    Zurück
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={actionLoading}
                                    className="bg-slate-900 text-white border border-transparent hover:bg-white hover:text-slate-900 hover:border-slate-900 px-[24px] py-[10px] rounded-lg text-[14px] font-bold transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? 'Wird verarbeitet...' : 'Ablehnen bestätigen'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
