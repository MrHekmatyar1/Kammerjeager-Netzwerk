'use client';

// Multi-step lead form — pest selection → quiz → contact → success
// Многошаговая форма — выбор вредителя → квиз → контакты → успех

import { useState } from 'react';
import { PESTS_DATA } from '../../constants/data';

type Step = 1 | 'kombination' | 'andere_options' | 'quiz' | 'contact' | 'success';
type KundeTyp = 'Privatkunde' | 'Firmenkunde' | 'Öffentlicher Sektor' | '';

const SUB_OPTS: Record<string, string[]> = {
    'Privatkunde': ['Haus / Wohnung', 'Garten', 'Sonstiges'],
    'Firmenkunde': ['Büro', 'Restaurant / Hotel', 'Lager / Halle', 'Sonstiges'],
    'Öffentlicher Sektor': ['Schule / Kita', 'Behörde', 'Krankenhaus / Pflegeheim', 'Sonstiges'],
};

interface QuizState {
    kundeTyp: KundeTyp;
    objektTyp: string;
    raeume: string;
    flaeche: string;
    befall: string;
    zugang: string;
    zugangInfo: string;
}
interface ContactState {
    plz: string; name: string; firma: string; telefon: string; email: string;
    strasse: string; hausnummer: string; etage: string;
}

const QUIZ_INIT: QuizState = { kundeTyp: '', objektTyp: '', raeume: '', flaeche: '', befall: '', zugang: '', zugangInfo: '' };
const CONTACT_INIT: ContactState = { plz: '', name: '', firma: '', telefon: '', email: '', strasse: '', hausnummer: '', etage: '' };

/* ── tokens ── */
const inp: React.CSSProperties = {
    width: '100%', padding: '13px 0 10px', border: 'none',
    borderBottom: '1px solid #c8c8c8', fontSize: '15px',
    color: '#1a1a1a', background: 'transparent', outline: 'none',
    fontFamily: 'inherit', borderRadius: '0',
};
const fieldLbl: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.13em',
    textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '2px',
};
const secLbl: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
    textTransform: 'uppercase', color: '#bbb', marginBottom: '14px', display: 'block',
};

/* ── Chip ── */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} style={{
            padding: '11px 8px',
            width: '100%',
            height: '100%',
            border: active ? '1.5px solid #1a1a1a' : '1px solid #d0d0d0',
            background: active ? '#1a1a1a' : '#fff',
            color: active ? '#fff' : '#444',
            fontSize: '14px', fontWeight: active ? 600 : 400,
            cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
        }}>
            {label}
        </button>
    );
}

/* ── ChipSection ── */
function ChipSection({ label, options, value, onChange }: {
    label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={secLbl}>{label}</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {options.map(v => (
                    <Chip key={v} label={v} active={value === v} onClick={() => onChange(value === v ? '' : v)} />
                ))}
            </div>
        </div>
    );
}

/* ── Field ── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={fieldLbl}>{label}{required && <span style={{ color: '#C8102E' }}> *</span>}</label>
            {children}
        </div>
    );
}

/* ── BackBtn ── */
function BackBtn({ label = 'Zurück', onClick }: { label?: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#aaa',
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '0 0 32px 0',
        }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {label}
        </button>
    );
}

/* ── PestCard — premium tile with red accent on press ── */
function PestCard({ p, onClick }: { p: typeof PESTS_DATA[0]; onClick: () => void }) {
    const [imgFailed, setImgFailed] = useState(false);
    const [pressed, setPressed] = useState(false);

    return (
        <button
            onClick={onClick}
            className="pest-card-btn"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '14px 6px 12px',
                background: '#ffffff',
                borderRadius: '14px',
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Image area */}
            <div style={{
                width: '100%',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                padding: '8px',
            }}>
                {!imgFailed
                    ? <img
                        src={p.img}
                        alt={p.name}
                        style={{ objectFit: 'contain', width: '80%', height: '80%', pointerEvents: 'none', display: 'block' }}
                        onError={() => setImgFailed(true)}
                    />
                    : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ pointerEvents: 'none' }}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                }
            </div>

            {/* Name */}
            <span style={{
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textAlign: 'center',
                lineHeight: 1.2,
                pointerEvents: 'none',
            }}>
                {p.name}
            </span>
        </button>
    );
}

/* ── OptionCard — for the 3 'Andere' options ── */
function OptionCard({ label, icon, onClick }: { label: React.ReactNode; icon: React.ReactNode; onClick: () => void }) {
    const [pressed, setPressed] = useState(false);
    return (
        <button
            onClick={onClick}
            className="pest-card-btn"
            style={{
                aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: '#ffffff',
                borderRadius: '14px', padding: '8px 4px', fontSize: '11px', fontWeight: 700,
                cursor: 'pointer', textAlign: 'center',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', userSelect: 'none',
                position: 'relative', overflow: 'hidden',
            }}
        >
            <div style={{ marginBottom: '8px', color: 'inherit' }}>
                {icon}
            </div>
            {label}
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function LeadWizard({ onSuccess }: { onSuccess?: () => void } = {}) {
    const [step, setStep] = useState<Step>(1);
    const [pest, setPest] = useState('');
    const [quiz, setQuiz] = useState<QuizState>(QUIZ_INIT);
    const [contact, setContact] = useState<ContactState>(CONTACT_INIT);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [kombiSelected, setKombiSelected] = useState<{ id: string; name: string }[]>([]);
    const [customFlaeche, setCustomFlaeche] = useState(false);
    const [customFlaecheVal, setCustomFlaecheVal] = useState('');

    const setQ = (k: keyof QuizState, v: string) =>
        setQuiz(p => ({ ...p, [k]: p[k] === v ? '' : v }));

    const setKunde = (v: KundeTyp) =>
        setQuiz(p => ({ ...p, kundeTyp: p.kundeTyp === v ? '' : v, objektTyp: '' }));

    const setC = (k: keyof ContactState) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setContact(p => ({ ...p, [k]: e.target.value }));

    const handlePest = (id: string, name: string) => {
        if (id === 'kombination') {
            setKombiSelected([]);
            setStep('kombination');
        } else if (id === 'andere') {
            setStep('andere_options');
        } else {
            setPest(name);
            setStep('quiz');
        }
    };

    const toggleKombi = (id: string, name: string) => {
        setKombiSelected(prev => {
            const exists = prev.some(p => p.id === id);
            if (exists) return prev.filter(p => p.id !== id);
            if (prev.length >= 3) return prev; // max 3
            return [...prev, { id, name }];
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...contact, ...quiz, schaedling: pest }),
            });
            const data = await res.json();
            if (!res.ok) setError(data.error || 'Fehler beim Senden.');
            else {
                setStep('success');
                setTimeout(() => onSuccess?.(), 2500);
            }
        } catch { setError('Netzwerkfehler. Bitte versuchen Sie es erneut.'); }
        finally { setLoading(false); }
    };

    if (step === 1) return (
        <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #c8cdd5',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            width: '100%',
            overflow: 'hidden',
        }}>
            <div style={{ padding: '28px 20px 32px' }}>

                {/* Step badge */}
                <p style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em',
                    color: '#C8102E', textTransform: 'uppercase', textAlign: 'center',
                    marginBottom: '8px',
                }}>Schritt 1 von 3</p>

                <h2 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(1.6rem, 5vw, 2.6rem)',
                    fontWeight: 900,
                    color: '#1E293B',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    marginBottom: '6px',
                    lineHeight: 1.0,
                    letterSpacing: '-0.02em',
                }}>
                    Welcher Schädling bereitet Probleme?
                </h2>

                <p style={{
                    fontSize: '13px', color: '#94a3b8', textAlign: 'center',
                    marginBottom: '24px', fontFamily: 'inherit', fontWeight: 400,
                }}>Tippen Sie auf den passenden Schädling</p>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {PESTS_DATA.map(p => {
                        const pestObj = p.id === 'kombination' ? { id: 'andere', name: 'Andere', img: p.img } : p;
                        return <PestCard key={pestObj.id} p={pestObj} onClick={() => handlePest(pestObj.id, pestObj.name)} />
                    })}
                </div>
            </div>
        </div>
    );

    /* ─────────── Andere options ─────────── */
    if (step === 'andere_options') return (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #c8cdd5', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', width: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '28px 20px 32px' }}>
                <BackBtn label="Zurück" onClick={() => setStep(1)} />
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.5rem,5vw,2.4rem)', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', textAlign: 'center', marginBottom: '6px', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
                    Wie möchten Sie das Problem beschreiben?
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '24px' }}>Wählen Sie eine der Optionen aus</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxWidth: '420px', margin: '0 auto' }}>
                    <OptionCard
                        onClick={() => { setPest('Unbekannt (Foto)'); setStep('contact'); }}
                        label={<>Foto<br />senden</>}
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>}
                    />
                    <OptionCard
                        onClick={() => { setPest('Unbekannt (Telefon)'); setStep('contact'); }}
                        label={<>Anruf<br />bitten</>}
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>}
                    />
                    <OptionCard
                        onClick={() => { setPest('Unbekannt (Text)'); setStep('contact'); }}
                        label={<>Problem<br />tippen</>}
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
                    />
                </div>
            </div>
        </div>
    );

    /* ─────────── Kombination multi-select ─────────── */
    if (step === 'kombination') return (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #c8cdd5', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', width: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '28px 20px 32px' }}>
                <BackBtn label="Zurück" onClick={() => setStep(1)} />
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#C8102E', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>Schritt 1 von 3</p>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.5rem,5vw,2.4rem)', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', textAlign: 'center', marginBottom: '6px', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
                    Welche Kombination?
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '8px' }}>Wählen Sie 2 oder 3 Schädlinge gleichzeitig aus</p>
                <p style={{ fontSize: '12px', color: kombiSelected.length >= 3 ? '#C8102E' : '#cbd5e1', textAlign: 'center', marginBottom: '20px', fontWeight: 600 }}>
                    {kombiSelected.length}/3 ausgewählt
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                    {PESTS_DATA.filter(p => p.id !== 'kombination').map(p => {
                        const sel = kombiSelected.some(k => k.id === p.id);
                        const disabled = kombiSelected.length >= 3 && !sel;
                        return (
                            <button
                                key={p.id}
                                onClick={() => !disabled && toggleKombi(p.id, p.name)}
                                className={`pest-card-btn ${sel ? 'selected' : ''}`}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'flex-start', padding: '14px 6px 12px',
                                    background: '#ffffff',
                                    borderRadius: '14px', cursor: disabled ? 'not-allowed' : 'pointer',
                                    opacity: disabled ? 0.4 : 1,
                                    width: 'calc(25% - 9px)', minWidth: '80px', position: 'relative',
                                    touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                                }}
                            >
                                {sel && (
                                    <div style={{ position: 'absolute', top: '6px', right: '6px', width: '18px', height: '18px', borderRadius: '50%', background: '#C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                )}
                                <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                                    <img src={p.img} alt={p.name} style={{ objectFit: 'contain', width: '80%', height: '80%', pointerEvents: 'none' }} />
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', lineHeight: 1.2 }}>{p.name}</span>
                            </button>
                        );
                    })}
                </div>

                <button
                    disabled={kombiSelected.length < 2}
                    onClick={() => { setPest(kombiSelected.map(k => k.name).join(' + ')); setStep('quiz'); }}
                    style={{
                        width: '100%', backgroundColor: kombiSelected.length >= 2 ? '#C8102E' : '#e5e7eb',
                        color: kombiSelected.length >= 2 ? '#fff' : '#9ca3af',
                        padding: '15px', fontWeight: 700, fontSize: '13px',
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        border: 'none', cursor: kombiSelected.length >= 2 ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit', transition: 'background 0.2s',
                    }}
                >
                    {kombiSelected.length < 2
                        ? `Noch ${2 - kombiSelected.length} auswählen…`
                        : `Weiter mit ${kombiSelected.map(k => k.name).join(' + ')} →`}
                </button>
            </div>
        </div>
    );

    /* ─────────── Step 2: QUIZ ─────────── */
    if (step === 'quiz') return (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #c8cdd5', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', width: '100%', overflow: 'hidden' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 20px 32px' }}>
                <BackBtn label="Zurück zur Schädlingsauswahl" onClick={() => setStep(1)} />

                {/* Step badge */}
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#C8102E', textTransform: 'uppercase', marginBottom: '24px' }}>Schritt 2 von 3</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

                    {/* Kundenkategorie */}
                    <div>
                        <span style={secLbl}>Kundenkategorie</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                            {(['Privatkunde', 'Firmenkunde', 'Öffentlicher Sektor'] as KundeTyp[]).map(v => (
                                <Chip key={v} label={v} active={quiz.kundeTyp === v} onClick={() => setKunde(v)} />
                            ))}
                        </div>
                        {quiz.kundeTyp && (
                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f4f4f4', animation: 'fadeIn .2s ease' }}>
                                <span style={secLbl}>Art des Objekts</span>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                                    {SUB_OPTS[quiz.kundeTyp]?.map(v => (
                                        <Chip key={v} label={v} active={quiz.objektTyp === v} onClick={() => setQ('objektTyp', v)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid #f0f0f0' }} />

                    {quiz.objektTyp !== 'Garten' && (
                        <ChipSection label="Anzahl der betroffenen Räume" options={['1', '2', '3', '4', '5']} value={quiz.raeume} onChange={v => setQ('raeume', v)} />
                    )}

                    {/* Befallene Fläche */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={secLbl}>Befallene Fläche (ca.)</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setCustomFlaeche(p => {
                                        if (!p) setQ('flaeche', '');
                                        else setCustomFlaecheVal('');
                                        return !p;
                                    });
                                }}
                                title={customFlaeche ? 'Vordefinierte Werte wählen' : 'Genaue m² eingeben'}
                                style={{
                                    background: customFlaeche ? '#1a1a1a' : 'transparent',
                                    border: customFlaeche ? '1.5px solid #1a1a1a' : '1px solid #d0d0d0',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: customFlaeche ? '#fff' : '#888',
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.15s',
                                    marginBottom: '2px',
                                }}
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Exakt
                            </button>
                        </div>
                        {customFlaeche ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeIn .2s ease' }}>
                                <input
                                    type="number"
                                    min="1"
                                    max="9999"
                                    value={customFlaecheVal}
                                    onChange={e => {
                                        setCustomFlaecheVal(e.target.value);
                                        setQuiz(p => ({ ...p, flaeche: e.target.value ? `${e.target.value} m²` : '' }));
                                    }}
                                    placeholder="z. B. 35"
                                    style={{ ...inp, width: '120px', flex: 'none' }}
                                />
                                <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>m²</span>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                                {['5–10 m²', '10–20 m²', '20–30 m²', '30–50 m²', '50–75 m²', '75–100 m²', '> 100 m²'].map(v => (
                                    <Chip key={v} label={v} active={quiz.flaeche === v} onClick={() => setQ('flaeche', v)} />
                                ))}
                            </div>
                        )}
                    </div>
                    <ChipSection label="Grad der Verseuchung" options={['Leicht', 'Mittel', 'Stark']} value={quiz.befall} onChange={v => setQ('befall', v)} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={secLbl}>Zugang zum Befallsort</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                            <Chip label="Leicht zugänglich" active={quiz.zugang === 'leicht'} onClick={() => setQ('zugang', 'leicht')} />
                            <Chip label="Schwer zugänglich" active={quiz.zugang === 'schwer'} onClick={() => setQ('zugang', 'schwer')} />
                        </div>
                        {quiz.zugang === 'schwer' && (
                            <div style={{ marginTop: '12px', animation: 'fadeIn .2s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <label style={fieldLbl}>Wie kann der Techniker dorthin gelangen?</label>
                                    <span style={{ fontSize: '10px', color: '#ccc', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Optional</span>
                                </div>
                                <input type="text" value={quiz.zugangInfo} onChange={e => setQuiz(p => ({ ...p, zugangInfo: e.target.value }))}
                                    placeholder="z. B. Keller über Hinterhof …" style={inp} maxLength={200} />
                            </div>
                        )}
                    </div>

                    <button type="button" onClick={() => setStep('contact')} className="btn-color-hover" style={{
                        width: '100%', backgroundColor: '#C8102E', color: '#fff',
                        padding: '15px', fontWeight: 700, fontSize: '13px',
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        borderRadius: '8px'
                    }}>
                        Weiter zur Anmeldung
                    </button>
                </div>

                <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }`}</style>
            </div>
        </div>
    );

    /* ─────────── Step 3: CONTACT (Orkin-style) ─────────── */
    if (step === 'contact') return (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #c8cdd5', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', width: '100%', overflow: 'hidden' }}>
            <div style={{ width: '100%', padding: '28px 20px 32px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)',
                    gap: '80px',
                    alignItems: 'start',
                }} className="orkin-grid">

                    {/* LEFT */}
                    <div style={{ paddingTop: '4px' }}>
                        <BackBtn label="Zurück zum Fragebogen" onClick={() => setStep('quiz')} />
                        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8102E', marginBottom: '12px' }}>Schritt 3 von 3</p>
                        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '20px' }}>
                            Kostenloses Angebot anfordern
                        </p>
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', lineHeight: 1.05, color: '#1a1a1a', marginBottom: '22px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Ihr kostenloses,<br />persönliches Angebot<br />ohne Verpflichtung.
                        </h2>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8, maxWidth: '300px' }}>
                            Unsere Schädlingsbekämpfer sind ausgebildet, alle Arten von Schädlingsproblemen zu diagnostizieren. Da jeder Fall einzigartig ist, entwickeln wir ein individuelles Konzept für Sie.
                        </p>
                        {pest && (
                            <div style={{ marginTop: '28px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: '#f8f8f8', border: '1px solid #eee' }}>
                                <span style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Schädling:</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{pest}</span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <Field label="Vollständiger Name" required>
                            <input type="text" value={contact.name} onChange={setC('name')} required placeholder="Max Mustermann" style={inp} />
                        </Field>
                        <Field label="Telefonnummer" required>
                            <input type="tel" value={contact.telefon} onChange={setC('telefon')} required placeholder="+49 30 …" style={inp} />
                        </Field>
                        <Field label="E-Mail-Adresse" required>
                            <input type="email" value={contact.email} onChange={setC('email')} required placeholder="info@beispiel.de" style={inp} />
                        </Field>
                        <Field label="Postleitzahl" required>
                            <input type="text" value={contact.plz} onChange={setC('plz')} required placeholder="12205" style={inp} />
                        </Field>

                        <Field label="Straße" required>
                            <input type="text" value={contact.strasse} onChange={setC('strasse')} required placeholder="Musterstraße" style={inp} />
                        </Field>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <Field label="Hausnummer" required>
                                    <input type="text" value={contact.hausnummer} onChange={setC('hausnummer')} required placeholder="12a" style={inp} />
                                </Field>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Field label="Etage">
                                    <input type="text" value={contact.etage} onChange={setC('etage')} placeholder="EG, 1. OG..." style={inp} />
                                </Field>
                            </div>
                        </div>

                        {pest === 'Unbekannt (Foto)' && (
                            <Field label="Foto hochladen" required>
                                <input type="file" accept="image/*" style={{ ...inp, borderBottom: 'none', padding: '10px 0' }} />
                            </Field>
                        )}

                        {pest === 'Unbekannt (Text)' && (
                            <Field label="Problembeschreibung" required>
                                <textarea rows={3} placeholder="Bitte beschreiben Sie das Problem kurz..." style={{ ...inp, resize: 'vertical' }} required></textarea>
                            </Field>
                        )}

                        <Field label="Unternehmensname">
                            <input type="text" value={contact.firma} onChange={setC('firma')} placeholder="Muster GmbH (optional)" style={inp} />
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

    /* ─────────── Success ─────────── */
    return (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #c8cdd5', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', width: '100%', overflow: 'hidden' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '80px 24px' }}>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '36px', fontWeight: 900, textTransform: 'uppercase', color: '#1a1a1a', marginBottom: '14px' }}>
                    Vielen Dank!
                </h3>
                <p style={{ color: '#777', fontSize: '16px', lineHeight: 1.8 }}>
                    Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.
                </p>
            </div>
        </div>
    );
}
