'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '6px',
};

const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    backgroundColor: '#fff',
};

function KontaktForm() {
    const [form, setForm] = useState({
        name: '',
        unternehmen: '',
        branche: 'Gastronomie & Café',
        schaedling: 'Schaben / Kakerlaken',
        telefon: '',
        email: '',
        plz: '',
        nachricht: '',
    });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.unternehmen || !form.telefon || !form.email || !form.plz) {
            alert('Bitte füllen Sie alle Pflichtfelder aus (Name, Firma, Telefon, E-Mail, PLZ).');
            return;
        }
        setLoading(true);
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    firma: form.unternehmen,
                    telefon: form.telefon,
                    email: form.email,
                    plz: form.plz,
                    kundeTyp: 'B2B',
                    objektTyp: form.branche,
                    schaedling: form.schaedling,
                    zugangInfo: form.nachricht
                })
            });
            setSent(true);
        } catch (error) {
            console.error('Error submitting B2B form:', error);
            alert('Fehler beim Senden. Bitte versuchen Sie es später noch einmal.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h3 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '28px', fontWeight: 900,
                    textTransform: 'uppercase', color: '#1E293B', margin: '0 0 8px',
                }}>Vielen Dank für Ihre Anfrage!</h3>
                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>
                    Ihre Anfrage für <strong>{form.unternehmen}</strong> wurde erfolgreich übermittelt.<br />
                    Unser B2B-Team wird sich schnellstmöglich mit Ihnen in Verbindung setzen.
                </p>
            </div>
        );
    }

    return (
        <div>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
                Füllen Sie das folgende Formular aus und wir rufen Sie zeitnah für eine diskrete Beratung zurück.
            </p>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '24px' }}>
                Oder rufen Sie uns direkt an unter:{' '}
                <a href="tel:016092376320" style={{ color: '#C8102E', fontWeight: 600, textDecoration: 'none' }}>
                    0160 92376320
                </a>{' '}
                (Mo – Fr, 9–18 Uhr)
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label style={labelStyle}>Name des Betriebs / Firma *</label>
                        <input
                            name="unternehmen"
                            value={form.unternehmen}
                            onChange={set}
                            style={inputStyle}
                            placeholder="z. B. Café Müller / Bistro Sun"
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Ansprechpartner (Vor- und Nachname) *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={set}
                            style={inputStyle}
                            placeholder="Max Mustermann"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label style={labelStyle}>Art des Betriebs / Branche</label>
                        <select name="branche" value={form.branche} onChange={set} style={selectStyle}>
                            <option value="Gastronomie & Café">Gastronomie &amp; Café</option>
                            <option value="Bäckerei / Konditorei">Bäckerei / Konditorei</option>
                            <option value="Hotel & Gastgewerbe">Hotel &amp; Gastgewerbe</option>
                            <option value="Büro, Kanzlei & Praxis">Büro, Kanzlei &amp; Praxis</option>
                            <option value="Einzelhandel & Supermarkt">Einzelhandel &amp; Supermarkt</option>
                            <option value="Lager & Logistik">Lager &amp; Logistik</option>
                            <option value="Lebensmittelverarbeitung">Lebensmittelverarbeitung</option>
                            <option value="Sonstiges Kleingewerbe">Sonstiges Kleingewerbe</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Schädling / Anliegen</label>
                        <select name="schaedling" value={form.schaedling} onChange={set} style={selectStyle}>
                            <option value="Schaben / Kakerlaken">Schaben / Kakerlaken (Akut)</option>
                            <option value="Mäuse / Ratten">Mäuse / Ratten (Nager)</option>
                            <option value="Fliegen / Vorratsschädlinge">Fliegen / Vorratsschädlinge</option>
                            <option value="Bettwanzen">Bettwanzen</option>
                            <option value="Wespen / Hornissen">Wespen / Hornissen</option>
                            <option value="Regelmäßiges Monitoring & HACCP">Regelmäßiges Monitoring &amp; HACCP</option>
                            <option value="Akuter Befall (Art unklar)">Akuter Befall (Art unklar)</option>
                            <option value="Sonstiger Bedarf">Sonstiger Bedarf</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label style={labelStyle}>Telefonnummer für Rückruf *</label>
                        <input
                            name="telefon"
                            type="tel"
                            value={form.telefon}
                            onChange={set}
                            style={inputStyle}
                            placeholder="0170 1234567"
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Postleitzahl (PLZ) *</label>
                        <input
                            name="plz"
                            type="text"
                            value={form.plz}
                            onChange={set}
                            style={inputStyle}
                            placeholder="12345"
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>E-Mail-Adresse *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={set}
                            style={inputStyle}
                            placeholder="kontakt@betrieb.de"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Details / Nachricht (optional)</label>
                    <textarea
                        name="nachricht"
                        value={form.nachricht}
                        onChange={set}
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        placeholder="Zusätzliche Angaben, z. B. betroffene Bereiche (Küche, Gastraum, Lager), gewünschte Uhrzeiten für diskreten Einsatz..."
                    />
                </div>

                <div style={{ paddingTop: '6px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-color-hover"
                        style={{
                            padding: '14px 32px',
                            background: loading ? '#9ca3af' : '#C8102E',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '15px',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {loading ? 'Wird gesendet...' : 'B2B-Anfrage unverbindlich senden'}
                    </button>
                </div>
            </form>
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
                <section id="kontakt" className="w-full bg-[#F8FAFC] py-20 px-6">
                    <div style={{ maxWidth: '740px', margin: '0 auto' }}>
                        <h2 style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                            fontWeight: 900, color: '#1E293B', marginBottom: '16px',
                        }}>
                            Interesse? Kontaktieren Sie uns!
                        </h2>
                        <KontaktForm />
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}
