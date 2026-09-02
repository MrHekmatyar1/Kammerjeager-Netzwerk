'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ─── Types & helpers ──────────────────────────────────────────────────────
type PartnerTyp = '' | 'schaedlingsbekaempfer' | 'kooperation';

interface FormData {
    typ: PartnerTyp; name: string; email: string; telefon: string;
    firma: string; plz: string; anmerkung: string; datenschutz: boolean;
}
const INITIAL: FormData = { typ: '', name: '', email: '', telefon: '', firma: '', plz: '', anmerkung: '', datenschutz: false };

const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', fontSize: '14px', color: '#374151', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', borderRadius: '0' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' };

// ─── Form ────────────────────────────────────────────────────────────────
function PartnerForm() {
    const [form, setForm] = useState<FormData>(INITIAL);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.datenschutz) { setError('Bitte stimmen Sie der Datenschutzerklärung zu.'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/partner-register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) setError(data.error || 'Fehler beim Senden.');
            else setSent(true);
        } catch { setError('Netzwerkfehler. Bitte versuchen Sie es erneut.'); }
        finally { setLoading(false); }
    };

    if (sent) return (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: '#1E293B', marginBottom: '10px' }}>Vielen Dank!</h3>
            <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.</p>
        </div>
    );

    return (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <label style={lbl}>Sind Sie Schädlingsbekämpfer? <span style={{ color: '#C8102E' }}>*</span></label>
                <select value={form.typ} onChange={set('typ')} required style={{ ...inp, cursor: 'pointer' }}>
                    <option value="" disabled>Bitte auswählen</option>
                    <option value="schaedlingsbekaempfer">Ja, ich bin Schädlingsbekämpfer.</option>
                    <option value="kooperation">Nein, aber ich interessiere mich für eine Zusammenarbeit.</option>
                </select>
            </div>

            {form.typ && (<>
                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '6px 0' }} />
                <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase', color: '#1E293B', margin: 0 }}>Ansprechpartner</h4>

                <div>
                    <label style={lbl}>Name <span style={{ color: '#C8102E' }}>*</span></label>
                    <input value={form.name} onChange={set('name')} required style={inp} placeholder="Max Mustermann" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={lbl}>E-Mail <span style={{ color: '#C8102E' }}>*</span></label>
                        <input type="email" value={form.email} onChange={set('email')} required style={inp} placeholder="info@firma.de" />
                    </div>
                    <div>
                        <label style={lbl}>Telefon <span style={{ color: '#C8102E' }}>*</span></label>
                        <input type="tel" value={form.telefon} onChange={set('telefon')} required style={inp} placeholder="+49 30 …" />
                    </div>
                </div>

                {form.typ === 'schaedlingsbekaempfer' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={lbl}>Firma / Unternehmensname</label>
                            <input value={form.firma} onChange={set('firma')} style={inp} placeholder="Muster GmbH" />
                        </div>
                        <div>
                            <label style={lbl}>Einsatzgebiet / PLZ</label>
                            <input value={form.plz} onChange={set('plz')} style={inp} placeholder="10115, 12205 …" />
                        </div>
                    </div>
                )}

                <div>
                    <label style={lbl}>Anmerkungen (optional)</label>
                    <textarea value={form.anmerkung} onChange={set('anmerkung')} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Erfahrungen, Kapazitäten, Fragen ..." />
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px', background: '#f8fafc', border: '1px solid #d1d5db' }}>
                    <input type="checkbox" id="ds" checked={form.datenschutz} onChange={set('datenschutz')} style={{ marginTop: '2px', accentColor: '#C8102E', flexShrink: 0, width: '15px', height: '15px', cursor: 'pointer' }} />
                    <label htmlFor="ds" style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, cursor: 'pointer' }}>
                        Ich stimme zu, dass meine Daten zur Kontaktaufnahme und Partnerschaftsvermittlung verarbeitet werden (Art. 6 Abs. 1 lit. b DSGVO). Ich habe die <a href="/datenschutz" target="_blank" style={{ color: '#C8102E', textDecoration: 'underline' }}>Datenschutzerklärung</a> gelesen.{' '}<span style={{ color: '#C8102E' }}>*</span>
                    </label>
                </div>
            </>)}

            {error && <div style={{ padding: '11px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '14px' }}>{error}</div>}

            {form.typ && (
                <button type="submit" disabled={loading} className="btn-color-hover" style={{ backgroundColor: loading ? '#94a3b8' : '#C8102E', color: '#fff', padding: '13px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}>
                    {loading ? 'Wird gesendet …' : 'Jetzt Partner werden'}
                </button>
            )}
        </form>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────
export default function PartnerPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main style={{ paddingTop: '68px' }} className="flex-grow w-full">

                {/* 1 ─ HERO (full-width, left-aligned, moderate heading) */}
                <section style={{ padding: '72px 0 80px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#C8102E', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>Für Schädlingsbekämpfer</p>
                        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2.6rem, 5vw, 3.6rem)', lineHeight: 1.05, textTransform: 'uppercase', color: '#1E293B', marginBottom: '16px', maxWidth: '640px' }}>
                            Jetzt Partner werden<br />
                            <span style={{ color: '#C8102E' }}>Wir bringen die Kunden</span>
                        </h1>
                        <p style={{ fontSize: '17px', color: '#64748b', lineHeight: 1.75, maxWidth: '520px', marginBottom: '32px' }}>
                            Mehr Kunden. Weniger Aufwand. Qualifizierte, regionale Aufträge — direkt an Sie. Kostenlos und absolut transparent.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                            <a href="#anmelden" style={{ backgroundColor: '#C8102E', color: '#fff', padding: '13px 36px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 16px rgba(200,16,46,0.22)' }}>
                                Jetzt anmelden
                            </a>
                            <a href="tel:016092376320" style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B', textDecoration: 'none' }}>0160 92376320</a>
                        </div>
                    </div>
                </section>

                {/* 2 ─ VORTEILE (simple text list, compact headline) */}
                <section style={{ padding: '80px 0', background: '#fff' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#C8102E', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>Ihre Vorteile als Partner</p>
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', textTransform: 'uppercase', color: '#1E293B', marginBottom: '40px' }}>Warum mit uns zusammenarbeiten?</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                            {[
                                { title: 'Qualifizierte Aufträge', desc: 'Sie erhalten vorqualifizierte Kundenanfragen mit Befall-Details, Adresse, Kontaktdaten und Dringlichkeit. Kein Kaltakquise-Aufwand.' },
                                { title: 'Regionale Zuteilung', desc: 'Ausschließlich Aufträge in Ihrem Einsatzgebiet. Sie definieren Ihre Postleitzahlen — keine weiten Anfahrtswege.' },
                                { title: 'Faire Preisgestaltung', desc: 'Ihre Preise bleiben vollständig flexibel und werden von uns nicht eingeschränkt, solange sie marktgerecht sind.' },
                                { title: 'Keine Kosten bei Stornierung', desc: 'Abgerechnet wird ausschließlich für erfolgreich abgeschlossene Aufträge. Kein finanzielles Risiko Ihrerseits.' },
                                { title: 'Volle Kapazitätskontrolle', desc: 'Sie entscheiden selbst, welche Aufträge Sie annehmen. Keine Annahmepflicht, kein Vertragszwang.' },
                                { title: 'Innovative Plattform', desc: 'Gestalten Sie Optimierungen aktiv mit. Wir bauen unsere Prozesse gemeinsam mit unseren Partnern kontinuierlich aus.' },
                            ].map(item => (
                                <div key={item.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <span style={{ color: '#C8102E', fontWeight: 900, fontSize: '20px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>—</span>
                                    <div>
                                        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '18px', textTransform: 'uppercase', color: '#1E293B', marginBottom: '8px' }}>{item.title}</h3>
                                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <a href="#anmelden" style={{ backgroundColor: '#C8102E', color: '#fff', padding: '13px 36px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
                                Jetzt Partner werden
                            </a>
                        </div>
                    </div>
                </section>

                {/* 3 ─ UNSERE WERTE */}
                <section style={{ padding: '80px 0', background: '#e8edf2', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#C8102E', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>Unsere Werte</p>
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', textTransform: 'uppercase', color: '#1E293B', marginBottom: '48px' }}>Ihr Erfolg ist unser Ziel</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>
                            {[
                                { title: 'Zuverlässigkeit', desc: 'Wir vermitteln nur qualifizierte Aufträge, die perfekt zu Ihren Anforderungen passen.', svg: <svg width="22" height="22" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> },
                                { title: 'Qualität', desc: 'Transparente Prozesse und hochwertige Kundenanfragen sichern Ihren langfristigen Erfolg.', svg: <svg width="22" height="22" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
                                { title: 'Flexibilität', desc: 'Sie entscheiden selbst, welche Aufträge Sie annehmen — ganz nach Ihren Kapazitäten.', svg: <svg width="22" height="22" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> },
                                { title: 'Partnerschaft', desc: 'Gemeinsam optimieren wir unsere Plattform, um Ihnen das Arbeiten zu erleichtern.', svg: <svg width="22" height="22" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
                            ].map(item => (
                                <div key={item.title} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div style={{ width: '50px', height: '50px', border: '1px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                                        {item.svg}
                                    </div>
                                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '18px', color: '#1E293B', textTransform: 'uppercase', margin: 0 }}>{item.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4 ─ SO FUNKTIONIERT'S */}
                <section style={{ padding: '80px 0', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#C8102E', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>Der Prozess</p>
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', textTransform: 'uppercase', color: '#1E293B', marginBottom: '48px' }}>So funktioniert&apos;s</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {[
                                { n: '1', title: 'Kunde meldet ein Problem', desc: 'Schädlingsbefall wird online oder telefonisch an unser Service-Team übermittelt.' },
                                { n: '2', title: 'Wir qualifizieren den Auftrag', desc: 'Unser Team prüft die Anfrage und klärt alle Details vorab mit dem Kunden (Lead-Gating).' },
                                { n: '3', title: 'Benachrichtigung über neue Aufträge', desc: 'Sie erhalten passende Aufträge direkt per E-Mail oder SMS mit allen relevanten Details.' },
                                { n: '4', title: 'Auftrag annehmen oder ablehnen', desc: 'Sie entscheiden völlig flexibel und unverbindlich, ob Sie den jeweiligen Auftrag übernehmen möchten.' },
                                { n: '5', title: 'Ausführung des Auftrags', desc: 'Sie vereinbaren den Termin, führen die Schädlingsbekämpfung durch und dokumentieren den Abschluss.' },
                                { n: '6', title: 'Erfolgreiche Abrechnung', desc: 'Erst nach erfolgreichem Abschluss wird eine transparente Vermittlungsprovision berechnet. Keine versteckten Kosten.' },
                            ].map((item, i) => (
                                <div key={item.n} style={{ display: 'flex', gap: '24px', padding: '28px 0', borderBottom: i < 5 ? '1px solid #f1f5f9' : 'none', alignItems: 'flex-start' }}>
                                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '28px', color: '#94a3b8', lineHeight: 1.2, flexShrink: 0, width: '28px', paddingTop: '1px' }}>{item.n}</span>
                                    <div>
                                        <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '18px', color: '#1E293B', textTransform: 'uppercase', marginBottom: '6px' }}>{item.title}</h4>
                                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5 ─ REGISTRATION FORM (bottom) */}
                <section id="anmelden" style={{ padding: '80px 0', background: '#e8edf2', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>
                        <div style={{ background: '#fff', border: '1px solid #d1d5db', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', padding: '48px 40px' }}>
                            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', textTransform: 'uppercase', color: '#1E293B', marginBottom: '10px' }}>Jetzt anmelden</h2>
                            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7, marginBottom: '32px' }}>
                                Sie haben Interesse an einer Kooperation?<br />Melden Sie sich und wir treten mit Ihnen in Kontakt.
                            </p>
                            <PartnerForm />
                        </div>
                    </div>
                </section>

                {/* 6 ─ DARK CTA STRIP */}
                <section style={{ padding: '60px 24px', background: '#d1d5db', borderTop: '1px solid #c4c9d0' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                        <div>
                            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', textTransform: 'uppercase', color: '#1E293B', marginBottom: '6px' }}>Bereit, loszulegen?</h2>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Kostenlos · Kein Risiko · Unverbindlich</p>
                        </div>
                        <a href="#anmelden" style={{ backgroundColor: '#C8102E', color: '#fff', padding: '13px 36px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', flexShrink: 0 }}>
                            Jetzt Partner werden
                        </a>
                    </div>
                </section>

            </main>
            <div style={{ marginTop: '-64px' }}>
                <Footer />
            </div>
        </div>
    );
}
