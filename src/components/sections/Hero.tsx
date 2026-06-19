'use client';

// Hero section — animated headline and CTA button
// Главный экран — анимированный заголовок и кнопка

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PriceCalculator from '../interactive/PriceCalculator';

// Configuration: rotating words in the headline
// Конфигурация: сменяемые слова в заголовке
const ROTATING_WORDS = [
    'Wespen', 'Ratten', 'Mäusen', 'Schaben',
    'Ameisen', 'Flöhen', 'Bettwanzen', 'Tauben',
];

export default function Hero({ cityName }: { cityName?: string }) {
    const [wordIndex, setWordIndex] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [calcOpen, setCalcOpen] = useState(false);

    // Word rotation interval logic
    // Логика переключения слов с интервалом
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
            {/* Animation keyframes for word transitions / Кадры анимации для смены слов */}
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
            `}</style>

            <section
                className="w-full flex justify-center border-b border-gray-100 -mt-[70px] pt-[150px] md:pt-[170px] pb-[200px] md:pb-[450px] mb-0 md:-mb-[250px] px-5 relative overflow-hidden"
            >
                {/* Background image layers / Фоновые слои */}
                
                {/* Base Sky Background (Desktop & Mobile) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image 
                        src="/header-bg4.png" 
                        alt="Background Sky" 
                        fill 
                        priority 
                        className="object-cover object-top"
                    />
                </div>

                {/* Mobile Background: Corner Leaves */}
                <div className="md:hidden absolute inset-0 z-0 pointer-events-none">
                    {/* Top-Left Leaves */}
                    <div className="absolute inset-0" style={{ 
                        maskImage: 'radial-gradient(circle at top left, black 0%, transparent 45%)',
                        WebkitMaskImage: 'radial-gradient(circle at top left, black 0%, transparent 45%)',
                        filter: 'blur(3px) brightness(1.1)',
                    }}>
                        <Image 
                            src="/header-bg4.png" 
                            alt="" 
                            fill 
                            priority
                            className="object-cover" 
                            style={{ objectPosition: '-200px top' }} 
                        />
                    </div>
                    
                    {/* Bottom-Right Leaves */}
                    <div className="absolute inset-0" style={{ 
                        maskImage: 'radial-gradient(circle at bottom right, black 0%, transparent 45%)',
                        WebkitMaskImage: 'radial-gradient(circle at bottom right, black 0%, transparent 45%)',
                        filter: 'blur(3px) brightness(1.1)',
                    }}>
                        <Image 
                            src="/header-bg4.png" 
                            alt="" 
                            fill 
                            priority
                            className="object-cover" 
                            style={{ objectPosition: 'calc(100% + 150px) bottom' }} 
                        />
                    </div>
                </div>

                {/* Overlay gradients and blur effects / Градиентные наложения и размытия */}

                {/* Bottom White Fade (Seamless transition to next section) */}
                <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent from-0% via-transparent via-40% to-white to-100%" />

                {/* Soft white blur behind text to improve readability */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0" style={{
                    background: 'radial-gradient(circle at 30% center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)',
                }} />

                {/* Main content block / Основной блок контента */}
                <div className="w-full max-w-[1200px] relative z-10">

                    <h1 className="text-4xl md:text-8xl font-black text-[#1E293B] leading-[1.0] uppercase tracking-tight max-w-[900px] mb-7 font-['Barlow_Condensed',_sans-serif]">
                        <span className="block">Ihr Kammerjäger{cityName ? ` in ${cityName}` : '.'}</span>
                        <span className="block">Der Beste Experte</span>
                        <span className="block">für ganz</span>
                        <span className="block text-[#C8102E] overflow-hidden leading-[1.05]">
                            <span key={animKey} className={`inline-block ${isExiting ? 'hero-word-exit' : 'hero-word-enter'}`}>
                                {ROTATING_WORDS[wordIndex]}.
                            </span>
                        </span>
                    </h1>

                    <p className="text-xl text-gray-500 max-w-xl font-medium mb-10 leading-relaxed">
                        Vermeiden Sie lange Recherchen. Wir finden für Sie den qualifizierten Experten für jedes Schädlingsproblem.
                    </p>

                    <div className="flex flex-row items-center gap-4 flex-wrap">
                        <button
                            onClick={() => setCalcOpen(true)}
                            className="bg-[#C8102E] text-white rounded-none font-black shadow-xl shadow-red-100 uppercase whitespace-nowrap inline-flex items-center justify-center text-[14px] px-[42px] py-[16px] leading-none cursor-pointer border-none"
                        >
                            Preis berechnen
                        </button>

                        {/* Customer Trust Badges */}
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-center">
                                <div className="font-black text-2xl text-[#1E293B]">24/7</div>
                                <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Service</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <PriceCalculator open={calcOpen} onClose={() => setCalcOpen(false)} />
        </>
    );
}
