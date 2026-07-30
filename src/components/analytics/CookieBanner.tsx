'use client';

// CookieBanner — minimalist GDPR consent bar
// Минималистичный баннер согласия GDPR / DSGVO
// Mobile: full-width bottom pill bar
// Desktop: compact bottom-right floating card

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'ks_cookie_consent';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show only if user hasn't already decided
        // Показываем только если пользователь ещё не дал ответ
        if (!localStorage.getItem(STORAGE_KEY)) {
            // Small delay so banner doesn't flash on initial render
            const t = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(t);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem(STORAGE_KEY, 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <>
            {/* ─── MOBILE BANNER ─── */}
            <div
                role="dialog"
                aria-label="Cookie-Einstellungen"
                style={{
                    position: 'fixed',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    zIndex: 99999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    backgroundColor: '#1E293B',
                    borderRadius: '16px',
                    padding: '16px 18px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
                    animation: 'ks-slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                }}
                className="block lg:hidden"
            >
                {/* Icon + text row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>🍪</span>
                    <p style={{
                        fontSize: '13px',
                        color: '#cbd5e1',
                        lineHeight: 1.55,
                        margin: 0,
                        fontFamily: 'inherit',
                    }}>
                        Wir nutzen Cookies für Analyse &amp; bessere UX.{' '}
                        <Link
                            href="/datenschutz"
                            style={{ color: '#f97171', textDecoration: 'underline', fontWeight: 600 }}
                            onClick={decline}
                        >
                            Datenschutz
                        </Link>
                    </p>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={accept}
                        style={{
                            flex: 1,
                            backgroundColor: '#C8102E',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 0',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            letterSpacing: '0.03em',
                        }}
                    >
                        Alle akzeptieren
                    </button>
                    <button
                        onClick={decline}
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            color: '#94a3b8',
                            border: '1px solid #334155',
                            borderRadius: '10px',
                            padding: '10px 0',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Ablehnen
                    </button>
                </div>
            </div>

            {/* ─── DESKTOP BANNER ─── */}
            <div
                role="dialog"
                aria-label="Cookie-Einstellungen"
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 99999,
                    width: '340px',
                    backgroundColor: '#1E293B',
                    borderRadius: '16px',
                    padding: '20px 22px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
                    animation: 'ks-slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}
                className="hidden lg:block"
            >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '18px' }}>🍪</span>
                    <span style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#f1f5f9',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                    }}>
                        Cookie-Hinweis
                    </span>
                </div>

                {/* Text */}
                <p style={{
                    fontSize: '13px',
                    color: '#94a3b8',
                    lineHeight: 1.6,
                    margin: '0 0 16px',
                    fontFamily: 'inherit',
                }}>
                    Wir verwenden Cookies zur Analyse und zur Verbesserung Ihrer Erfahrung.{' '}
                    <Link
                        href="/datenschutz"
                        style={{ color: '#f97171', textDecoration: 'underline' }}
                        onClick={decline}
                    >
                        Datenschutzerklärung
                    </Link>
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={accept}
                        style={{
                            flex: 1,
                            backgroundColor: '#C8102E',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 0',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                            letterSpacing: '0.03em',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#a50d25')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#C8102E')}
                    >
                        Akzeptieren
                    </button>
                    <button
                        onClick={decline}
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            color: '#94a3b8',
                            border: '1px solid #334155',
                            borderRadius: '10px',
                            padding: '10px 0',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'border-color 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#64748b';
                            e.currentTarget.style.color = '#cbd5e1';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#334155';
                            e.currentTarget.style.color = '#94a3b8';
                        }}
                    >
                        Ablehnen
                    </button>
                </div>
            </div>

            {/* Animation keyframes — injected inline via style tag */}
            <style>{`
                @keyframes ks-slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
