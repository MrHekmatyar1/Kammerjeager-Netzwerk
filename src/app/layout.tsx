'use client';

import './globals.css';
import Header from '@/components/layout/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <body className="antialiased text-[#212121] bg-[#F8FAFC]">

        <Header />

        {/* Контент страницы */}
        <main style={{ paddingTop: '80px' }}>
            {children}
        </main>

        </body>
        </html>
    );
}