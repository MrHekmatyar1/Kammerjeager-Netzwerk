'use client';

// ==========================================
// [EN] HOMEPAGE - Main Entry Point
// [RU] ГЛАВНАЯ СТРАНИЦА - Основная точка входа
// ==========================================
// This component assembles all the sections of the landing page in order.
// Этот компонент собирает все секции лендинга по порядку.
// ==========================================

import Hero from '@/components/sections/Hero';
import ReviewSlider from '@/components/sections/ReviewSlider';
import UnserProzess from '@/components/sections/UnserProzess';
import LeadWizard from '@/components/interactive/LeadWizard';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/interactive/ChatBot';

export default function Home() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">

            {/* ==========================================
                [EN] HERO SECTION
                [RU] ГЛАВНЫЙ ЭКРАН
                ==========================================
                Contains the large animated headline, background image, and call-to-action.
                Содержит большой анимированный заголовок, фоновую картинку и кнопку призыва к действию. */}
            <Hero />

            {/* ==========================================
                [EN] 'HOW IT WORKS' PROCESS
                [RU] ПРОЦЕСС 'КАК ЭТО РАБОТАЕТ'
                ==========================================
                Explains the 3 simple steps of the pest control process.
                Объясняет 3 простых шага процесса борьбы с вредителями. */}
            <UnserProzess />

            {/* ==========================================
                [EN] PEST SELECTOR QUIZ (LEAD WIZARD)
                [RU] КВИЗ ВЫБОРА ВРЕДИТЕЛЯ (ЛИД-ФОРМА)
                ==========================================
                Interactive multi-step form to collect customer leads.
                Интерактивная многошаговая форма для сбора заявок клиентов. */}
            <section className="w-full flex flex-col items-center px-6 pt-[128px] pb-[200px]" style={{ background: '#f1f4f8' }}>
                <div className="w-full max-w-[850px]">
                    <LeadWizard />
                </div>
            </section>

            {/* ==========================================
                [EN] REVIEWS SLIDER
                [RU] СЛАЙДЕР ОТЗЫВОВ
                ==========================================
                Displays customer feedback in an auto-playing carousel.
                Отображает отзывы клиентов в автоматически прокручивающейся карусели. */}
            <section className="w-full bg-[#F8FAFC] border-t border-gray-100 pt-[80px] pb-[96px]">
                <ReviewSlider />
            </section>

            {/* ==========================================
                [EN] FOOTER
                [RU] ПОДВАЛ САЙТА
                ========================================== */}
            <Footer />

            {/* ==========================================
                [EN] FLOATING CHAT WIDGET
                [RU] ПЛАВАЮЩИЙ ВИДЖЕТ ЧАТА
                ========================================== */}
            <ChatBot />

        </main>
    );
}