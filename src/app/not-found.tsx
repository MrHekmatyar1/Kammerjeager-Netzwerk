'use client';

// 404 Not Found page — shown when a route doesn't match
// Страница 404 — отображается, когда маршрут не найден

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div
            className="min-h-screen bg-white flex flex-col items-center justify-center px-6"
            style={{ paddingTop: '68px' }}
        >
            {/* Animated red accent bar */}
            <div
                style={{
                    width: mounted ? '80px' : '0px',
                    height: '4px',
                    backgroundColor: '#C8102E',
                    marginBottom: '40px',
                    transition: 'width 0.6s ease',
                }}
            />

            {/* 404 number */}
            <p
                style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(6rem, 20vw, 12rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: '#f1f4f8',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.04em',
                    marginBottom: '-24px',
                    userSelect: 'none',
                }}
            >
                404
            </p>

            <h1
                style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                    fontWeight: 900,
                    color: '#1E293B',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                    marginBottom: '16px',
                }}
            >
                Seite nicht gefunden
            </h1>

            <p
                style={{
                    fontSize: '17px',
                    color: '#64748b',
                    textAlign: 'center',
                    maxWidth: '440px',
                    lineHeight: 1.6,
                    marginBottom: '40px',
                }}
            >
                Die gesuchte Seite existiert leider nicht oder wurde verschoben.
                Kein Problem — wir helfen Ihnen weiter.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link
                    href="/"
                    className="btn-color-hover"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#C8102E',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '14px 32px',
                        textDecoration: 'none',
                    }}
                >
                    ← Zur Startseite
                </Link>

                <a
                    href="tel:016092376320"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '2px solid #C8102E',
                        color: '#C8102E',
                        fontWeight: 700,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '12px 28px',
                        textDecoration: 'none',
                    }}
                >
                    📞 0160 92376320
                </a>
            </div>

            {/* Decorative bug icon */}
            <p style={{ marginTop: '60px', fontSize: '48px', opacity: 0.12, userSelect: 'none' }}>🪲</p>
        </div>
    );
}
