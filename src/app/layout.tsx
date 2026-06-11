'use client';

// Root layout — wraps every page with header and modal
// Корневой шаблон — хедер и модалка доступны везде

import './globals.css';
import Header from '@/components/layout/Header';
import QuizModal from '@/components/interactive/QuizModal';
import AuthModal from '@/components/auth/AuthModal';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <body className="antialiased text-[#212121] bg-[#F8FAFC]">

        <Header />

        {/* Page content / Контент страницы */}
        <main style={{ paddingTop: '70px' }}>
            {children}
        </main>

        {/* Global quiz modal, opened from anywhere via custom event */}
        {/* Глобальная модалка квиза — открывается через событие из любого места */}
        <QuizModal />
        <AuthModal />

        </body>
        </html>
    );
}