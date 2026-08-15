'use client';

// ==========================================
// [DE] PARTNER DASHBOARD — Meine Aufträge
// Zeigt angenommene und laufende Aufträge.
// Echte Daten aus Supabase via /api/partner/leads
// ==========================================

import { useEffect, useState, useCallback } from 'react';

interface Lead {
    id: number;
    plz: string;
    strasse?: string;
    hausnummer?: string;
    etage?: string;
    name: string;
    firma?: string;
    telefon: string;
    email?: string;
    schaedling: string | null;
    kunde_typ: string | null;
    objekt_typ: string | null;
    befall: string | null;
    raeume: string | null;
    flaeche: string | null;
    zugang: string | null;
    zugang_beschreibung?: string;
    created_at: string;
    accepted_at?: string;
    completed_at?: string;
    status: string;
    invoice_amount?: number;
    commission_amount?: number;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
    angenommen:        { label: 'Angenommen',         bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
    kontaktiert:       { label: 'Kontaktiert',         bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
    termin_vereinbart: { label: 'Termin vereinbart',   bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
    in_arbeit:         { label: 'In Arbeit',           bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
    abgeschlossen:     { label: 'Abgeschlossen ✓',     bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
    storniert:         { label: 'Storniert',           bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
};

const UPDATABLE_STATUSES = ['angenommen', 'kontaktiert', 'termin_vereinbart', 'in_arbeit'];
const ALL_STATUSES = ['angenommen', 'kontaktiert', 'termin_vereinbart', 'in_arbeit', 'abgeschlossen', 'storniert'];

export default function DashboardOrders() {
    const [orders, setOrders] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('active'); // 'active' | 'all'
    const [closingId, setClosingId] = useState<number | null>(null);
    const [invoiceInput, setInvoiceInput] = useState<Record<number, string>>({});
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const statusParam = filterStatus === 'active'
                ? 'angenommen,kontaktiert,termin_vereinbart,in_arbeit'
                : ALL_STATUSES.join(',');
            const res = await fetch(`/api/partner/leads?status=${statusParam}`);
            if (!res.ok) {
                const d = await res.json();
                setError(d.error || 'Fehler beim Laden.');
                return;
            }
            const { leads } = await res.json();
            setOrders(leads || []);
        } catch {
            setError('Netzwerkfehler.');
        } finally {
            setLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => { loadOrders(); }, [loadOrders]);

    const handleStatusChange = async (leadId: number, newStatus: string) => {
        setActionLoading(leadId);
        try {
            const res = await fetch('/api/partner/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, status: newStatus }),
            });
            if (!res.ok) { alert('Fehler beim Aktualisieren.'); return; }
            setOrders(prev => prev.map(o => o.id === leadId ? { ...o, status: newStatus } : o));
        } catch {
            alert('Netzwerkfehler.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleComplete = async (leadId: number) => {
        const amount = invoiceInput[leadId];
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            alert('Bitte geben Sie einen gültigen Rechnungsbetrag ein.');
            return;
        }
        const commission = (Number(amount) * 0.2).toFixed(2);
        if (!confirm(`Rechnungsbetrag: ${Number(amount).toFixed(2)} €\nProvision (20%): ${commission} €\n\nMöchten Sie den Auftrag jetzt abschließen?`)) return;

        setActionLoading(leadId);
        try {
            const res = await fetch('/api/leads/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, invoiceAmount: Number(amount) }),
            });
            const data = await res.json();
            if (!res.ok) { alert(data.error || 'Fehler beim Abschließen.'); return; }

            setOrders(prev => prev.map(o => o.id === leadId
                ? { ...o, status: 'abgeschlossen', invoice_amount: Number(amount), commission_amount: data.commissionAmount }
                : o
            ));
            setClosingId(null);
            setInvoiceInput(prev => { const n = { ...prev }; delete n[leadId]; return n; });
        } catch {
            alert('Netzwerkfehler.');
        } finally {
            setActionLoading(null);
        }
    };

    // ─── Loading ────────────────────────────────────────────────────────────
    if (loading) return (
        <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a', lineHeight: 1 }}>
                Meine Aufträge
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Lädt Aufträge...</p>
            <div style={{ display: 'grid', gap: '20px' }}>
                {[1, 2].map(i => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', height: '120px' }}>
                        <div style={{ background: '#f1f5f9', height: '16px', width: '50%', borderRadius: '4px', marginBottom: '12px' }} />
                        <div style={{ background: '#f1f5f9', height: '12px', width: '35%', borderRadius: '4px' }} />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '6px', color: '#0f172a', lineHeight: 1 }}>
                        Meine Aufträge
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Verwalten Sie Ihre übernommenen Aufträge.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setFilterStatus('active')}
                        className={`px-[16px] py-[8px] rounded-lg border text-[13px] font-semibold transition-all duration-300 ease-in-out cursor-pointer ${filterStatus === 'active' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900'}`}
                    >
                        Aktiv
                    </button>
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-[16px] py-[8px] rounded-lg border text-[13px] font-semibold transition-all duration-300 ease-in-out cursor-pointer ${filterStatus === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900'}`}
                    >
                        Alle
                    </button>
                    <button
                        onClick={loadOrders}
                        className="px-[14px] py-[8px] rounded-lg border border-slate-200 text-[13px] font-semibold bg-slate-50 text-slate-600 hover:bg-slate-200 transition-all duration-300 ease-in-out cursor-pointer"
                    >
                        ↻
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            {/* Empty state */}
            {!error && orders.length === 0 && (
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '64px 32px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a', marginBottom: '8px' }}>
                        Noch keine Aufträge
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                        Nehmen Sie Aufträge aus <strong>Neue Aufträge</strong> an, um sie hier zu verwalten.
                    </p>
                </div>
            )}

            {/* Order cards */}
            <div style={{ display: 'grid', gap: '20px' }}>
                {orders.map(order => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['angenommen']!;
                    const isCompleted = order.status === 'abgeschlossen';
                    const isCancelled = order.status === 'storniert';
                    const isClosing = closingId === order.id;
                    const canEdit = UPDATABLE_STATUSES.includes(order.status);

                    return (
                        <div key={order.id} style={{ background: '#fff', border: '1px solid #94a3b8', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

                            {/* Card header */}
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexWrap: 'wrap', gap: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '3px' }}>
                                        Auftrag #{order.id} · {new Date(order.created_at).toLocaleDateString('de-DE')}
                                    </div>
                                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                        {order.schaedling || 'Schädling'} · {order.plz}{order.strasse ? ` ${order.strasse} ${order.hausnummer || ''}` : ''}
                                    </h3>
                                </div>
                                {/* Status */}
                                {canEdit ? (
                                    <div className="relative flex items-center" style={{ '--cfg-color': cfg.color } as React.CSSProperties}>
                                        <select
                                            value={order.status}
                                            disabled={actionLoading === order.id}
                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                            className="peer bg-[var(--cfg-color)] text-white border border-transparent hover:bg-white focus:bg-white hover:text-[var(--cfg-color)] focus:text-[var(--cfg-color)] hover:border-[var(--cfg-color)] focus:border-[var(--cfg-color)] pl-[14px] pr-[30px] py-[6px] rounded-full text-[12px] font-bold cursor-pointer transition-colors duration-300 outline-none appearance-none"
                                        >
                                            {UPDATABLE_STATUSES.map(s => (
                                                <option key={s} value={s} className="bg-white text-slate-900">{STATUS_CONFIG[s]?.label || s}</option>
                                            ))}
                                        </select>
                                        <svg 
                                            className="absolute right-[12px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] pointer-events-none text-white peer-hover:text-[var(--cfg-color)] peer-focus:text-[var(--cfg-color)] transition-colors duration-300" 
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                ) : (
                                    <span style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid transparent', background: cfg.color, color: '#fff', fontWeight: 700, fontSize: '12px' }}>
                                        {cfg.label}
                                    </span>
                                )}
                            </div>

                            {/* Card body */}
                            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>

                                {/* Kundendaten */}
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Kundendaten</div>
                                    <div style={{ fontSize: '14px', marginBottom: '6px' }}><strong>Name:</strong> {order.name}</div>
                                    {order.firma && <div style={{ fontSize: '14px', marginBottom: '6px' }}><strong>Firma:</strong> {order.firma}</div>}
                                    <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                                        <strong>Telefon:</strong>{' '}
                                        <a href={`tel:${order.telefon}`} style={{ color: '#C8102E', textDecoration: 'none', fontWeight: 600 }}>{order.telefon}</a>
                                    </div>
                                    {order.email && (
                                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                                            <a href={`mailto:${order.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{order.email}</a>
                                        </div>
                                    )}
                                    {order.etage && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Etage: {order.etage}</div>}
                                </div>

                                {/* Abschluss */}
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Abschluss & Abrechnung</div>

                                    {isCompleted ? (
                                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px' }}>
                                            <div style={{ color: '#166534', fontWeight: 700, marginBottom: '6px' }}>✅ Auftrag abgeschlossen</div>
                                            <div style={{ color: '#15803d', fontSize: '14px', marginBottom: '4px' }}>
                                                Rechnung: <strong>{order.invoice_amount?.toFixed(2)} €</strong>
                                            </div>
                                            <div style={{ color: '#15803d', fontSize: '13px' }}>
                                                Provision (20%): <strong>{order.commission_amount?.toFixed(2)} €</strong>
                                            </div>
                                            {order.completed_at && (
                                                <div style={{ color: '#4ade80', fontSize: '12px', marginTop: '6px' }}>
                                                    {new Date(order.completed_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </div>
                                    ) : isCancelled ? (
                                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', color: '#94a3b8', fontSize: '14px' }}>
                                            Storniert
                                        </div>
                                    ) : isClosing ? (
                                        <div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>Finaler Rechnungsbetrag (€)</label>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="z.B. 350"
                                                        value={invoiceInput[order.id] || ''}
                                                        onChange={e => setInvoiceInput(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                        style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none', fontFamily: 'inherit' }}
                                                    />
                                                    <button
                                                        onClick={() => handleComplete(order.id)}
                                                        disabled={actionLoading === order.id}
                                                        className="bg-[#C8102E] text-white border border-transparent hover:bg-white hover:text-[#C8102E] hover:border-[#C8102E] px-[14px] py-0 rounded-lg text-[13px] font-bold transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                                    >
                                                        {actionLoading === order.id ? '...' : 'Abschließen'}
                                                    </button>
                                                </div>
                                                {invoiceInput[order.id] && !isNaN(Number(invoiceInput[order.id])) && Number(invoiceInput[order.id]) > 0 && (
                                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                                                        Provision: <strong>{(Number(invoiceInput[order.id]) * 0.2).toFixed(2)} €</strong>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => setClosingId(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                                                Abbrechen
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px', lineHeight: 1.5 }}>
                                                Nach Abschluss der Arbeiten tragen Sie den Rechnungsbetrag ein.<br />
                                                Provision: <strong>20%</strong> des Endpreises.
                                            </p>
                                            <button
                                                onClick={() => setClosingId(order.id)}
                                                className="bg-slate-900 text-white border border-transparent hover:bg-white hover:text-slate-900 hover:border-slate-900 px-[20px] py-[9px] rounded-lg text-[13px] font-bold transition-all duration-300 ease-in-out cursor-pointer"
                                            >
                                                Auftrag abschließen
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
