'use client';

import Link from 'next/link';
import React from 'react';

const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '210px',
    height: '42px',
    boxSizing: 'border-box',
    fontWeight: 700,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textDecoration: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
};

export default function NotFound() {
    return (
        <div
            className="min-h-[calc(100dvh-70px)] bg-white flex flex-col items-center justify-center px-6 text-center"
        >
            {/* 404 number above text - kept as is */}
            <p
                style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(5rem, 16vw, 9rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: '#e2e8f0',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.03em',
                    marginBottom: '8px',
                    userSelect: 'none',
                }}
            >
                404
            </p>

            <h1
                style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
                    fontWeight: 900,
                    color: '#1E293B',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                    marginBottom: '10px',
                }}
            >
                Seite nicht gefunden
            </h1>

            <p
                style={{
                    fontSize: '14px',
                    color: '#64748b',
                    textAlign: 'center',
                    maxWidth: '380px',
                    lineHeight: 1.55,
                    marginBottom: '26px',
                }}
            >
                Die gesuchte Seite existiert leider nicht oder wurde verschoben.
                Kein Problem — wir helfen Ihnen weiter.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                <Link
                    href="/"
                    className="btn-color-hover"
                    style={{
                        ...btnStyle,
                        backgroundColor: '#C8102E',
                        color: '#fff',
                        border: '2px solid #C8102E',
                    }}
                >
                    &larr; Zur Startseite
                </Link>

                <a
                    href="tel:016092376320"
                    style={{
                        ...btnStyle,
                        backgroundColor: '#fff',
                        color: '#C8102E',
                        border: '2px solid #C8102E',
                    }}
                >
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    0160 92376320
                </a>
            </div>
        </div>
    );
}
