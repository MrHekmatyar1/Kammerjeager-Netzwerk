'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inp: React.CSSProperties = {
    width: '100%',
    padding: '13px 0 10px',
    border: 'none',
    borderBottom: '1px solid #c8c8c8',
    fontSize: '15px',
    color: '#1a1a1a',
    background: 'transparent',
    outline: 'none',
    fontFamily: 'inherit',
    borderRadius: '0',
    boxSizing: 'border-box',
};

const fieldLbl: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: '#888',
    display: 'block',
    marginBottom: '2px',
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={fieldLbl}>{label}{required && <span style={{ color: '#C8102E' }}> *</span>}</label>
            {children}
        </div>
    );
}

function KontaktForm() {
    const [form, setForm] = useState({
        name: '',
        telefon: '',
        email: '',
        plz: '',
        strasse: '',
        hausnummer: '',
        etage: '',
        unternehmen: '',
    });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(p => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.telefon || !form.email || !form.plz || !form.strasse || !form.hausnummer) {
            setError('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    telefon: form.telefon,
                    email: form.email,
                    plz: form.plz,
                    strasse: form.strasse,
                    hausnummer: form.hausnummer,
                    etage: form.etage,
                    firma: form.unternehmen,
                    kundeTyp: 'B2B',
                    schaedling: 'Gewerblicher Schutz',
                    objektTyp: 'Gewerbe & B2B',
                })
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error || 'Fehler beim Senden.');
            } else {
                setSent(true);
            }
        } catch {
            setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1.5px solid #c8cdd5',
                boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                width: '100%',
                padding: '60px 24px',
                textAlign: 'center',
            }}>
                <h3 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '32px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#1E293B',
                    margin: '0 0 12px',
                }}>
                    Vielen Dank für Ihre Anfrage!
                </h3>
                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
                    Wir haben Ihre Daten erfolgreich erhalten. Einer unserer Experten für Gewerbekunden wird sich schnellstmöglich mit Ihnen in Verbindung setzen.
                </p>
            </div>
        );
    }

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #c8cdd5',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            width: '100%',
            overflow: 'hidden',
        }}>
            <div style={{ width: '100%', padding: '36px 32px 40px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)',
                    gap: '80px',
                    alignItems: 'start',
                }} className="orkin-grid">

                    {/* LEFT */}
                    <div style={{ paddingTop: '4px' }}>
                        <button
                            type="button"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#aaa',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                padding: '0 0 32px 0',
                            }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                            Zurück nach oben
                        </button>
                        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8102E', marginBottom: '12px' }}>
                            Schritt 3 von 3
                        </p>
                        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '20px' }}>
                            Kostenloses Angebot anfordern
                        </p>
                        <h2 style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 900,
                            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                            lineHeight: 1.05,
                            color: '#1a1a1a',
                            marginBottom: '22px',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                        }}>
                            Ihr kostenloses,<br />persönliches Angebot<br />ohne Verpflichtung.
                        </h2>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8, maxWidth: '300px' }}>
                            Unsere Schädlingsbekämpfer sind ausgebildet, alle Arten von Schädlingsproblemen zu diagnostizieren. Da jeder Fall einzigartig ist, entwickeln wir ein individuelles Konzept für Sie.
                        </p>
                        <div style={{ marginTop: '28px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: '#f8f8f8', border: '1px solid #eee' }}>
                            <span style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Schädling:</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>Gewerblicher Schutz</span>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <Field label="Vollständiger Name" required>
                            <input type="text" value={form.name} onChange={set('name')} required placeholder="Max Mustermann" style={inp} />
                        </Field>
                        <Field label="Telefonnummer" required>
                            <input type="tel" value={form.telefon} onChange={set('telefon')} required placeholder="+49 30 …" style={inp} />
                        </Field>
                        <Field label="E-Mail-Adresse" required>
                            <input type="email" value={form.email} onChange={set('email')} required placeholder="info@beispiel.de" style={inp} />
                        </Field>
                        <Field label="Postleitzahl" required>
                            <input type="text" value={form.plz} onChange={set('plz')} required placeholder="12205" style={inp} />
                        </Field>
                        <Field label="Straße" required>
                            <input type="text" value={form.strasse} onChange={set('strasse')} required placeholder="Musterstraße" style={inp} />
                        </Field>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <Field label="Hausnummer" required>
                                    <input type="text" value={form.hausnummer} onChange={set('hausnummer')} required placeholder="12a" style={inp} />
                                </Field>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Field label="Etage">
                                    <input type="text" value={form.etage} onChange={set('etage')} placeholder="EG, 1. OG..." style={inp} />
                                </Field>
                            </div>
                        </div>
                        <Field label="Unternehmensname">
                            <input type="text" value={form.unternehmen} onChange={set('unternehmen')} placeholder="Muster GmbH (optional)" style={inp} />
                        </Field>

                        {error && (
                            <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '13px' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <p style={{ fontSize: '12px', color: '#999', lineHeight: 1.7, marginBottom: '20px' }}>
                                Mit dem Klick auf „Absenden" stimme ich zu, dass Kammerjäger-Zentrale mich unter der angegebenen Nummer per Telefon oder E-Mail kontaktieren darf.{' '}
                                Ich habe die <a href="/datenschutz" target="_blank" style={{ color: '#C8102E', textDecoration: 'underline' }}>Datenschutzerklärung</a> gelesen.
                            </p>
                            <button type="submit" disabled={loading} className="btn-color-hover" style={{
                                width: '100%', backgroundColor: loading ? '#c0c0c0' : '#C8102E',
                                color: '#fff', padding: '15px', fontWeight: 700, fontSize: '13px',
                                letterSpacing: '0.14em', textTransform: 'uppercase', border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                            }}>
                                {loading ? 'Wird gesendet …' : 'Absenden'}
                            </button>
                        </div>
                    </form>
                </div>

                <style>{`@media (max-width: 768px) { .orkin-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
            </div>
        </div>
    );
}

export default function GeschaeftskundenPage() {
    return (
        <>
            <Header />

            <main style={{ paddingTop: '68px' }} className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">

                {/* ── Hero ── */}
                <section className="w-full flex justify-center border-b border-gray-100"
                    style={{ padding: '4px 0 80px' }}
                >
                    <div className="w-full max-w-[1200px] px-6 space-y-6">


                        <h1
                            className="text-5xl md:text-7xl font-black leading-[1.05] uppercase tracking-tight"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
                        >
                            <span className="block text-[#1E293B]">Für Unternehmen &amp; Gewerbe</span>
                            <span className="block text-[#1E293B]">Professionelle</span>
                            <span className="block text-[#1E293B]">Schädlings</span>
                            <span className="block text-[#C8102E]">bekämpfung.</span>
                        </h1>


                        <p className="text-xl text-gray-500 max-w-xl font-medium" style={{ lineHeight: 1.6 }}>
                            Maßgeschneiderte Lösungen für Gastronomie, Büros und Industrie.
                            Diskret, schnell und rechtssicher — täglich deutschlandweit.
                        </p>

                        <div className="flex items-center gap-6">
                    <button
                        className="bg-[#C8102E] btn-color-hover text-white rounded-none font-black shadow-xl shadow-red-100 uppercase whitespace-nowrap inline-flex items-center justify-center"
                        style={{ fontSize: '14px', padding: '16px 42px', lineHeight: '1', border: 'none', cursor: 'pointer' }}
                        onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Jetzt anfragen
                    </button>
                            <a href="tel:016092376320" className="text-[#C8102E] font-bold flex items-center gap-2 hover:text-red-800 transition-colors"
                                style={{ fontSize: '15px', textDecoration: 'none' }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                0160 92376320
                            </a>
                        </div>
                    </div>
                </section>

                {/* ── Branchenlösungen (Отрасли - Orkin Style) ── */}
                <section className="w-full bg-[#f8f8f8] py-24 px-6 flex justify-center">
                    <div className="w-full max-w-[1200px]">
                        <div className="mb-14">
                            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '800px' }}>
                                Fachgerechter Schutz für Ihre Branche
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {[
                                {
                                    title: 'Gastronomie & Lebensmittel',
                                    desc: 'HACCP-konforme Maßnahmen und lückenlose Dokumentation. Diskrete Einsätze außerhalb der Öffnungszeiten zum Schutz Ihres Rufs.',
                                    img: '/b2b/b2b_restaurant.png',
                                    link: 'Mehr erfahren'
                                },
                                {
                                    title: 'Hotellerie & Gewerbe',
                                    desc: 'Schnelle und unauffällige Lösungen für höchste Gästezufriedenheit. Unsere Techniker arbeiten diskret in neutraler Kleidung.',
                                    img: '/b2b/b2b_hotel.png',
                                    link: 'Mehr erfahren'
                                },
                                {
                                    title: 'Lager & Logistik',
                                    desc: 'Kontinuierliches Monitoring und proaktive Prävention zum Schutz von Waren, Lieferketten und Gebäudeinfrastruktur.',
                                    img: '/b2b/b2b_warehouse.png',
                                    link: 'Mehr erfahren'
                                },
                                {
                                    title: 'Öffentlicher Sektor',
                                    desc: 'Sichere, umweltfreundliche und giftfreie Methoden für sensible Bereiche wie Schulen, Krankenhäuser und Behörden.',
                                    img: '/b2b/b2b_school.png',
                                    link: 'Mehr erfahren'
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-start group">
                                    <div className="w-full aspect-[4/3] overflow-hidden mb-6 bg-slate-200">
                                        <img 
                                            src={item.img} 
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '26px', fontWeight: 800, textTransform: 'uppercase', color: '#1a1a1a', marginBottom: '12px', letterSpacing: '0.01em', lineHeight: 1.1 }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-[#555] text-[15px] leading-relaxed mb-6 flex-grow font-medium" style={{ fontFamily: 'inherit' }}>
                                        {item.desc}
                                    </p>
                                    <button 
                                        className="text-[#C8102E] font-bold text-[13px] flex items-center gap-1.5 transition-all mt-auto uppercase tracking-[0.08em]"
                                        onMouseEnter={e => (e.currentTarget.style.gap = '8px')}
                                        onMouseLeave={e => (e.currentTarget.style.gap = '6px')}
                                        style={{ transition: 'gap 0.2s ease', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                                    >
                                        {item.link} 
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Контактная форма ── */}
                <section id="kontakt" className="w-full flex flex-col items-center px-6 pt-[80px] pb-[140px]" style={{ background: '#f1f4f8' }}>
                    <div className="w-full max-w-[850px]">
                        <KontaktForm />
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}
