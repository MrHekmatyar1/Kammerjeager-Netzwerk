// Homepage — main landing page entry point (Server Component for SEO metadata)
// Главная страница — серверный компонент для экспорта SEO-метаданных

import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import ReviewSlider from '@/components/sections/ReviewSlider';
import UnserProzess from '@/components/sections/UnserProzess';
import LeadWizard from '@/components/interactive/LeadWizard';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/interactive/ChatBot';

export const metadata: Metadata = {
    title: 'Kammerjäger Structon – Schädlingsbekämpfung in ganz Deutschland',
    description:
        'Professionelle und diskrete Schädlingsbekämpfung – 24/7 Notdienst für Wespen, Ratten, Bettwanzen und mehr. Kostenlose Vermittlung an zertifizierte Kammerjäger in Ihrer Nähe.',
    alternates: {
        canonical: 'https://kammerjaeger-structon.de',
    },
};

export default function Home() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">

            {/* Hero section: animated headline, background image, CTA
                Главный экран: заголовок, фон и кнопка призыва к действию */}
            <Hero />

            {/* How it works: 3-step process / Как это работает: 3 шага процесса */}
            <UnserProzess />

            {/* Lead wizard: interactive multi-step form to collect leads
                Лид-форма: интерактивный многошаговый опрос */}
            <section id="anfrage" className="w-full flex flex-col items-center px-6 pt-[128px] pb-[200px]" style={{ background: '#f1f4f8' }}>
                <div className="w-full max-w-[850px]">
                    <LeadWizard />
                </div>
            </section>


            {/* Reviews slider: auto-playing customer feedback carousel
                Слайдер отзывов: автоматическая карусель */}
            <section className="w-full bg-[#F8FAFC] border-t border-gray-100 pt-[80px] pb-[96px]">
                <ReviewSlider />
            </section>

            {/* Footer / Подвал сайта */}
            <Footer />

            {/* Floating chat widget / Плавающий виджет чата */}
            <ChatBot />

        </main>
    );
}