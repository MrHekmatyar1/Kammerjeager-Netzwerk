// Root layout — Server Component so Next.js can read and inject metadata into <head>
// Корневой шаблон — серверный компонент, чтобы Next.js мог экспортировать метаданные в <head>

import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { Analytics } from '@vercel/analytics/next';

const SITE_URL = 'https://kammerjaeger-structon.de';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Kammerjäger Structon – Schädlingsbekämpfung in ganz Deutschland',
        template: '%s | Kammerjäger Structon',
    },
    description:
        'Professionelle und diskrete Schädlingsbekämpfung – 24/7 Notdienst für Wespen, Ratten, Bettwanzen und mehr. Kostenlose Vermittlung an zertifizierte Kammerjäger in Ihrer Nähe.',
    keywords: [
        'Kammerjäger', 'Schädlingsbekämpfung', 'Schädlingsbekämpfer', 'Wespen entfernen',
        'Ratten bekämpfen', 'Bettwanzen', 'Mäuse', 'Notdienst',
    ],
    authors: [{ name: 'Kammerjäger Structon', url: SITE_URL }],
    creator: 'Kammerjäger Structon',
    openGraph: {
        type: 'website',
        locale: 'de_DE',
        url: SITE_URL,
        siteName: 'Kammerjäger Structon',
        title: 'Kammerjäger Structon – Schnelle Schädlingsbekämpfung',
        description:
            'Professionelle und diskrete Schädlingsbekämpfung deutschlandweit. 24/7 Notdienst – kostenlose Vermittlung.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Kammerjäger Structon – Schädlingsbekämpfung',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kammerjäger Structon – Schädlingsbekämpfung',
        description:
            'Professionelle und diskrete Schädlingsbekämpfung deutschlandweit. 24/7 Notdienst.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: SITE_URL,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <body className="antialiased text-[#212121] bg-[#F8FAFC]">
            {/* Google Analytics — lädt nur wenn Tracking-ID gesetzt ist */}
            <GoogleAnalytics />
            <ClientLayout>{children}</ClientLayout>
            <Analytics />
        </body>
        </html>
    );
}