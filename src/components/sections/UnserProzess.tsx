'use client';

import React from 'react';
import { Barlow_Condensed } from 'next/font/google';

const barlowCondensed = Barlow_Condensed({
    subsets: ['latin'],
    weight: ['700'],
    display: 'swap',
});

const steps = [
    {
        number: '01',
        title: 'Kostenlose Anfrage',
        description:
            'Schildern Sie uns Ihr Problem – ganz einfach online oder telefonisch. Wir kümmern uns sofort und finden den passenden geprüften Kammerjäger in Ihrer Nähe.',
    },
    {
        number: '02',
        title: 'Termin & Inspektion',
        description:
            'Ein zertifizierter Experte kommt zu Ihnen, analysiert den Befall sorgfältig und erklärt Ihnen transparent, was zu tun ist – bevor irgendetwas unternommen wird.',
    },
    {
        number: '03',
        title: 'Sichere Bekämpfung & Ergebnis',
        description:
            'Der Fachmann beseitigt den Befall mit zugelassenen, umweltschonenden Mitteln. Sie erhalten eine vollständige Dokumentation aller Maßnahmen – und können sich wieder sicher fühlen.',
    },
];

export default function UnserProzess() {
    return (
        <section className="unser-prozess-section">
            <div className="unser-prozess-inner">
                {/* Header */}
                <div className="unser-prozess-header">
                    <p className="unser-prozess-label">UNSER PROZESS</p>
                    <h2 className="unser-prozess-title">
                        So einfach funktioniert&nbsp;es.
                    </h2>
                    <p className="unser-prozess-subtitle">
                        Von der Anfrage bis zur erfolgreichen, rechtssicheren Schädlingsbekämpfung –
                        transparent und professionell.
                    </p>
                </div>

                {/* Steps grid — always 3 columns */}
                <div className="unser-prozess-grid">
                    {steps.map((step) => (
                        <div key={step.number} className="unser-prozess-card">
                            <span className={`unser-prozess-number ${barlowCondensed.className}`}>
                                {step.number}
                            </span>
                            <div className="unser-prozess-divider" />
                            <h3 className="unser-prozess-step-title">{step.title}</h3>
                            <p className="unser-prozess-step-desc">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .unser-prozess-section {
                    width: 100%;
                    background: #f2f2f2;
                    padding: 72px 24px 88px;
                }

                .unser-prozess-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ── Header ── */
                .unser-prozess-header {
                    max-width: 600px;
                    margin-bottom: 56px;
                }

                .unser-prozess-label {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    color: #c8102e;
                    text-transform: uppercase;
                    margin-bottom: 14px;
                }

                .unser-prozess-title {
                    font-size: clamp(1.8rem, 3.5vw, 2.75rem);
                    font-weight: 900;
                    line-height: 1.05;
                    color: #1a1a1a;
                    margin-bottom: 18px;
                    letter-spacing: -0.02em;
                }

                .unser-prozess-subtitle {
                    font-size: 0.97rem;
                    line-height: 1.65;
                    color: #666;
                    max-width: 500px;
                }

                /* ── Grid — always 3 columns ── */
                .unser-prozess-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0 48px;
                }

                @media (max-width: 780px) {
                    .unser-prozess-grid {
                        grid-template-columns: 1fr;
                        gap: 40px 0;
                    }
                }

                /* ── Card ── */
                .unser-prozess-card {
                    display: flex;
                    flex-direction: column;
                }

                /* Lighter weight (700) condensed numbers like Orkin */
                .unser-prozess-number {
                    font-size: clamp(3.2rem, 5vw, 5rem);
                    font-weight: 700;
                    color: #c8102e;
                    line-height: 1;
                    letter-spacing: -0.01em;
                }

                .unser-prozess-divider {
                    width: 32px;
                    height: 3px;
                    background: #c8102e;
                    margin: 14px 0 18px;
                    border-radius: 2px;
                }

                .unser-prozess-step-title {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: #1a1a1a;
                    margin-bottom: 12px;
                    line-height: 1.3;
                    letter-spacing: -0.01em;
                }

                .unser-prozess-step-desc {
                    font-size: 0.93rem;
                    line-height: 1.7;
                    color: #555;
                }
            `}</style>
        </section>
    );
}
