'use client';

import Hero from '@/components/sections/Hero';
import ReviewSlider from '@/components/sections/ReviewSlider';
import UnserProzess from '@/components/sections/UnserProzess';
import LeadWizard from '@/components/interactive/LeadWizard';
import Footer from '@/components/layout/Footer';

export default function Home() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <Hero />

            {/* --- REVIEWS SECTION --- */}
            <section className="w-full flex flex-col items-center bg-[#F8FAFC] pt-24 pb-10 px-6">
                <ReviewSlider />
            </section>

            {/* --- UNSER PROZESS SECTION --- */}
            <UnserProzess />

            {/* --- WIZARD SECTION --- */}
            <section className="w-full flex flex-col items-center bg-[#F8FAFC] py-16 px-6">
                <div className="w-full max-w-[850px]">
                    <div className="bg-white rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.06)] border border-gray-100">
                        <div className="px-8 pt-10 pb-14 md:px-14 md:pt-12 md:pb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-[#1E293B] uppercase leading-[0.9] tracking-tighter text-center mb-8">
                                Welcher Schädling <br /> bereitet Probleme?
                            </h2>
                            <div className="w-full border-t border-gray-100 mb-8"></div>
                            <LeadWizard />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <Footer />

        </main>
    );
}