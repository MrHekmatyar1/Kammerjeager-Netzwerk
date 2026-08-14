'use client';

import { useState, useTransition } from 'react';
import { updateLeadStatus } from '@/app/admin/actions';

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

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [isPending, startTransition] = useTransition();

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

    if (leads.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <p className="text-slate-500 font-medium">Noch keine Leads vorhanden.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-400 overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Datum</th>
                            <th className="px-6 py-4 font-semibold">Kunde</th>
                            <th className="px-6 py-4 font-semibold">Kontakt</th>
                            <th className="px-6 py-4 font-semibold">Ort / PLZ</th>
                            <th className="px-6 py-4 font-semibold">Schädling</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-400">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(lead.created_at || lead.erstellt_am || new Date()).toLocaleDateString('de-DE', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800">{lead.name}</div>
                                    {lead.firma && <div className="text-xs text-slate-400 mt-0.5">{lead.firma}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800">{lead.telefon}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{lead.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800">{lead.plz} {lead.strasse || ''} {lead.hausnummer || ''}</div>
                                    {lead.etage && <div className="text-xs text-slate-400 mt-0.5">Etage: {lead.etage}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-[#C8102E] font-medium text-xs border border-red-100 mb-1">
                                        {lead.schaedling || 'Unbekannt'}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">
                                        {lead.kunde_typ || 'Typ unbekannt'} {lead.objekt_typ ? `(${lead.objekt_typ})` : ''}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]" title={lead.zugang_beschreibung || ''}>
                                        {lead.befall ? `${lead.befall}, ` : ''}{lead.raeume ? `${lead.raeume} Räume, ` : ''}{lead.flaeche || ''}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-slate-100">
                {leads.map((lead) => (
                    <div key={`mob-${lead.id}`} className="p-4 sm:p-5 flex flex-col gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <div className="font-bold text-slate-800 text-base">{lead.name}</div>
                                {lead.firma && <div className="text-sm text-slate-500 mt-0.5">{lead.firma}</div>}
                            </div>
                            <div className="text-right text-xs text-slate-400 font-medium whitespace-nowrap">
                                {new Date(lead.created_at || lead.erstellt_am || new Date()).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}<br/>
                                {new Date(lead.created_at || lead.erstellt_am || new Date()).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div>
                                <span className="text-slate-400 text-xs block mb-0.5">Kontakt</span>
                                <span className="font-semibold text-slate-700">{lead.telefon}</span><br/>
                                <span className="text-slate-500 text-xs break-all">{lead.email}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-xs block mb-0.5">Ort / PLZ</span>
                                <span className="font-semibold text-slate-700">{lead.plz} {lead.strasse || ''} {lead.hausnummer || ''}</span>
                                {lead.etage && <span className="text-slate-500 text-xs block mt-0.5">Etage: {lead.etage}</span>}
                            </div>
                        </div>

                        <div>
                            <span className="text-slate-400 text-xs block mb-1.5">Problem & Details</span>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-50 text-[#C8102E] font-medium text-xs border border-red-100">
                                    {lead.schaedling || 'Unbekannt'}
                                </div>
                                <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                    {lead.kunde_typ || 'Typ unbekannt'} {lead.objekt_typ ? `(${lead.objekt_typ})` : ''}
                                </span>
                            </div>
                            <div className="text-xs text-slate-500 leading-relaxed bg-white rounded p-2 border border-slate-100 italic">
                                {lead.befall ? `${lead.befall}, ` : ''}{lead.raeume ? `${lead.raeume} Räume, ` : ''}{lead.flaeche || ''}
                            </div>
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
                    </div>
                ))}
            </div>
        </div>
    );
}
