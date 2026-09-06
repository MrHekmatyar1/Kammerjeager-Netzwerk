'use client';

import { useState, useTransition } from 'react';
import { updateLeadStatus, assignLeadManually } from '@/app/admin/actions';

export type Lead = {
    id: number;
    plz: string;
    name: string;
    firma: string | null;
    telefon: string;
    email: string;
    strasse: string | null;
    hausnummer: string | null;
    etage: string | null;
    kunde_typ: string | null;
    objekt_typ: string | null;
    flaeche: string | null;
    schaedling: string | null;
    raeume: string | null;
    befall: string | null;
    zugang: string | null;
    zugang_beschreibung: string | null;
    created_at: string;
    erstellt_am?: string; // Fallback for old local JSON
    status: string;
    master_id?: number | null;
    billing_override_type?: string | null;
    billing_override_value?: number | null;
};

export type Master = {
    id: number;
    name: string;
    firma: string | null;
    is_active: boolean;
};

// Цвета для бейджиков статуса
const STATUS_COLORS: Record<string, string> = {
    'neu': 'bg-green-100 text-green-800 border-green-200',
    'in_bearbeitung': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'abgeschlossen': 'bg-blue-100 text-blue-800 border-blue-200',
    'storniert': 'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_LABELS: Record<string, string> = {
    'neu': 'Neu',
    'in_bearbeitung': 'In Bearbeitung',
    'abgeschlossen': 'Abgeschlossen',
    'storniert': 'Storniert',
};

export default function LeadsTable({ initialLeads, masters }: { initialLeads: Lead[], masters?: Master[] }) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [filter, setFilter] = useState<'all' | 'b2b' | 'privat'>('all');
    const [isPending, startTransition] = useTransition();

    // Modal state
    const [selectedLeadForAssign, setSelectedLeadForAssign] = useState<Lead | null>(null);
    const [assignMasterId, setAssignMasterId] = useState<string>('');
    const [priceType, setPriceType] = useState<string>('default');
    const [priceValue, setPriceValue] = useState<string>('');
    const [isAssigning, setIsAssigning] = useState(false);

    const isB2BLead = (lead: Lead) =>
        lead.kunde_typ === 'B2B' ||
        lead.kunde_typ === 'Firmenkunde' ||
        lead.kunde_typ === 'Öffentlicher Sektor' ||
        Boolean(lead.firma);

    const b2bCount = leads.filter(isB2BLead).length;
    const privatCount = leads.length - b2bCount;

    const filteredLeads = leads.filter(lead => {
        if (filter === 'b2b') return isB2BLead(lead);
        if (filter === 'privat') return !isB2BLead(lead);
        return true;
    });

    const handleStatusChange = (id: number, newStatus: string) => {
        // Оптимистичное обновление UI
        setLeads(current => 
            current.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead)
        );

        // Обновление в БД
        startTransition(async () => {
            try {
                await updateLeadStatus(id, newStatus);
            } catch (error) {
                console.error(error);
                alert('Fehler beim Aktualisieren des Status.');
                // Откат в случае ошибки
                setLeads(initialLeads);
            }
        });
    };

    const handleAssign = async () => {
        if (!selectedLeadForAssign || !assignMasterId) return;
        setIsAssigning(true);
        try {
            const overrideType = priceType === 'default' ? null : priceType;
            const overrideValue = (priceType === 'fixed' || priceType === 'percentage') ? parseFloat(priceValue) : null;
            
            await assignLeadManually(selectedLeadForAssign.id, parseInt(assignMasterId), overrideType, overrideValue);
            
            // Оптимистичное обновление
            setLeads(current => current.map(lead => lead.id === selectedLeadForAssign.id ? { 
                ...lead, 
                master_id: parseInt(assignMasterId), 
                status: 'neu',
                billing_override_type: overrideType,
                billing_override_value: overrideValue
            } : lead));
            
            setSelectedLeadForAssign(null);
        } catch (error) {
            console.error(error);
            alert('Fehler bei der Zuweisung.');
        } finally {
            setIsAssigning(false);
        }
    };

    if (leads.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <p className="text-slate-500 font-medium">Noch keine Leads vorhanden.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        filter === 'all'
                            ? 'bg-slate-800 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                >
                    Alle ({leads.length})
                </button>
                <button
                    type="button"
                    onClick={() => setFilter('b2b')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        filter === 'b2b'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                    }`}
                >
                    B2B &amp; Gewerbe ({b2bCount})
                </button>
                <button
                    type="button"
                    onClick={() => setFilter('privat')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        filter === 'privat'
                            ? 'bg-slate-800 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                >
                    Privatkunden ({privatCount})
                </button>
            </div>

            <div className="">
                {filteredLeads.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm bg-white rounded-xl shadow-sm border border-slate-200">
                        Keine Leads in dieser Kategorie gefunden.
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto pb-4">
                            <table className="w-full text-sm text-left text-slate-600" style={{ borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                                <thead className="text-xs text-slate-500 uppercase bg-transparent">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Datum</th>
                                        <th className="px-6 py-4 font-semibold">Kunde / Firma</th>
                                        <th className="px-6 py-4 font-semibold">Kontakt</th>
                                        <th className="px-6 py-4 font-semibold">Ort / PLZ</th>
                                        <th className="px-6 py-4 font-semibold">Schädling &amp; Details</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Aktionen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead) => {
                                        const b2b = isB2BLead(lead);
                                        return (
                                            <tr key={lead.id} className="bg-white hover:bg-slate-50 transition-colors shadow-sm group">
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 border-y border-l border-slate-200 rounded-l-xl group-hover:border-slate-300">
                                                    {new Date(lead.created_at || lead.erstellt_am || new Date()).toLocaleDateString('de-DE', {
                                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 border-y border-slate-200 group-hover:border-slate-300">
                                                    {b2b ? (
                                                        <div>
                                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider mb-1">
                                                                B2B / Gewerbe
                                                            </span>
                                                            <div className="font-bold text-slate-900 text-sm">
                                                                {lead.firma || lead.name}
                                                            </div>
                                                            <div className="text-xs text-slate-500 mt-0.5">
                                                                Ansprechpartner: {lead.name}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div className="font-bold text-slate-800">{lead.name}</div>
                                                            {lead.firma && <div className="text-xs text-slate-400 mt-0.5">{lead.firma}</div>}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 border-y border-slate-200 group-hover:border-slate-300">
                                                    <a href={`tel:${lead.telefon}`} className="font-semibold text-slate-800 hover:text-[#C8102E] transition-colors block">
                                                        {lead.telefon}
                                                    </a>
                                                    <a href={`mailto:${lead.email}`} className="text-xs text-slate-500 hover:text-slate-800 transition-colors block mt-0.5">
                                                        {lead.email}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 border-y border-slate-200 group-hover:border-slate-300">
                                                    <div className="font-medium text-slate-800">
                                                        {lead.plz} {lead.strasse || ''} {lead.hausnummer || ''}
                                                    </div>
                                                    {lead.etage && <div className="text-xs text-slate-400 mt-0.5">Etage: {lead.etage}</div>}
                                                </td>
                                                <td className="px-6 py-4 border-y border-slate-200 group-hover:border-slate-300">
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-[#C8102E] font-medium text-xs border border-red-100 mb-1">
                                                        {lead.schaedling || 'Unbekannt'}
                                                    </div>
                                                    <div className="text-xs text-slate-600 font-medium">
                                                        {lead.objekt_typ ? `${lead.objekt_typ}` : (lead.kunde_typ || 'Typ unbekannt')}
                                                    </div>
                                                    {lead.zugang_beschreibung && (
                                                        <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-200 mt-1.5 max-w-[320px] whitespace-normal break-words">
                                                            <span className="font-bold text-[10px] text-slate-500 uppercase block mb-0.5">Nachricht / Anliegen:</span>
                                                            {lead.zugang_beschreibung}
                                                        </div>
                                                    )}
                                                    {(lead.befall || lead.raeume || lead.flaeche) && (
                                                        <div className="text-xs text-slate-400 mt-1">
                                                            {lead.befall ? `${lead.befall}, ` : ''}{lead.raeume ? `${lead.raeume} Räume, ` : ''}{lead.flaeche || ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap border-y border-r border-slate-200 rounded-r-xl group-hover:border-slate-300">
                                                    <div className="relative">
                                                        <select
                                                            value={lead.status}
                                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                            disabled={isPending}
                                                            className={`appearance-none cursor-pointer border pl-3 pr-8 py-1.5 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${STATUS_COLORS[lead.status] || STATUS_COLORS['neu']}`}
                                                        >
                                                            {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                                                <option key={val} value={val} className="bg-white text-slate-800 font-medium">
                                                                    {label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 border-y border-r border-slate-200 rounded-r-xl group-hover:border-slate-300 text-right">
                                                    <button
                                                        onClick={() => setSelectedLeadForAssign(lead)}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200"
                                                    >
                                                        Zuweisen
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="block md:hidden flex flex-col gap-4 pb-4">
                            {filteredLeads.map((lead) => {
                                const b2b = isB2BLead(lead);
                                return (
                                    <div key={`mob-${lead.id}`} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col gap-4">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                {b2b && (
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider mb-1">
                                                        B2B / Gewerbe
                                                    </span>
                                                )}
                                                <div className="font-bold text-slate-900 text-base">{lead.firma || lead.name}</div>
                                                {b2b && lead.firma && (
                                                    <div className="text-xs text-slate-500 mt-0.5">Ansprechpartner: {lead.name}</div>
                                                )}
                                                {!b2b && lead.firma && (
                                                    <div className="text-sm text-slate-500 mt-0.5">{lead.firma}</div>
                                                )}
                                            </div>
                                            <div className="text-right text-xs text-slate-400 font-medium whitespace-nowrap">
                                                {new Date(lead.created_at || lead.erstellt_am || new Date()).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}<br/>
                                                {new Date(lead.created_at || lead.erstellt_am || new Date()).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div>
                                                <span className="text-slate-400 text-xs block mb-0.5">Kontakt</span>
                                                <a href={`tel:${lead.telefon}`} className="font-semibold text-slate-700 hover:text-[#C8102E] block">
                                                    {lead.telefon}
                                                </a>
                                                <a href={`mailto:${lead.email}`} className="text-slate-500 text-xs break-all hover:text-slate-800 block mt-0.5">
                                                    {lead.email}
                                                </a>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs block mb-0.5">Ort / PLZ</span>
                                                <span className="font-semibold text-slate-700">{lead.plz} {lead.strasse || ''} {lead.hausnummer || ''}</span>
                                                {lead.etage && <span className="text-slate-500 text-xs block mt-0.5">Etage: {lead.etage}</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-slate-400 text-xs block mb-1.5">Problem &amp; Details</span>
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-50 text-[#C8102E] font-medium text-xs border border-red-100">
                                                    {lead.schaedling || 'Unbekannt'}
                                                </div>
                                                <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                    {lead.objekt_typ ? `${lead.objekt_typ}` : (lead.kunde_typ || 'Typ unbekannt')}
                                                </span>
                                            </div>
                                            {lead.zugang_beschreibung && (
                                                <div className="text-xs text-slate-700 bg-white rounded p-2.5 border border-slate-200 mt-2">
                                                    <span className="font-bold text-[10px] text-slate-500 uppercase block mb-0.5">Nachricht / Anliegen:</span>
                                                    {lead.zugang_beschreibung}
                                                </div>
                                            )}
                                            {(lead.befall || lead.raeume || lead.flaeche) && (
                                                <div className="text-xs text-slate-500 leading-relaxed bg-white rounded p-2 border border-slate-100 italic mt-1.5">
                                                    {lead.befall ? `${lead.befall}, ` : ''}{lead.raeume ? `${lead.raeume} Räume, ` : ''}{lead.flaeche || ''}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-slate-500 text-sm font-medium">Status:</span>
                                            <div className="relative">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    disabled={isPending}
                                                    className={`appearance-none cursor-pointer border pl-3 pr-8 py-1.5 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${STATUS_COLORS[lead.status] || STATUS_COLORS['neu']}`}
                                                >
                                                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                                        <option key={val} value={val} className="bg-white text-slate-800 font-medium">
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 text-right">
                                            <button
                                                onClick={() => setSelectedLeadForAssign(lead)}
                                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200 w-full"
                                            >
                                                Zuweisen (Manuell)
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Modal for Manual Assignment */}
            {selectedLeadForAssign && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100dvh', background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px', boxSizing: 'border-box', backdropFilter: 'blur(2px)' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Lead manuell zuweisen</h2>
                            <button onClick={() => setSelectedLeadForAssign(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1, padding: '4px' }}>×</button>
                        </div>
                        <div style={{ padding: '20px 24px' }}>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Partner auswählen</label>
                                <select 
                                    value={assignMasterId} 
                                    onChange={(e) => setAssignMasterId(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">-- Bitte wählen --</option>
                                    {masters?.filter(m => m.is_active).map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} {m.firma ? `(${m.firma})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Abrechnungsmodell für diesen Lead</label>
                                <select 
                                    value={priceType} 
                                    onChange={(e) => {
                                        setPriceType(e.target.value);
                                        if (e.target.value === 'free' || e.target.value === 'default') setPriceValue('');
                                    }}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="default">Standard (laut Schädling/Vertrag)</option>
                                    <option value="free">Kostenlos (0 €)</option>
                                    <option value="fixed">Eigener Fixpreis (€)</option>
                                    <option value="percentage">Eigene Provision (%)</option>
                                </select>
                            </div>

                            {(priceType === 'fixed' || priceType === 'percentage') && (
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Betrag ({priceType === 'fixed' ? '€' : '%'})
                                    </label>
                                    <input 
                                        type="number" 
                                        value={priceValue}
                                        onChange={(e) => setPriceValue(e.target.value)}
                                        placeholder={priceType === 'fixed' ? 'z.B. 25' : 'z.B. 15'}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            )}
                            
                            <div className="flex gap-3 justify-end mt-8">
                                <button
                                    onClick={() => setSelectedLeadForAssign(null)}
                                    className="px-5 py-2.5 rounded-lg font-bold text-sm bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    onClick={handleAssign}
                                    disabled={!assignMasterId || isAssigning || ((priceType === 'fixed' || priceType === 'percentage') && !priceValue)}
                                    className="px-5 py-2.5 rounded-lg font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isAssigning ? 'Weist zu...' : 'Jetzt zuweisen'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
