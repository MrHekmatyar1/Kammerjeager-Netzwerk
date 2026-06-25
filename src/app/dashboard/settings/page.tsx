'use client';

import { useEffect, useState, useCallback } from 'react';

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
                        telefon: data.master.telefon || '',
                        service_plz: data.master.service_plz || '',
                        billing_model: data.master.billing_model || 'commission',
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
            // Hide success message after 3 seconds
            setTimeout(() => {
                setMessage(prev => prev.type === 'success' ? { text: '', type: '' } : prev);
            }, 3000);
        }
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
                
                {/* 1. Persönliche Daten */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
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
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Ansprechpartner</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Telefonnummer</label>
                                <input
                                    type="tel"
                                    value={form.telefon}
                                    onChange={e => setForm({ ...form, telefon: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Einsatzgebiet */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
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
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                        />
                    </div>
                </div>

                {/* 3. Abrechnungsmodell (Hiding fixpreis explicitly visually, but keeping it as an option) */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
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
                        style={{
                            background: '#C8102E', color: '#fff', border: 'none', padding: '12px 32px',
                            borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1, transition: 'all 0.2s'
                        }}
                    >
                        {saving ? 'Speichert...' : 'Einstellungen speichern'}
                    </button>
                </div>
            </form>
        </div>
    );
}
