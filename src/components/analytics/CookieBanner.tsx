'use client';

// CookieBanner — DSGVO / GDPR consent
// Single floating card, bottom-right corner, sharp angular corners matching brand style

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'ks_cookie_consent';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            const t = setTimeout(() => setVisible(true), 900);
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
            {/* Single unified banner — bottom-right on desktop, full-width bottom on mobile */}
            <div
                role="dialog"
                aria-label="Cookie-Einstellungen"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    left: 'auto',
                    zIndex: 99999,
                    width: '320px',
                    backgroundColor: '#1E293B',
                    borderRadius: '0',                          // острые углы как у бренда
                    padding: '20px 22px 18px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
                    borderLeft: '3px solid #C8102E',            // акцентная полоса бренда
                    animation: 'ks-slide-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
                }}
                // Mobile: stretch full-width at bottom
                className="cookie-banner-root"
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#C8102E',
                        flexShrink: 0,
                    }} />
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#f1f5f9',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        fontFamily: 'inherit',
                    }}>
                        Cookie-Hinweis
                    </span>
                </div>

                {/* Body text */}
                <p style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    lineHeight: 1.65,
                    margin: '0 0 16px',
                    fontFamily: 'inherit',
                }}>
                    Wir verwenden Cookies zur Analyse und zur
                    Verbesserung Ihrer Erfahrung.{' '}
                    <Link
                        href="/datenschutz"
                        style={{ color: '#f97171', textDecoration: 'underline', fontWeight: 600 }}
                        onClick={decline}
                    >
                        Datenschutzerklärung
                    </Link>
                </p>

                {/* Buttons — sharp corners, brand style */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={accept}
                        style={{
                            flex: 1,
                            backgroundColor: '#C8102E',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0',
                            padding: '9px 0',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            transition: 'background 0.15s',
                            fontFamily: 'inherit',
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
                            color: '#64748b',
                            border: '1px solid #334155',
                            borderRadius: '0',
                            padding: '9px 0',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            transition: 'border-color 0.15s, color 0.15s',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#64748b';
                            e.currentTarget.style.color = '#cbd5e1';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#334155';
                            e.currentTarget.style.color = '#64748b';
                        }}
                    >
                        Ablehnen
                    </button>
                </div>
            </div>

            {/* Responsive + animation styles */}
            <style>{`
                @keyframes ks-slide-in {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                /* Mobile: full-width, no right offset */
                @media (max-width: 640px) {
                    .cookie-banner-root {
                        left: 12px !important;
                        right: 12px !important;
                        bottom: 12px !important;
                        width: auto !important;
                    }
                }
            `}</style>
        </>
    );
}
