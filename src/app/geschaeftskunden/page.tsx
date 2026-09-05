'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inp: React.CSSProperties = {
    width: '100%',
    padding: '9px 0 7px',
    border: 'none',
    borderBottom: '1px solid #c8c8c8',
    fontSize: '14px',
    color: '#1a1a1a',
    background: 'transparent',
    outline: 'none',
    fontFamily: 'inherit',
    borderRadius: '0',
    boxSizing: 'border-box',
};

const BRANCHE_OPTIONS = [
    { value: 'Gastronomie & Café', label: 'Gastronomie & Café' },
    { value: 'Bäckerei / Konditorei', label: 'Bäckerei / Konditorei' },
    { value: 'Hotel & Gastgewerbe', label: 'Hotel & Gastgewerbe' },
    { value: 'Büro, Kanzlei & Praxis', label: 'Büro, Kanzlei & Praxis' },
    { value: 'Einzelhandel & Supermarkt', label: 'Einzelhandel & Supermarkt' },
    { value: 'Lager & Logistik', label: 'Lager & Logistik' },
    { value: 'Lebensmittelverarbeitung', label: 'Lebensmittelverarbeitung' },
    { value: 'Sonstiges Kleingewerbe', label: 'Sonstiges Kleingewerbe' },
];

const SCHAEDLING_OPTIONS = [
    { value: 'Schaben / Kakerlaken', label: 'Schaben / Kakerlaken (Akut)' },
    { value: 'Mäuse / Ratten', label: 'Mäuse / Ratten (Nager)' },
    { value: 'Fliegen / Vorratsschädlinge', label: 'Fliegen / Vorratsschädlinge' },
    { value: 'Bettwanzen', label: 'Bettwanzen' },
    { value: 'Wespen / Hornissen', label: 'Wespen / Hornissen' },
    { value: 'Regelmäßiges Monitoring & HACCP', label: 'Regelmäßiges Monitoring & HACCP' },
    { value: 'Akuter Befall (Art unklar)', label: 'Akuter Befall (Art unklar)' },
    { value: 'Sonstiger Bedarf', label: 'Sonstiger Bedarf' },
];

function CustomSelect({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
}) {
    const [open, setOpen] = useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <button
                type="button"
                onClick={() => setOpen(p => !p)}
                style={{
                    width: '100%',
                    padding: '9px 20px 7px 0',
                    border: 'none',
                    borderBottom: open ? '1.5px solid #C8102E' : '1px solid #c8c8c8',
                    fontSize: '14px',
                    color: '#1a1a1a',
                    background: 'transparent',
                    outline: 'none',
                    fontFamily: 'inherit',
                    borderRadius: 0,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedLabel}
                </span>
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#888"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                        padding: '6px',
                        maxHeight: '230px',
                        overflowY: 'auto',
                    }}
                >
                    {options.map(opt => {
                        const isSelected = opt.value === value;
                        return (
                            <div
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                style={{
                                    padding: '9px 12px',
                                    fontSize: '13.5px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: isSelected ? '#C8102E' : '#1e293b',
                                    backgroundColor: isSelected ? '#fef2f2' : 'transparent',
                                    fontWeight: isSelected ? 600 : 400,
                                    transition: 'background-color 0.15s ease, color 0.15s ease',
                                }}
                                onMouseEnter={e => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                                }}
                                onMouseLeave={e => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {opt.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const txtArea: React.CSSProperties = {
    width: '100%',
    padding: '9px 0 7px',
    border: 'none',
    borderBottom: '1px solid #c8c8c8',
    fontSize: '14px',
    color: '#1a1a1a',
    background: 'transparent',
    outline: 'none',
    fontFamily: 'inherit',
    borderRadius: '0',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '52px',
    maxHeight: '140px',
};

const fieldLbl: React.CSSProperties = {
    fontSize: '10.5px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#888',
    display: 'block',
    marginBottom: '2px',
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="b2b-field" style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={fieldLbl}>{label}{required && <span style={{ color: '#C8102E' }}> *</span>}</label>
            {children}
        </div>
    );
}

function KontaktForm() {
    const [form, setForm] = useState({
        unternehmen: '',
        name: '',
        branche: 'Gastronomie & Café',
        sonstigesBranche: '',
        schaedling: 'Schaben / Kakerlaken',
        telefon: '',
        plz: '',
        email: '',
        nachricht: '',
    });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k: keyof typeof form) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm(p => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.unternehmen || !form.name || !form.telefon || !form.email || !form.plz) {
            setError('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }
        if (form.branche === 'Sonstiges Kleingewerbe' && !form.sonstigesBranche.trim()) {
            setError('Bitte beschreiben Sie kurz die Tätigkeit / Branche Ihres Betriebs.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const resolvedBranche = form.branche === 'Sonstiges Kleingewerbe' && form.sonstigesBranche.trim()
                ? `Sonstiges (${form.sonstigesBranche.trim()})`
                : form.branche;

            const notes = [
                form.branche === 'Sonstiges Kleingewerbe' && form.sonstigesBranche.trim()
                    ? `Gewerbe: ${form.sonstigesBranche.trim()}`
                    : null,
                form.nachricht.trim() || null
            ].filter(Boolean).join(' | ');

            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    firma: form.unternehmen,
                    telefon: form.telefon,
                    email: form.email,
                    plz: form.plz,
                    kundeTyp: 'B2B',
                    objektTyp: resolvedBranche,
                    schaedling: form.schaedling,
                    zugangInfo: notes || null,
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
                padding: '48px 24px',
                textAlign: 'center',
            }}>
                <h3 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '28px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#1E293B',
                    margin: '0 0 10px',
                }}>
                    Vielen Dank für Ihre Anfrage!
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
                    Ihre Anfrage für <strong>{form.unternehmen}</strong> wurde erfolgreich übermittelt.<br />
                    Unser B2B-Team wird sich schnellstmöglich mit Ihnen in Verbindung setzen.
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
            overflow: 'visible',
            padding: '34px 30px 36px',
            boxSizing: 'border-box',
        }}>
            <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C8102E', marginBottom: '6px' }}>
                    Gewerbekunden &amp; B2B
                </p>
                <h2 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                    fontWeight: 900,
                    color: '#1a1a1a',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    margin: '0 0 8px',
                }}>
                    Interesse? Kontaktieren Sie uns!
                </h2>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: 0 }}>
                    Füllen Sie das folgende Formular aus und wir rufen Sie zeitnah für eine diskrete Beratung zurück.<br />
                    Oder rufen Sie uns direkt an unter:{' '}
                    <a href="tel:016092376320" style={{ color: '#C8102E', fontWeight: 700, textDecoration: 'none' }}>
                        0160 92376320
                    </a>{' '}
                    (Mo – Fr, 9–18 Uhr)
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Name des Betriebs / Firma" required>
                        <input
                            type="text"
                            name="unternehmen"
                            value={form.unternehmen}
                            onChange={set('unternehmen')}
                            required
                            placeholder="z. B. Café Müller / Bistro Sun"
                            style={inp}
                        />
                    </Field>
                    <Field label="Ansprechpartner (Vor- und Nachname)" required>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={set('name')}
                            required
                            placeholder="Max Mustermann"
                            style={inp}
                        />
                    </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Art des Betriebs / Branche">
                        <CustomSelect
                            value={form.branche}
                            onChange={val => setForm(p => ({ ...p, branche: val }))}
                            options={BRANCHE_OPTIONS}
                        />
                    </Field>
                    <Field label="Schädling / Anliegen">
                        <CustomSelect
                            value={form.schaedling}
                            onChange={val => setForm(p => ({ ...p, schaedling: val }))}
                            options={SCHAEDLING_OPTIONS}
                        />
                    </Field>
                </div>

                {form.branche === 'Sonstiges Kleingewerbe' && (
                    <div style={{ animation: 'b2bFadeIn 0.25s ease' }}>
                        <Field label="Genaue Tätigkeit / Was macht Ihr Betrieb?" required>
                            <input
                                type="text"
                                name="sonstigesBranche"
                                value={form.sonstigesBranche}
                                onChange={set('sonstigesBranche')}
                                required
                                placeholder="z. B. Autowerkstatt, Kosmetikstudio, Schreinerei, Dienstleistungen …"
                                style={inp}
                            />
                        </Field>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Field label="Telefonnummer für Rückruf" required>
                        <input
                            type="tel"
                            name="telefon"
                            value={form.telefon}
                            onChange={set('telefon')}
                            required
                            placeholder="+49 30 …"
                            style={inp}
                        />
                    </Field>
                    <Field label="Postleitzahl (PLZ)" required>
                        <input
                            type="text"
                            name="plz"
                            value={form.plz}
                            onChange={set('plz')}
                            required
                            placeholder="12205"
                            style={inp}
                        />
                    </Field>
                    <Field label="E-Mail-Adresse" required>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={set('email')}
                            required
                            placeholder="kontakt@betrieb.de"
                            style={inp}
                        />
                    </Field>
                </div>

                <Field label="Details / Nachricht (optional)">
                    <textarea
                        name="nachricht"
                        value={form.nachricht}
                        onChange={set('nachricht')}
                        rows={3}
                        maxLength={1000}
                        placeholder="Zusätzliche Angaben, z. B. betroffene Bereiche (Küche, Gastraum, Lager), gewünschte Uhrzeiten für diskreten Einsatz..."
                        style={txtArea}
                    />
                </Field>

                {error && (
                    <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                <div>
                    <p style={{ fontSize: '12px', color: '#999', lineHeight: 1.6, marginBottom: '18px' }}>
                        Mit dem Klick auf „Anfrage absenden" stimme ich zu, dass Kammerjäger-Zentrale mich unter der angegebenen Nummer per Telefon oder E-Mail kontaktieren darf.{' '}
                        Ich habe die <a href="/datenschutz" target="_blank" style={{ color: '#C8102E', textDecoration: 'underline' }}>Datenschutzerklärung</a> gelesen.
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-color-hover"
                        style={{
                            width: '100%',
                            backgroundColor: loading ? '#c0c0c0' : '#C8102E',
                            color: '#fff',
                            padding: '16px',
                            fontWeight: 700,
                            fontSize: '13px',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        {loading ? 'Wird gesendet …' : 'Anfrage absenden'}
                    </button>
                </div>
            </form>

            <style>{`
                .b2b-field input:focus, .b2b-field textarea:focus {
                    border-bottom-color: #C8102E !important;
                }
                @keyframes b2bFadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
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
                <section id="kontakt" className="w-full flex flex-col items-center px-6 pt-[60px] pb-[110px]" style={{ background: '#f1f4f8' }}>
                    <div className="w-full max-w-[720px]">
                        <KontaktForm />
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}
