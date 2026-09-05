'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import React from 'react';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

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

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error('[App Error]', error);
    }, [error]);

    return (
        <div
            className="min-h-[calc(100dvh-70px)] bg-white flex flex-col items-center justify-center px-6 text-center"
        >
            {/* 500 number above text */}
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
                500
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
                Etwas ist schiefgelaufen
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
                Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                <button
                    onClick={reset}
                    className="btn-color-hover"
                    style={{
                        ...btnStyle,
                        backgroundColor: '#C8102E',
                        color: '#fff',
                        border: '2px solid #C8102E',
                    }}
                >
                    Erneut versuchen
                </button>

                <Link
                    href="/"
                    className="btn-color-hover"
                    style={{
                        ...btnStyle,
                        backgroundColor: '#fff',
                        color: '#C8102E',
                        border: '2px solid #C8102E',
                    }}
                >
                    &larr; Zur Startseite
                </Link>
            </div>
        </div>
    );
}
