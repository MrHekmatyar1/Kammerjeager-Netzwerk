'use client';

// CookieBanner — DSGVO / GDPR consent
// White frosted-glass card, bottom-right, sharp corners matching brand header style

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'ks_cookie_v2';

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
            <div
                role="dialog"
                aria-label="Cookie-Einstellungen"
                className="cookie-banner-root"
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 99999,
                    width: '300px',
                    // White frosted glass — same vibe as the site header
                    background: 'rgba(255, 255, 255, 0.88)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    // Sharp corners matching brand style
                    borderRadius: '0',
                    // Thin border + strong red top accent like header bottom line
                    border: '1px solid rgba(200, 16, 46, 0.15)',
                    borderTop: '2px solid #C8102E',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    padding: '18px 20px 16px',
                    animation: 'ks-slide-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#1E293B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        fontFamily: 'inherit',
                    }}>
                        Cookie-Hinweis
                    </span>
                </div>

                {/* Body */}
                <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    lineHeight: 1.65,
                    margin: '0 0 14px',
                    fontFamily: 'inherit',
                }}>
                    Wir verwenden Cookies zur Analyse und zur
                    Verbesserung Ihrer Erfahrung.{' '}
                    <Link
                        href="/datenschutz"
                        style={{ color: '#C8102E', textDecoration: 'underline', fontWeight: 600 }}
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
                            color: '#94a3b8',
                            border: '1px solid #cbd5e1',
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
                            e.currentTarget.style.borderColor = '#94a3b8';
                            e.currentTarget.style.color = '#475569';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.color = '#94a3b8';
                        }}
                    >
                        Ablehnen
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes ks-slide-in {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
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
