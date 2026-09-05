'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[calc(100dvh-70px)] flex flex-col items-center justify-center px-4 py-8 bg-[#F8FAFC]">
            <div className="w-full max-w-md mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center">
                {/* 404 Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[#C8102E] font-bold text-xs uppercase tracking-wider mb-5">
                    <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"></span>
                    Fehler 404
                </div>

                {/* Icon graphic */}
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#C8102E] mb-5 shadow-inner">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Main Heading */}
                <h1
                    className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight mb-2"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                    Seite nicht gefunden
                </h1>

                {/* Explanation text */}
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mb-6">
                    Die gewünschte Seite existiert leider nicht, wurde verschoben oder die Webadresse ist nicht korrekt.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C8102E] btn-color-hover text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md shadow-red-100 transition-all text-center"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Zur Startseite
                    </Link>

                    <a
                        href="tel:016092376320"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all text-center"
                    >
                        <svg className="w-4 h-4 text-[#C8102E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        0160 92376320
                    </a>
                </div>

                {/* Helpful quick navigation */}
                <div className="mt-7 pt-5 border-t border-slate-100 w-full text-center">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2.5">
                        Häufig gesucht:
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Link href="/geschaeftskunden" className="text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                            Gewerbe &amp; B2B
                        </Link>
                        <Link href="/berlin" className="text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                            Berlin
                        </Link>
                        <Link href="/hamburg" className="text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                            Hamburg
                        </Link>
                        <Link href="/muenchen" className="text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                            München
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
