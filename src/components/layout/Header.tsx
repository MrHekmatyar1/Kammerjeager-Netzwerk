'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PESTS = [
    'Wespen', 'Bettwanzen', 'Ratten', 'Mäuse',
    'Schaben', 'Ameisen', 'Motten', 'Flöhe',
    'Tauben', 'Fliegen', 'Käfer', 'Andere',
];

const MENUS: Record<string, { title: string; description: string; links: string[]; cta: string }> = {
    Privatkunden: {
        title: 'Für Privatkunden',
        description: 'Professionelle Schädlingsbekämpfung für Ihr Zuhause.',
        links: PESTS,
        cta: 'Alle Schädlinge ansehen',
    },
    Geschäftskunden: {
        title: 'Für Geschäftskunden',
        description: 'Maßgeschneiderte Lösungen für Unternehmen, Gastronomie und Industrie.',
        links: ['Gastronomie & Hotels', 'Büros & Gebäude', 'Lager & Industrie', 'Einzelhandel', 'Öffentliche Einrichtungen'],
        cta: 'Mehr erfahren',
    },
    'Über uns': {
        title: 'Über uns',
        description: 'Wir vermitteln geprüfte Kammerjäger in ganz Deutschland.',
        links: ['Unser Team', 'Unsere Mission', 'Qualitätsstandards', 'Für Schädlingsbekämpfer', 'Kontakt'],
        cta: 'Kontakt aufnehmen',
    },
};

export default function Header() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [atTop, setAtTop] = useState(true);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onScroll = () => setAtTop(window.scrollY < 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleEnter = (key: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setActiveMenu(key);
    };

    const handleLeave = () => {
        closeTimer.current = setTimeout(() => setActiveMenu(null), 100);
    };

    return (
        <>
            {/* Backdrop — накрывает Hero когда дропдаун открыт */}
            <div
                onClick={() => setActiveMenu(null)}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    zIndex: 9998,
                    opacity: activeMenu ? 1 : 0,
                    pointerEvents: activeMenu ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease',
                }}
            />

            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, backgroundColor: 'white', borderBottom: atTop && !activeMenu ? '2px solid #C8102E' : '1px solid #f1f5f9' }}>
            {/* Main bar */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>

                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
                    <Image src="/logo_k.png" alt="Kammerjäger Netzwerk" width={44} height={44} style={{ objectFit: 'contain' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                        <span style={{ fontWeight: 900, fontSize: '19px', color: '#1E293B', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Kammerjäger</span>
                        <span style={{ fontWeight: 700, fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Netzwerk</span>
                    </div>
                </Link>

                {/* Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', height: '68px' }}>
                    {Object.keys(MENUS).map((key) => (
                        <div
                            key={key}
                            onMouseEnter={() => { handleEnter(key); setHoveredMenu(key); }}
                            onMouseLeave={() => { handleLeave(); setHoveredMenu(null); }}
                            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                        >
                            {/* Geschäftskunden — ссылка на отдельную страницу в нашем стиле */}
                            {key === 'Geschäftskunden' ? (
                                <Link href="/geschaeftskunden" style={{
                                    display: 'flex', alignItems: 'center', height: '100%',
                                    padding: '0 18px',
                                    fontSize: '15px', fontWeight: 500,
                                    color: hoveredMenu === key ? '#C8102E' : '#475569',
                                    borderBottom: hoveredMenu === key ? '3px solid #C8102E' : '3px solid transparent',
                                    transition: 'color 0.15s, border-color 0.15s',
                                    whiteSpace: 'nowrap', textDecoration: 'none',
                                }}>
                                    {key}
                                </Link>
                            ) : (
                                <button style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '0 18px', height: '100%',
                                    fontSize: '15px', fontWeight: 500,
                                    color: hoveredMenu === key ? '#C8102E' : '#475569',
                                    borderBottom: hoveredMenu === key ? '3px solid #C8102E' : '3px solid transparent',
                                    transition: 'color 0.15s, border-color 0.15s',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {key}
                                </button>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <a href="tel:03046690747" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 500, color: '#C8102E', textDecoration: 'none' }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Kontakt
                    </a>
                    <a href="tel:03046690747" style={{ border: '1.5px solid #C8102E', borderRadius: '999px', padding: '7px 18px', fontSize: '14px', fontWeight: 700, color: '#C8102E', textDecoration: 'none', backgroundColor: 'white', whiteSpace: 'nowrap' }}>
                        030 46690747
                    </a>
                    <Link href="#" style={{ backgroundColor: '#C8102E', color: 'white', borderRadius: '999px', padding: '9px 22px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(200,16,46,0.25)' }}>
                        Termin buchen
                    </Link>
                </div>
            </div>

            {/* Dropdown panel */}
            <div
                onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
                onMouseLeave={handleLeave}
                style={{
                    position: 'absolute', top: '68px', left: 0, right: 0,
                    backgroundColor: 'white',
                    borderTop: '2px solid #C8102E',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.10)',
                    overflow: 'hidden',
                    maxHeight: activeMenu ? '400px' : '0px',
                    opacity: activeMenu ? 1 : 0,
                    transition: 'max-height 0.22s ease, opacity 0.15s ease',
                    pointerEvents: activeMenu ? 'auto' : 'none',
                }}
            >
                {activeMenu && MENUS[activeMenu] && (
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 32px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '48px' }}>

                        {/* Left: Title + description + CTA */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                                {MENUS[activeMenu].title}
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                                {MENUS[activeMenu].description}
                            </p>
                            <Link href="#" style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: '#C8102E', textDecoration: 'none' }}>
                                {MENUS[activeMenu].cta} →
                            </Link>
                        </div>

                        {/* Right: Links grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px 24px' }}>
                            {MENUS[activeMenu].links.map((link) => (
                                <Link
                                    key={link}
                                    href="#"
                                    style={{ fontSize: '14px', color: '#374151', textDecoration: 'none', fontWeight: 500, padding: '4px 0', borderBottom: '1px solid transparent', transition: 'color 0.1s' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#C8102E')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                                >
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
        </>
    );
}
