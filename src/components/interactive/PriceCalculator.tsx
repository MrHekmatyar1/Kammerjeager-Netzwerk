'use client';

// Price Calculator modal — same wizard as LeadWizard but shows estimated price at the end
// Калькулятор цены — тот же квиз что и LeadWizard, но в конце показывает примерную стоимость

import { useState, useCallback, useEffect, useRef } from 'react';
import { PESTS_DATA } from '../../constants/data';

/* ─── Price model ─── */
const BASE_PRICES: Record<string, number> = {
    wespen: 160, bettwanzen: 380, ratten: 290, maeuse: 200,
    schaben: 420, ameisen: 140, motten: 150, floehe: 210,
    tauben: 480, fliegen: 120, kaefer: 160, kombination: 240,
};
const ROOM_MULT: Record<string, number> = { '1': 1.0, '2': 1.25, '3': 1.5, '4': 1.75, '5': 2.1 };
const AREA_MULT: Record<string, number> = { 
    '5–10 m²': 0.8, 
    '10–20 m²': 1.0, 
    '20–30 m²': 1.15, 
    '30–50 m²': 1.3, 
    '50–75 m²': 1.45, 
    '75–100 m²': 1.65, 
    '> 100 m²': 2.2 
};

function getAreaMult(flaeche: string) {
    if (AREA_MULT[flaeche]) return AREA_MULT[flaeche];
    const m = parseInt(flaeche);
    if (!isNaN(m)) {
        if (m <= 10) return 0.8;
        if (m <= 20) return 1.0;
        if (m <= 30) return 1.15;
        if (m <= 50) return 1.3;
        if (m <= 75) return 1.45;
        if (m <= 100) return 1.65;
        return 2.2 + (m - 100) * 0.01;
    }
    return 1;
}
const BEFALL_MULT: Record<string, number> = { 'Leicht': 1.0, 'Mittel': 1.45, 'Stark': 1.95 };
const ZUGANG_MULT: Record<string, number> = { 'leicht': 1.0, 'schwer': 1.2 };

function calcPrice(pestId: string, quiz: QuizState): { min: number; max: number } {
    const base = BASE_PRICES[pestId] ?? 220;
    const r = ROOM_MULT[quiz.raeume] ?? 1;
    const a = getAreaMult(quiz.flaeche);
    const b = BEFALL_MULT[quiz.befall] ?? 1;
    const z = ZUGANG_MULT[quiz.zugang] ?? 1;
    const mid = base * r * a * b * z;
    return { min: Math.round(mid * 0.85 / 5) * 5, max: Math.round(mid * 1.18 / 5) * 5 };
}

// Combined price for multiple pests — sum of base prices × 0.8 combo discount
function calcComboPrice(pestIds: string[], quiz: QuizState): { min: number; max: number } {
    const baseSum = pestIds.reduce((acc, id) => acc + (BASE_PRICES[id] ?? 220), 0) * 0.8;
    const r = ROOM_MULT[quiz.raeume] ?? 1;
    const a = getAreaMult(quiz.flaeche);
    const b = BEFALL_MULT[quiz.befall] ?? 1;
    const z = ZUGANG_MULT[quiz.zugang] ?? 1;
    const mid = baseSum * r * a * b * z;
    return { min: Math.round(mid * 0.85 / 5) * 5, max: Math.round(mid * 1.18 / 5) * 5 };
}

/* ─── Types ─── */
type Step = 1 | 'kombination' | 'quiz' | 'result';
type KundeTyp = 'Privatkunde' | 'Firmenkunde' | 'Öffentlicher Sektor' | '';

interface QuizState {
    kundeTyp: KundeTyp;
    objektTyp: string;
    raeume: string;
    flaeche: string;
    befall: string;
    zugang: string;
}

const QUIZ_INIT: QuizState = { kundeTyp: '', objektTyp: '', raeume: '', flaeche: '', befall: '', zugang: '' };

const SUB_OPTS: Record<string, string[]> = {
    'Privatkunde':         ['Haus / Wohnung', 'Garten', 'Sonstiges'],
    'Firmenkunde':         ['Büro', 'Restaurant / Hotel', 'Lager / Halle', 'Sonstiges'],
    'Öffentlicher Sektor': ['Schule / Kita', 'Behörde', 'Krankenhaus / Pflegeheim', 'Sonstiges'],
};

/* ─── Styles ─── */
const secLbl: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
    textTransform: 'uppercase', color: '#bbb', marginBottom: '14px', display: 'block',
};

/* ─── Chip ─── */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} style={{
            padding: '11px 8px',
            width: '100%',
            border: active ? '1.5px solid #1a1a1a' : '1px solid #d0d0d0',
            background: active ? '#1a1a1a' : '#fff',
            color: active ? '#fff' : '#374151',
            fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            transition: 'all 0.15s',
        }}>
            {label}
        </button>
    );
}

function ChipSection({ label, options, value, onChange }: {
    label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
    return (
        <div>
            <span style={secLbl}>{label}</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {options.map(o => (
                    <Chip key={o} label={o} active={value === o} onClick={() => onChange(o)} />
                ))}
            </div>
        </div>
    );
}

function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '12px', color: '#94a3b8', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '0', marginBottom: '20px', letterSpacing: '0.1em',
            textTransform: 'uppercase', fontWeight: 600,
        }}>
            ← {label}
        </button>
    );
}

/* ─── PestCard (same as LeadWizard) ─── */
function PestCard({ p, onClick }: { p: typeof PESTS_DATA[0]; onClick: () => void }) {
    const [imgFailed, setImgFailed] = useState(false);
    const [pressed, setPressed] = useState(false);
    return (
        <button
            onClick={onClick}
            className="pest-card-btn"
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'flex-start', padding: '14px 6px 12px',
                background: '#ffffff',
                borderRadius: '14px', cursor: 'pointer',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                userSelect: 'none', width: '100%',
            }}
        >
            <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', padding: '8px' }}>
                {!imgFailed
                    ? <img src={p.img} alt={p.name} style={{ objectFit: 'contain', width: '80%', height: '80%', pointerEvents: 'none', display: 'block' }} onError={() => setImgFailed(true)} />
                    : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                }
            </div>
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', lineHeight: 1.2, pointerEvents: 'none' }}>
                {p.name}
            </span>
        </button>
    );
}

/* ─── Inner Wizard ─── */
function PriceWizard({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<Step>(1);
    const [pest, setPest] = useState<{ id: string; name: string } | null>(null);
    const [quiz, setQuiz] = useState<QuizState>(QUIZ_INIT);
    const [price, setPrice] = useState<{ min: number; max: number } | null>(null);
    const [kombiSelected, setKombiSelected] = useState<{id:string; name:string}[]>([]);
    const [customFlaeche, setCustomFlaeche] = useState(false);
    const [customFlaecheVal, setCustomFlaecheVal] = useState('');

    const setQ = (k: keyof QuizState, v: string) =>
        setQuiz(p => ({ ...p, [k]: p[k] === v ? '' : v }));

    const setKunde = (v: KundeTyp) =>
        setQuiz(p => ({ ...p, kundeTyp: p.kundeTyp === v ? '' : v, objektTyp: '' }));

    const handlePest = (id: string, name: string) => {
        if (id === 'kombination') {
            setKombiSelected([]);
            setStep('kombination');
        } else {
            setPest({ id, name });
            setStep('quiz');
        }
    };

    const toggleKombi = (id: string, name: string) => {
        setKombiSelected(prev => {
            const exists = prev.some(p => p.id === id);
            if (exists) return prev.filter(p => p.id !== id);
            if (prev.length >= 3) return prev;
            return [...prev, { id, name }];
        });
    };

    const handleCalculate = () => {
        if (!pest) return;
        setPrice(calcPrice(pest.id, quiz));
        setStep('result');
    };

    const handleComboCalculate = () => {
        setPrice(calcComboPrice(kombiSelected.map(k => k.id), quiz));
        setPest({ id: 'kombination', name: kombiSelected.map(k => k.name).join(' + ') });
        setStep('result');
    };

    const quizComplete = (quiz.objektTyp === 'Garten' || quiz.raeume) && quiz.flaeche && quiz.befall;

    /* ── Step 1: pest selection ── */
    if (step === 1) return (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '2px solid var(--wiz-border)', boxShadow: '0 12px 48px rgba(0,0,0,0.12)', width: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '28px 20px 32px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#C8102E', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>Schritt 1 von 2</p>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', textAlign: 'center', marginBottom: '6px', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
                    Welcher Schädling bereitet Probleme?
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '24px' }}>Wählen Sie den Schädling für eine Preisschätzung</p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {PESTS_DATA.map(p => (
                        <PestCard key={p.id} p={p} onClick={() => handlePest(p.id, p.name)} />
                    ))}
                </div>

                {/* Kombination — only in PriceCalculator */}
                <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px', textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={() => handlePest('kombination', 'Kombination')}
                        style={{
                            background: 'none',
                            border: '1.5px dashed #d0d0d0',
                            borderRadius: '10px',
                            padding: '10px 28px',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#888',
                            cursor: 'pointer',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            transition: 'border-color 0.15s, color 0.15s',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.color = '#C8102E'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0d0d0'; e.currentTarget.style.color = '#888'; }}
                    >
                        + Mehrere Schädlinge (Kombination)
                    </button>
                </div>
            </div>
        </div>
    );

    /* ── Step 1b: Kombination multi-select ── */
    if (step === 'kombination') return (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '2px solid var(--wiz-border)', boxShadow: '0 12px 48px rgba(0,0,0,0.12)', width: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '28px 20px 32px' }}>
                <BackBtn label="Zurück" onClick={() => setStep(1)} />
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#C8102E', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>Schritt 1 von 2</p>
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
                    onClick={() => { setQuiz(QUIZ_INIT); setStep('quiz'); setPest({ id: 'kombination', name: kombiSelected.map(k => k.name).join(' + ') }); }}
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

    /* ── Step 2: quiz ── */
    if (step === 'quiz') return (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '2px solid var(--wiz-border)', boxShadow: '0 12px 48px rgba(0,0,0,0.12)', width: '100%', overflow: 'hidden' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 20px 32px' }}>
                <BackBtn label="Zurück zur Schädlingsauswahl" onClick={() => setStep(1)} />
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#C8102E', textTransform: 'uppercase', marginBottom: '24px', textAlign: 'center' }}>Schritt 2 von 2</p>

            {pest && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#f8f8f8', border: '1px solid #eee', marginBottom: '28px' }}>
                    <span style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Schädling:</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{pest.name}</span>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Kundenkategorie */}
                <div>
                    <span style={secLbl}>Kundenkategorie</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                        {(['Privatkunde', 'Firmenkunde', 'Öffentlicher Sektor'] as KundeTyp[]).map(v => (
                            <Chip key={v} label={v} active={quiz.kundeTyp === v} onClick={() => setKunde(v)} />
                        ))}
                    </div>
                    {quiz.kundeTyp && (
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f4f4f4' }}>
                            <span style={secLbl}>Art des Objekts</span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                                {SUB_OPTS[quiz.kundeTyp]!.map(v => (
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
                            style={{
                                background: customFlaeche ? '#1a1a1a' : 'transparent',
                                border: customFlaeche ? '1.5px solid #1a1a1a' : '1px solid #d0d0d0',
                                borderRadius: '4px', padding: '4px 8px', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                fontSize: '11px', fontWeight: 600, color: customFlaeche ? '#fff' : '#888',
                                letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px',
                            }}
                        >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Exakt
                        </button>
                    </div>
                    {customFlaeche ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="number"
                                min="1" max="9999"
                                value={customFlaecheVal}
                                onChange={e => {
                                    setCustomFlaecheVal(e.target.value);
                                    setQuiz(p => ({ ...p, flaeche: e.target.value ? `${e.target.value} m²` : '' }));
                                }}
                                placeholder="z. B. 35"
                                style={{ width: '120px', padding: '13px 0 10px', border: 'none', borderBottom: '1px solid #c8c8c8', fontSize: '15px', color: '#1a1a1a', background: 'transparent', outline: 'none', fontFamily: 'inherit' }}
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

                <div>
                    <span style={secLbl}>Zugang zum Befallsort</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                        <Chip label="Leicht zugänglich" active={quiz.zugang === 'leicht'} onClick={() => setQ('zugang', 'leicht')} />
                        <Chip label="Schwer zugänglich" active={quiz.zugang === 'schwer'} onClick={() => setQ('zugang', 'schwer')} />
                    </div>
                </div>

                <button
                    type="button"
                    disabled={!quizComplete}
                    onClick={() => {
                        if (!pest) return;
                        if (pest.id === 'kombination') {
                            setPrice(calcComboPrice(kombiSelected.map(k => k.id), quiz));
                        } else {
                            setPrice(calcPrice(pest.id, quiz));
                        }
                        setStep('result');
                    }}
                    style={{
                        width: '100%', backgroundColor: quizComplete ? '#C8102E' : '#e5e7eb',
                        color: quizComplete ? '#fff' : '#9ca3af',
                        padding: '15px', fontWeight: 700, fontSize: '13px',
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        border: 'none', cursor: quizComplete ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                        transition: 'background 0.2s',
                    }}
                >
                    Preis berechnen →
                </button>
            </div>
            </div>
        </div>
    );

    /* ── Step 3: result ── */
    if (step === 'result' && price) return (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '2px solid var(--wiz-border)', boxShadow: '0 12px 48px rgba(0,0,0,0.12)', width: '100%', overflow: 'hidden' }}>
            <div style={{ maxWidth: '560px', margin: '0 auto', padding: '28px 20px 32px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#C8102E', textTransform: 'uppercase', marginBottom: '8px' }}>Ihre Preisschätzung</p>

                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2rem,6vw,3rem)', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                    {pest?.name}-Bekämpfung
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '36px' }}>Ungefähre Kosten basierend auf Ihren Angaben</p>

                {/* Price display */}
                <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '36px 32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(200,16,46,0.15)' }} />
                    <p style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '12px' }}>Geschätzte Gesamtkosten</p>
                    <div style={{ fontSize: 'clamp(2.4rem,8vw,4rem)', fontWeight: 900, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                        {price.min}€ – {price.max}€
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>inkl. Anfahrt, Material & Nachkontrolle</p>

                    {/* Breakdown bars */}
                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                        {[
                            { label: 'Grundbehandlung', width: '60%' },
                            { label: 'Flächenzuschlag', width: quiz.flaeche === '> 100 m²' ? '35%' : quiz.flaeche === '50–100 m²' ? '25%' : '15%' },
                            { label: 'Befallszuschlag', width: quiz.befall === 'Stark' ? '40%' : quiz.befall === 'Mittel' ? '25%' : '10%' },
                        ].map(item => (
                            <div key={item.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                                    <span>{item.label}</span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                    <div style={{ height: '100%', width: item.width, background: '#C8102E', borderRadius: '2px', transition: 'width 0.8s ease' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '28px' }}>
                    * Dies ist eine unverbindliche Schätzung. Der genaue Preis wird nach einer kostenlosen Vor-Ort-Inspektion durch unseren Experten festgelegt.
                </p>

                {/* CTA buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        type="button"
                        onClick={() => { onClose(); window.dispatchEvent(new Event('open-quiz-modal')); }}
                        className="btn-color-hover"
                        style={{ width: '100%', backgroundColor: '#C8102E', color: '#fff', padding: '16px', fontWeight: 700, fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                        Jetzt kostenloses Angebot anfordern
                    </button>
                    <button
                        type="button"
                        onClick={() => { setStep(1); setQuiz(QUIZ_INIT); setPest(null); setPrice(null); }}
                        style={{ width: '100%', background: 'none', border: '1px solid #e5e7eb', color: '#64748b', padding: '13px', fontWeight: 600, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                        Neu berechnen
                    </button>
                </div>
            </div>
        </div>
    );

    return null;
}

/* ─── Modal wrapper ─── */
export default function PriceCalculator({ open, onClose }: { open: boolean; onClose: () => void }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <>
            <style>{`
                @keyframes pc-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes pc-card-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .pc-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.60); z-index: 99999; animation: pc-backdrop-in 0.18s ease forwards; }
                .pc-scroll  { position: absolute; inset: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; display: flex; align-items: flex-start; justify-content: center; padding: 60px 16px; }
                
                .pc-card { 
                    background: transparent; 
                    width: 100%; 
                    max-width: 860px; 
                    position: relative; 
                    animation: pc-card-in 0.22s ease forwards; 
                    flex-shrink: 0;
                }

                .pc-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 30px; height: 30px;
                    border: 1px solid #edf0f4;
                    background: #fff;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: #64748b;
                    z-index: 10;
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    transition: transform 0.1s, background 0.15s;
                }
                .pc-close:active {
                    transform: scale(0.9);
                    background: #f8fafc;
                }

                @media (min-width: 640px) { 
                    .pc-scroll { padding: 80px 16px; }
                    .pc-close { top: 20px; right: 20px; width: 32px; height: 32px; }
                }
            `}</style>

            <div className="pc-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
                <div className="pc-scroll" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
                    <div className="pc-card" ref={cardRef}>
                        {/* Close button */}
                        <button
                            className="pc-close"
                            onClick={onClose}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <PriceWizard onClose={onClose} />
                    </div>
                </div>
            </div>
        </>
    );
}
