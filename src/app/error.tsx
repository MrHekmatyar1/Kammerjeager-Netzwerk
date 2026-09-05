'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

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
                    fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                    fontWeight: 900,
                    color: '#1E293B',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                    marginBottom: '14px',
                }}
            >
                Etwas ist schiefgelaufen
            </h1>

            <p
                style={{
                    fontSize: '16px',
                    color: '#64748b',
                    textAlign: 'center',
                    maxWidth: '440px',
                    lineHeight: 1.6,
                    marginBottom: '32px',
                }}
            >
                Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={reset}
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
                        padding: '14px 28px',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Erneut versuchen
                </button>

                <Link
                    href="/"
                    className="btn-color-hover"
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
                        padding: '12px 24px',
                        textDecoration: 'none',
                    }}
                >
                    &larr; Zur Startseite
                </Link>
            </div>
        </div>
    );
}
