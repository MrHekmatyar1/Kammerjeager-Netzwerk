'use client';

// ClientLayout — wraps all client-side globals: header, modals, cookie banner
// Клиентская обёртка — хедер, модальные окна и баннер согласия

import Header from '@/components/layout/Header';
import QuizModal from '@/components/interactive/QuizModal';
import AuthModal from '@/components/auth/AuthModal';
import CookieBanner from '@/components/analytics/CookieBanner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />

            {/* Page content / Контент страницы */}
            <main style={{ paddingTop: '70px' }}>
                {children}
            </main>

            {/* Global quiz modal, opened from anywhere via custom event */}
            {/* Глобальная модалка квиза — открывается через событие из любого места */}
            <QuizModal />
            <AuthModal />

            {/* GDPR cookie consent banner — shown once, stored in localStorage */}
            <CookieBanner />
        </>
    );
}
