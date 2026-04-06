'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ROTATING_WORDS = [
    'Wespen', 'Ratten', 'Mäusen', 'Schaben',
    'Ameisen', 'Flöhen', 'Bettwanzen', 'Tauben',
];

// ── Ряды тараканов для фона (закомментированы, готовы к включению) ──
interface Bug { size: number; rot: number }

const ROW1: Bug[] = [
    { size: 110, rot: 0 }, { size: 95, rot: 90 }, { size: 120, rot: 0 },
    { size: 100, rot: 0 }, { size: 108, rot: 180 }, { size: 92, rot: 0 },
    { size: 115, rot: 90 }, { size: 105, rot: 0 }, { size: 98, rot: 0 }, { size: 112, rot: 180 },
];
const ROW2: Bug[] = [
    { size: 118, rot: 0 }, { size: 102, rot: 180 }, { size: 128, rot: 0 },
    { size: 95, rot: 0 }, { size: 110, rot: 90 }, { size: 100, rot: 0 },
    { size: 122, rot: 0 }, { size: 96, rot: 180 }, { size: 114, rot: 0 }, { size: 106, rot: 90 },
];
const ROW3: Bug[] = [
    { size: 105, rot: 0 }, { size: 116, rot: 180 }, { size: 94, rot: 0 },
    { size: 124, rot: 90 }, { size: 108, rot: 0 }, { size: 99, rot: 0 },
    { size: 118, rot: 180 }, { size: 103, rot: 0 }, { size: 112, rot: 0 }, { size: 97, rot: 90 },
];

function MarqueeRow({ bugs, duration, reverse = false }: { bugs: Bug[]; duration: number; reverse?: boolean }) {
    const track = [...bugs, ...bugs, ...bugs];
    return (
        <div style={{ overflow: 'hidden', width: '100%' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '72px',
                width: 'max-content',
                animation: `${reverse ? 'roach-rev' : 'roach-fwd'} ${duration}s linear infinite`,
                willChange: 'transform',
            }}>
                {track.map((b, i) => (
                    <div key={i} style={{ flexShrink: 0, width: b.size, height: b.size, position: 'relative', transform: `rotate(${b.rot}deg)` }}>
                        <Image src="/pests/schaben.png" alt="" fill style={{ objectFit: 'contain' }} sizes={`${b.size}px`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Hero() {
    const [wordIndex, setWordIndex] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsExiting(true);
            setTimeout(() => {
                setWordIndex(prev => (prev + 1) % ROTATING_WORDS.length);
                setAnimKey(prev => prev + 1);
                setIsExiting(false);
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <style>{`
                @keyframes slideInFromBottom {
                    from { transform: translateY(110%); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
                @keyframes slideOutToTop {
                    from { transform: translateY(0);     opacity: 1; }
                    to   { transform: translateY(-110%); opacity: 0; }
                }
                .hero-word-enter { animation: slideInFromBottom 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
                .hero-word-exit  { animation: slideOutToTop 0.45s cubic-bezier(0.4, 0, 1, 1) forwards; }
                @keyframes roach-fwd { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
                @keyframes roach-rev { from { transform: translateX(-33.333%); } to { transform: translateX(0); } }
            `}</style>

            <section
                className="w-full flex justify-center border-b border-gray-100"
                style={{ padding: '20px 0 80px', position: 'relative', overflow: 'hidden' }}
            >
                {/*
                ФОН ТАРАКАНОВ — раскомментировать когда нужно:
                <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'space-around',pointerEvents:'none',zIndex:0,opacity:0.35 }}>
                    <MarqueeRow bugs={ROW1} duration={44} />
                    <MarqueeRow bugs={ROW2} duration={56} reverse />
                    <MarqueeRow bugs={ROW3} duration={48} />
                </div>
                */}

                <div className="w-full max-w-[1200px] px-6" style={{ position: 'relative', zIndex: 1 }}>

                    <h1
                        className="text-5xl md:text-8xl font-black text-[#1E293B] leading-[1.0] uppercase tracking-tight"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, maxWidth: '900px', marginBottom: '28px' }}
                    >
                        <span className="block">Ihr Kammerjäger.</span>
                        <span className="block">Der Beste Experte</span>
                        <span className="block">für ganz</span>
                        <span className="block text-[#C8102E]" style={{ overflow: 'hidden', display: 'block', lineHeight: '1.05' }}>
                            <span key={animKey} className={`inline-block ${isExiting ? 'hero-word-exit' : 'hero-word-enter'}`}>
                                {ROTATING_WORDS[wordIndex]}.
                            </span>
                        </span>
                    </h1>

                    <p className="text-xl text-gray-500 max-w-xl font-medium" style={{ marginBottom: '40px', lineHeight: 1.6 }}>
                        Vermeiden Sie lange Recherchen. Wir finden für Sie den qualifizierten Experten für jedes Schädlingsproblem.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <button
                            className="bg-[#C8102E] text-white rounded-full font-black shadow-xl shadow-red-100 uppercase whitespace-nowrap inline-flex items-center justify-center"
                            style={{ fontSize: '14px', padding: '16px 42px', lineHeight: '1', border: 'none', cursor: 'pointer' }}
                        >
                            Anfrage senden
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                            <div className="text-center">
                                <div className="font-black text-2xl text-[#1E293B]">10.000+</div>
                                <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Kunden</div>
                            </div>
                            <div className="w-px h-10 bg-gray-100" />
                            <div className="text-center">
                                <div className="font-black text-2xl text-[#1E293B]">24/7</div>
                                <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Service</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}
