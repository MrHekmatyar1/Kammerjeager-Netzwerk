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
        <div className="min-h-[calc(100dvh-70px)] flex flex-col items-center justify-center px-4 py-8 bg-[#F8FAFC]">
            <div className="w-full max-w-md mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center">
                {/* 500 Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[#C8102E] font-bold text-xs uppercase tracking-wider mb-5">
                    <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"></span>
                    Fehler 500
                </div>

                {/* Icon graphic */}
                <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#C8102E] mb-5 shadow-inner">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Main Heading */}
                <h1
                    className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight mb-2"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                    Etwas ist schiefgelaufen
                </h1>

                {/* Explanation text */}
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mb-6">
                    Ein unerwarteter Fehler ist aufgetreten. Wir wurden benachrichtigt und arbeiten an einer Lösung.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <button
                        type="button"
                        onClick={reset}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C8102E] btn-color-hover text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md shadow-red-100 transition-all border-none cursor-pointer text-center"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Erneut versuchen
                    </button>

                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all text-center"
                    >
                        Zur Startseite
                    </Link>
                </div>

                {/* Hotline call link */}
                <div className="mt-7 pt-5 border-t border-slate-100 w-full text-center">
                    <span className="text-xs text-slate-400 font-medium block mb-2">
                        Dringende Hilfe benötigt?
                    </span>
                    <a
                        href="tel:016092376320"
                        className="inline-flex items-center gap-2 text-[#C8102E] font-bold text-sm hover:underline"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        0160 92376320 (24/7 Notdienst)
                    </a>
                </div>
            </div>
        </div>
    );
}
