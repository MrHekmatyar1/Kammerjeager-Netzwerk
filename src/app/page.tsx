'use client';

import Hero from '@/components/sections/Hero';
import ReviewSlider from '@/components/sections/ReviewSlider';
import UnserProzess from '@/components/sections/UnserProzess';
import LeadWizard from '@/components/interactive/LeadWizard';
import Footer from '@/components/layout/Footer';

export default function Home() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">

            {/* ── Hero ── */}
            <Hero />

            {/* ── Как это работает ── */}
            <UnserProzess />

            {/* ── Выбор вредителя ── */}
            <section className="w-full flex flex-col items-center bg-white px-6" style={{ paddingTop: '128px', paddingBottom: '200px' }}>
                <div className="w-full max-w-[850px]">
                    <div className="bg-[#F8FAFC] rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.05)] border border-gray-100">
                        <div className="px-8 pt-10 pb-14 md:px-14 md:pt-12 md:pb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-[#1E293B] uppercase leading-[0.9] tracking-tighter text-center mb-8"
                                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                Welcher Schädling <br /> bereitet Probleme?
                            </h2>
                            <div className="w-full border-t border-gray-100 mb-8" />
                            <LeadWizard />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Отзывы — под выбором вредителя ── */}
            <section className="w-full bg-[#F8FAFC] border-t border-gray-100" style={{ paddingTop: '80px', paddingBottom: '32px' }}>
                <ReviewSlider />
            </section>


            {/* ── Footer ── */}
            <Footer />

        </main>
    );
}