import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

export default function UeberUnsPage() {
    return (
        <>
            <Header />

            <main style={{ paddingTop: '100px' }} className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">
                <section className="w-full flex justify-center py-16 px-6">
                    <div className="w-full max-w-[1200px] text-[#374151]">
                        <h1 
                            className="text-5xl md:text-6xl font-black mb-16 text-[#1E293B] uppercase tracking-tight"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                            Über uns
                        </h1>

                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            {/* Text Left */}
                            <div className="flex-1 space-y-6 text-[17px] leading-relaxed text-[#475569]">
                                <p className="font-bold text-[#1E293B] text-xl mb-4">
                                    Kammerjäger Structon – Ihr zuverlässiger Partner in der Schädlingsbekämpfung.
                                </p>
                                <p>
                                    Wir bieten professionelle, diskrete und rechtssichere Hilfe gegen Schädlinge aller Art in ganz Deutschland. 
                                    Egal ob in privaten Haushalten, in der Gastronomie oder im industriellen Gewerbe – wir finden die passende und effektivste Lösung für Ihr Problem.
                                </p>
                                <p>
                                    Als Geschäftsführer stehe ich, Yehor Kalchuk, mit meinem Namen für höchste Qualitätsstandards, 
                                    schnelle Reaktionszeiten und transparente Preise ohne versteckte Kosten. 
                                    Ihre Sicherheit und eine saubere, schädlingsfreie Umgebung stehen für uns an absolut erster Stelle.
                                </p>
                                <div className="pt-6 border-t border-gray-100 mt-8">
                                    <p className="font-black text-[#1E293B] text-2xl uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                        YEHOR KALCHUK
                                    </p>
                                    <p className="text-[13px] text-[#C8102E] font-extrabold uppercase tracking-widest mt-1">
                                        Geschäftsführer
                                    </p>
                                </div>
                            </div>

                            {/* Image Right */}
                            <div className="flex-1 w-full bg-[#f8fafc] flex items-center justify-center relative rounded-none overflow-hidden shadow-2xl border border-gray-100 p-8">
                                <Image 
                                    src="/images/founder.png" 
                                    alt="Yehor Kalchuk - Geschäftsführer Kammerjäger Structon" 
                                    width={800} 
                                    height={600} 
                                    className="object-contain w-full h-auto"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
