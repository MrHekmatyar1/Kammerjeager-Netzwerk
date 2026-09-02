'use client';

// Error boundary page — shown when an unhandled runtime error occurs
// Страница ошибки — отображается при необработанном исключении во время выполнения

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        // Log the error for monitoring (replace with your error tracker)
        // Логируем ошибку для мониторинга (замените на свой трекер ошибок)
        console.error('[App Error]', error);
    }, [error]);

    return (
        <div
            className="min-h-screen bg-white flex flex-col items-center justify-center px-6"
            style={{ paddingTop: '68px' }}
        >
            {/* Red accent bar */}
            <div
                style={{
                    width: '80px',
                    height: '4px',
                    backgroundColor: '#C8102E',
                    marginBottom: '40px',
                }}
            />

            {/* Error code display */}
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
                    marginBottom: '16px',
                }}
            >
                Etwas ist schiefgelaufen
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
                Ein unerwarteter Fehler ist aufgetreten. Wir wurden informiert und
                arbeiten bereits an einer Lösung. Bitte versuchen Sie es erneut oder
                kontaktieren Sie uns direkt.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Retry button */}
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
                        padding: '14px 32px',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    ↻ Erneut versuchen
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
                        padding: '12px 28px',
                        textDecoration: 'none',
                    }}
                >
                    ← Zur Startseite
                </Link>
            </div>

            {/* Decorative bug icon */}
            <p style={{ marginTop: '60px', fontSize: '48px', opacity: 0.12, userSelect: 'none' }}>🐛</p>
        </div>
    );
}
