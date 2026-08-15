'use client';

import { useEffect, useState, useCallback } from 'react';

const PEST_TYPES = [
    'Wespen', 'Mäuse & Ratten', 'Bettwanzen', 'Schaben / Kakerlaken', 'Ameisen', 'Flöhe', 'Marder', 'Tauben', 'Sonstige'
];

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [form, setForm] = useState({
        firma: '',
        name: '',
        telefon: '',
        service_plz: '',
        billing_model: 'commission',
        is_active: true,
        telegram_chat_id: '',
        pests_handled: [] as string[],
    });

    const loadSettings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/partner/settings');
            if (res.ok) {
                const data = await res.json();
                if (data.master) {
                    setForm({
                        firma: data.master.firma || '',
                        name: data.master.name || '',
                        telefon: data.master.phone || '',
                        service_plz: Array.isArray(data.master.plz_bereiche) ? data.master.plz_bereiche.join(', ') : '',
                        billing_model: data.master.billing_model || 'commission',
                        is_active: data.master.is_active !== false, // default true
                        telegram_chat_id: data.master.telegram_chat_id || '',
                        pests_handled: Array.isArray(data.master.pests_handled) ? data.master.pests_handled : [],
                    });
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadSettings(); }, [loadSettings]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await fetch('/api/partner/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ text: '✅ Einstellungen erfolgreich gespeichert!', type: 'success' });
            } else {
                setMessage({ text: `❌ ${data.error}`, type: 'error' });
            }
        } catch (err) {
            setMessage({ text: '❌ Netzwerkfehler beim Speichern.', type: 'error' });
        } finally {
            setSaving(false);
            setTimeout(() => {
                setMessage(prev => prev.type === 'success' ? { text: '', type: '' } : prev);
            }, 3000);
        }
    };

    const togglePest = (pest: string) => {
        setForm(prev => {
            const list = prev.pests_handled;
            if (list.includes(pest)) return { ...prev, pests_handled: list.filter(p => p !== pest) };
            return { ...prev, pests_handled: [...list, pest] };
        });
    };

    if (loading) return (
        <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a', lineHeight: 1 }}>
                Einstellungen
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Profil und Abrechnung verwalten.</p>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', height: '300px', animation: 'pulse 2s infinite' }}>
                <div style={{ background: '#f1f5f9', height: '16px', width: '30%', borderRadius: '4px', marginBottom: '24px' }} />
                <div style={{ background: '#f1f5f9', height: '40px', width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
                <div style={{ background: '#f1f5f9', height: '40px', width: '100%', borderRadius: '8px' }} />
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '700px' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a', lineHeight: 1 }}>
                Einstellungen
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
                Verwalten Sie Ihr Unternehmensprofil, Einsatzgebiete und Abrechnungsmodelle.
            </p>

            {message.text && (
                <div style={{ 
                    padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 600,
                    background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    color: message.type === 'success' ? '#166534' : '#b91c1c',
                    border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'grid', gap: '32px' }}>
                
                {/* 0. Verfügbarkeit (Aktiv/Pause) */}
                <div style={{ background: '#fff', border: `2px solid ${form.is_active ? '#C8102E' : '#e2e8f0'}`, borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s' }}>
                    <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Auftragsannahme</h2>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                                {form.is_active 
                                    ? 'Sie sind aktiv und erhalten Benachrichtigungen über neue Aufträge.' 
                                    : 'Sie sind pausiert (z.B. Urlaub) und erhalten derzeit keine neuen Anfragen.'}
                            </p>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="checkbox" 
                                    className="sr-only" 
                                    checked={form.is_active} 
                                    onChange={e => setForm({ ...form, is_active: e.target.checked })} 
                                />
                                <div style={{ 
                                    width: '48px', height: '24px', borderRadius: '12px', 
                                    background: form.is_active ? '#C8102E' : '#cbd5e1', 
                                    transition: 'background 0.2s' 
                                }} />
                                <div style={{ 
                                    position: 'absolute', top: '2px', left: form.is_active ? '26px' : '2px', 
                                    width: '20px', height: '20px', borderRadius: '50%', background: '#fff', 
                                    transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
                                }} />
                            </div>
                            <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: 700, color: form.is_active ? '#C8102E' : '#64748b' }}>
                                {form.is_active ? 'Aktiv' : 'Pausiert'}
                            </span>
                        </label>
                    </div>
                </div>

                {/* 1. Persönliche Daten */}
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #cbd5e1' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Unternehmensprofil</h2>
                    </div>
                    <div style={{ padding: '24px', display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Firmenname (optional)</label>
                            <input
                                type="text"
                                value={form.firma}
                                onChange={e => setForm({ ...form, firma: e.target.value })}
                                placeholder="z.B. Schmidt Schädlingsbekämpfung GmbH"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '14px', outline: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Ansprechpartner</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Telefonnummer</label>
                                <input
                                    type="tel"
                                    value={form.telefon}
                                    onChange={e => setForm({ ...form, telefon: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Einsatzgebiet */}
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #cbd5e1' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Einsatzgebiete (PLZ)</h2>
                    </div>
                    <div style={{ padding: '24px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                            Geben Sie hier die Postleitzahlen ein, in denen Sie Aufträge annehmen möchten. 
                            Trennen Sie mehrere Postleitzahlen mit einem Komma (z.B. 10115, 10117, 10119).
                        </p>
                        <textarea
                            value={form.service_plz}
                            onChange={e => setForm({ ...form, service_plz: e.target.value })}
                            placeholder="10115, 10117, 10119..."
                            rows={3}
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px', maxHeight: '250px' }}
                        />
                    </div>
                </div>

                {/* 3. Spezialisierung (Schädlinge) */}
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #cbd5e1' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Spezialisierung</h2>
                    </div>
                    <div style={{ padding: '24px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                            Wählen Sie aus, welche Schädlinge Sie bekämpfen. Sie erhalten nur Anfragen für diese Arten.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {PEST_TYPES.map(pest => {
                                const isSelected = form.pests_handled.includes(pest);
                                return (
                                    <button
                                        key={pest}
                                        type="button"
                                        onClick={() => togglePest(pest)}
                                        className={`px-[16px] py-[8px] rounded-[20px] text-[13px] font-semibold cursor-pointer transition-all duration-300 ease-in-out border ${
                                            isSelected
                                                ? 'bg-[#C8102E] text-white border-transparent hover:bg-white hover:text-[#C8102E] hover:border-[#C8102E]'
                                                : 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1] hover:bg-white hover:border-[#94a3b8]'
                                        }`}
                                    >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {isSelected && (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                )}
                                                {pest}
                                            </div>
                                        </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 4. Benachrichtigungen (Telegram) */}
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #cbd5e1' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Benachrichtigungen (Telegram)</h2>
                    </div>
                    <div style={{ padding: '24px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                            Um sofort über neue Aufträge informiert zu werden, verbinden Sie Ihren Account mit Telegram.
                            Geben Sie hier Ihre Telegram Chat-ID ein.
                        </p>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Telegram Chat-ID</label>
                            <input
                                type="text"
                                value={form.telegram_chat_id}
                                onChange={e => setForm({ ...form, telegram_chat_id: e.target.value })}
                                placeholder="z.B. 123456789"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #94a3b8', fontSize: '14px', outline: 'none' }}
                            />
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                Tipp: Senden Sie eine Nachricht an den Bot <strong style={{ color: '#0f172a' }}>@userinfobot</strong> in Telegram, um Ihre ID herauszufinden.
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Abrechnungsmodell */}
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #cbd5e1' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Abrechnungsmodell</h2>
                    </div>
                    <div style={{ padding: '24px', display: 'grid', gap: '16px' }}>
                        
                        {/* Option 1: Commission (Default) */}
                        <label style={{ 
                            display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', 
                            border: `2px solid ${form.billing_model === 'commission' ? '#C8102E' : '#e2e8f0'}`, 
                            borderRadius: '8px', cursor: 'pointer', background: form.billing_model === 'commission' ? '#fff1f2' : '#fff',
                            transition: 'all 0.2s'
                        }}>
                            <input 
                                type="radio" 
                                name="billing_model" 
                                value="commission"
                                checked={form.billing_model === 'commission'}
                                onChange={() => setForm({ ...form, billing_model: 'commission' })}
                                style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#C8102E' }}
                            />
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Prozentuale Vermittlung (20%)</div>
                                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                                    Sie zahlen keine fixen Gebühren. Wir erhalten lediglich 20% Provision vom finalen Rechnungsbetrag, nachdem Sie den Auftrag erfolgreich beim Kunden abgeschlossen haben.
                                </div>
                            </div>
                        </label>

                        {/* Option 2: Pay-Per-Lead */}
                        <label style={{ 
                            display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', 
                            border: `2px solid ${form.billing_model === 'pay_per_lead' ? '#0f172a' : '#e2e8f0'}`, 
                            borderRadius: '8px', cursor: 'pointer', background: form.billing_model === 'pay_per_lead' ? '#f8fafc' : '#fff',
                            transition: 'all 0.2s'
                        }}>
                            <input 
                                type="radio" 
                                name="billing_model" 
                                value="pay_per_lead"
                                checked={form.billing_model === 'pay_per_lead'}
                                onChange={() => setForm({ ...form, billing_model: 'pay_per_lead' })}
                                style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#0f172a' }}
                            />
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Fixpreis pro Lead kaufen</div>
                                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                                    Sie kaufen Kundenanfragen (Leads) zu einem festen Preis. Die komplette Rechnungssumme bleibt bei Ihnen. Sie sind selbst für die Kontaktaufnahme und den Verkauf verantwortlich.
                                </div>
                            </div>
                        </label>

                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <button 
                        type="submit" 
                        disabled={saving}
                        className={`px-[32px] py-[12px] rounded-lg text-[15px] font-bold transition-all duration-300 ease-in-out border ${
                            saving 
                                ? 'opacity-70 cursor-not-allowed bg-[#C8102E] text-white border-transparent' 
                                : 'bg-[#C8102E] text-white border-transparent hover:bg-white hover:text-[#C8102E] hover:border-[#C8102E] cursor-pointer shadow-sm hover:shadow-md'
                        }`}
                    >
                        {saving ? 'Speichert...' : 'Einstellungen speichern'}
                    </button>
                </div>
            </form>
        </div>
    );
}
