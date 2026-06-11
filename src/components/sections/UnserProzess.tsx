'use client';

// ==========================================
// [EN] 'HOW IT WORKS' SECTION
// [RU] СЕКЦИЯ 'КАК ЭТО РАБОТАЕТ'
// ==========================================
// Displays the 3-step process of the service.
// Отображает 3-шаговый процесс предоставления услуги.
// ==========================================

import React from 'react';
import { Barlow_Condensed } from 'next/font/google';

const barlowCondensed = Barlow_Condensed({
    subsets: ['latin'],
    weight: ['700'],
    display: 'swap',
});

// ==========================================
// [EN] STEPS DATA
// [RU] ДАННЫЕ ШАГОВ
// ==========================================
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
        <section className="w-full bg-transparent pt-[100px] px-6 pb-[120px] relative z-10">
            <div className="max-w-[1200px] mx-auto">
                
                {/* ==========================================
                    [EN] SECTION HEADER
                    [RU] ЗАГОЛОВОК СЕКЦИИ
                    ========================================== */}
                <div className="max-w-[600px] mb-14">
                    <p className="text-[11px] font-bold tracking-[0.14em] text-[#c8102e] uppercase mb-3.5">
                        UNSER PROZESS
                    </p>
                    <h2 className="text-[clamp(1.8rem,3.5vw,2.75rem)] font-black leading-[1.05] text-[#1a1a1a] mb-[18px] tracking-[-0.02em]">
                        So einfach funktioniert&nbsp;es.
                    </h2>
                    <p className="text-[0.97rem] leading-[1.65] text-[#666] max-w-[500px]">
                        Von der Anfrage bis zur erfolgreichen, rechtssicheren Schädlingsbekämpfung –
                        transparent und professionell.
                    </p>
                </div>

                {/* ==========================================
                    [EN] STEPS GRID (3 Columns Desktop, 1 Column Mobile)
                    [RU] СЕТКА ШАГОВ (3 колонки на ПК, 1 колонка на мобильном)
                    ========================================== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0 md:gap-x-12">
                    {steps.map((step) => (
                        <div key={step.number} className="flex flex-col">
                            {/* Step Number (Barlow Condensed Font) */}
                            <span className={`text-[clamp(3.2rem,5vw,5rem)] font-bold text-[#c8102e] leading-none tracking-[-0.01em] ${barlowCondensed.className}`}>
                                {step.number}
                            </span>
                            
                            {/* Red Divider Line */}
                            <div className="w-8 h-[3px] bg-[#c8102e] mt-3.5 mb-[18px] rounded-sm" />
                            
                            {/* Step Title & Description */}
                            <h3 className="text-[1.1rem] font-extrabold text-[#1a1a1a] mb-3 leading-[1.3] tracking-[-0.01em]">
                                {step.title}
                            </h3>
                            <p className="text-[0.93rem] leading-[1.7] text-[#555]">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
