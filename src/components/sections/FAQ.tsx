'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FAQItem = {
    question: string;
    answer: string;
};

// Placeholder FAQs, you can customize these!
const faqs: FAQItem[] = [
    {
        question: "Wie schnell können Sie vor Ort sein?",
        answer: "In Notfällen sind wir in der Regel innerhalb von 24 Stunden bei Ihnen vor Ort. Bei extremem Befall können wir oft auch am selben Tag reagieren, um den Schaden zu minimieren."
    },
    {
        question: "Sind die eingesetzten Mittel gefährlich für Haustiere?",
        answer: "Wir verwenden, wo immer möglich, umweltfreundliche und haustierverträgliche Mittel. Bei bestimmten Behandlungen erhalten Sie von uns genaue Anweisungen, wann die Räume wieder sicher betreten werden können."
    },
    {
        question: "Wie diskret arbeiten Ihre Techniker?",
        answer: "Unsere Techniker kommen in neutralen Fahrzeugen ohne auffällige Werbung. Wir legen größten Wert auf Diskretion, um Ihren Ruf bei Nachbarn oder Kunden zu schützen."
    },
    {
        question: "Bieten Sie auch regelmäßige Kontrollen für Unternehmen an?",
        answer: "Ja, wir bieten maßgeschneiderte Präventionsverträge für Unternehmen an, die regelmäßige Inspektionen und Monitorings umfassen, um einen Befall von vornherein zu verhindern."
    },
    {
        question: "Muss ich während der Behandlung das Haus verlassen?",
        answer: "Das hängt von der Art des Befalls und den eingesetzten Mitteln ab. Bei vielen Behandlungen können Sie im Haus bleiben, bei bestimmten Begasungen müssen die Räume für einige Stunden geräumt werden."
    },
    {
        question: "Was kostet ein Kammerjäger-Einsatz?",
        answer: "Die Kosten variieren je nach Art und Schwere des Befalls. Wir bieten transparente Festpreise nach einer ersten Analyse an. Zögern Sie nicht, uns für ein unverbindliches Angebot zu kontaktieren."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Split FAQs into two columns for desktop
    const mid = Math.ceil(faqs.length / 2);
    const leftFaqs = faqs.slice(0, mid);
    const rightFaqs = faqs.slice(mid);

    return (
        <section className="bg-[#1a1a1a] text-white py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black mb-10 tracking-tight">Häufig gestellte Fragen</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                    
                    {/* Left Column */}
                    <div className="flex flex-col">
                        {leftFaqs.map((faq, idx) => {
                            const actualIdx = idx;
                            const isOpen = openIndex === actualIdx;
                            return (
                                <div key={actualIdx} className="mb-4">
                                    <button 
                                        onClick={() => toggleOpen(actualIdx)}
                                        className={`w-full flex items-center justify-between text-left py-4 px-2 md:px-4 transition-all duration-200 
                                            ${isOpen ? 'border border-white/40' : 'border-b border-white/20 hover:border-white/50'}`}
                                    >
                                        <span className="font-semibold text-sm md:text-base pr-4">{faq.question}</span>
                                        <motion.div 
                                            animate={{ rotate: isOpen ? 180 : 0 }} 
                                            transition={{ duration: 0.2 }}
                                            className="shrink-0"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 pt-4 pb-6 text-white/70 text-sm md:text-base leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col">
                        {rightFaqs.map((faq, idx) => {
                            const actualIdx = idx + mid;
                            const isOpen = openIndex === actualIdx;
                            return (
                                <div key={actualIdx} className="mb-4">
                                    <button 
                                        onClick={() => toggleOpen(actualIdx)}
                                        className={`w-full flex items-center justify-between text-left py-4 px-2 md:px-4 transition-all duration-200 
                                            ${isOpen ? 'border border-white/40' : 'border-b border-white/20 hover:border-white/50'}`}
                                    >
                                        <span className="font-semibold text-sm md:text-base pr-4">{faq.question}</span>
                                        <motion.div 
                                            animate={{ rotate: isOpen ? 180 : 0 }} 
                                            transition={{ duration: 0.2 }}
                                            className="shrink-0"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 pt-4 pb-6 text-white/70 text-sm md:text-base leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
