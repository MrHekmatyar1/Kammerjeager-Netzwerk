// GoogleAnalytics — injects GA4 tracking scripts into <head>
// Внедряет скрипты Google Analytics 4 в <head>
// Usage: set NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX in .env.local

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
    // Do not render anything if the GA ID is not configured
    // Не рендерим ничего, если ID не задан
    if (!GA_ID) return null;

    return (
        <>
            {/* Load the GA4 gtag.js library */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />

            {/* Initialize dataLayer and configure GA4 */}
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_ID}', {
                        page_path: window.location.pathname,
                        anonymize_ip: true
                    });
                `}
            </Script>
        </>
    );
}
