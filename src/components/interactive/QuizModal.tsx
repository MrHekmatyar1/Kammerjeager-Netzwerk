'use client';

// Modal overlay that shows the quiz — opened via custom window event
// Модальное окно с квизом — открывается через кастомное событие 'open-quiz-modal'

import { useEffect, useState, useCallback, useRef } from 'react';
import LeadWizard from './LeadWizard';

export default function QuizModal() {
    const [open, setOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const openModal  = useCallback(() => setOpen(true),  []);
    const closeModal = useCallback(() => setOpen(false), []);

    useEffect(() => {
        window.addEventListener('open-quiz-modal', openModal);
        return () => window.removeEventListener('open-quiz-modal', openModal);
    }, [openModal]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
        document.addEventListener('keydown', onKey);
        // Lock body scroll
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, closeModal]);

    if (!open) return null;

    return (
        <>
            <style>{`
                @keyframes quiz-backdrop-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes quiz-card-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* Outer fixed overlay — just a dark background, NO overflow/scroll */
                .qm-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.60);
                    z-index: 99999;
                    animation: quiz-backdrop-in 0.18s ease forwards;
                    /* NO overflow here — this fixes Android touch blocking */
                }

                /* Scrollable wrapper INSIDE the overlay */
                .qm-scroll {
                    position: absolute;
                    inset: 0;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 60px 12px 60px;
                    box-sizing: border-box;
                }

                /* The white card */
                .qm-card {
                    background: transparent;
                    width: 100%;
                    max-width: 860px;
                    flex-shrink: 0;
                    animation: quiz-card-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    position: relative;
                    z-index: 1;
                }

                .qm-close {
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
                .qm-close:active {
                    transform: scale(0.9);
                    background: #f8fafc;
                }

                .qm-body {
                    padding: 0;
                }

                @media (min-width: 600px) {
                    .qm-scroll { padding: 60px 16px; }
                    .qm-close { top: 20px; right: 20px; width: 32px; height: 32px; }
                }
            `}</style>

            {/* Dark overlay — click on it to close */}
            <div
                className="qm-overlay"
                onTouchEnd={(e) => {
                    if (e.target === e.currentTarget) closeModal();
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeModal();
                }}
            >
                {/* Scrollable inner wrapper */}
                <div className="qm-scroll" ref={cardRef}>

                    {/* White card — stops propagation so overlay doesn't close */}
                    <div
                        className="qm-card"
                        onClick={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        <button
                            className="qm-close"
                            onClick={closeModal}
                            onTouchEnd={(e) => { e.stopPropagation(); closeModal(); }}
                            aria-label="Schließen"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Quiz content */}
                        <div className="qm-body">
                            <LeadWizard onSuccess={closeModal} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
