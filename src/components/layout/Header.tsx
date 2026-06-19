'use client';

// Header — Main Navigation Bar
// Шапка — главная навигационная панель
// Desktop: hover mega-menu dropdowns. Mobile: hamburger menu. Scroll: transparency effect.
// ПК: выпадающие мега-меню. Мобильные: бургер. Скролл: прозрачность.

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// Configuration: navigation menus and pest list
// Конфигурация: меню навигации и список вредителей
const PESTS = [
    'Wespen', 'Bettwanzen', 'Ratten', 'Mäuse',
    'Schaben', 'Ameisen', 'Motten', 'Flöhe',
    'Tauben', 'Fliegen', 'Käfer', 'Andere',
];

const MENUS: Record<string, { title: string; description: string; links: string[]; cta: string; href: string }> = {
    Privatkunden: {
        title: 'Für Privatkunden',
        description: 'Professionelle Schädlingsbekämpfung für Ihr Zuhause.',
        links: PESTS,
        cta: 'Alle Schädlinge ansehen',
        href: '/',
    },
    Geschäftskunden: {
        title: 'Für Geschäftskunden',
        description: 'Maßgeschneiderte Lösungen für Unternehmen, Gastronomie und Industrie.',
        links: ['Gastronomie & Hotels', 'Büros & Gebäude', 'Lager & Industrie', 'Einzelhandel', 'Öffentliche Einrichtungen'],
        cta: 'Mehr erfahren',
        href: '/geschaeftskunden',
    },
    'Über uns': {
        title: 'Über uns',
        description: 'Wir vermitteln geprüfte Kammerjäger in ganz Deutschland.',
        links: ['Unser Team', 'Unsere Mission', 'Qualitätsstandards', 'Für Schädlingsbekämpfer', 'Kontakt'],
        cta: 'Kontakt aufnehmen',
        href: '/ueber-uns',
    },
};

const NAV_LINKS = [
    { label: 'Privatkunden', href: '/' },
    { label: 'Geschäftskunden', href: '/geschaeftskunden' },
    { label: 'Über uns', href: '/ueber-uns' },
];

export default function Header() {
    // State: active menus, scroll position, mobile menu, auth user
    // Состояние: активные меню, позиция скролла, мобильное меню, авторизованный пользователь
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [atTop, setAtTop] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Auth state
    const [user, setUser] = useState<User | null>(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setProfileMenuOpen(false);
    };

    // Event listeners: scroll position and touch detection
    // Слушатели событий: позиция скролла и определение касания
    useEffect(() => {
        const onScroll = () => setAtTop(window.scrollY < 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onTouch = () => {
            setIsTouch(true);
            setActiveMenu(null);
        };
        window.addEventListener('touchstart', onTouch, { once: true, passive: true });
        return () => window.removeEventListener('touchstart', onTouch);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setActiveMenu(null);
    }, []);

    const handleEnter = (key: string) => {
        if (isTouch) return;
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setActiveMenu(key);
    };

    const handleLeave = () => {
        if (isTouch) return;
        closeTimer.current = setTimeout(() => setActiveMenu(null), 100);
    };

    const isSolid = atTop || activeMenu || hoveredMenu;

    return (
        <>
            {/* Backdrop overlay for desktop dropdown / Затемнение за выпадающим меню на ПК */}
            {!isTouch && (
                <div
                    onClick={() => setActiveMenu(null)}
                    className={`fixed inset-0 bg-black/45 z-[9997] transition-opacity duration-200 ${
                        activeMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                />
            )}

            {/* Main header container / Главный контейнер шапки */}
            <header className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
                isSolid 
                    ? 'bg-white shadow-none' 
                    : 'bg-white/45 backdrop-blur-[8px] shadow-[0_4px_30px_rgba(0,0,0,0.05)]'
            }`}
            style={{
                borderBottom: (isSolid && !mobileOpen) ? '2px solid #C8102E' : '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                
                <div className="max-w-[1280px] mx-auto px-5 h-[68px] flex items-center justify-between gap-4">
                    
                    {/* Brand logo / Логотип */}
                    <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
                        <Image 
                            src="/logo_k.png" 
                            alt="Kammerjäger Structon" 
                            width={44} 
                            height={44} 
                            className="object-contain [clip-path:circle(31%_at_50%_50%)]" 
                        />
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-[19px] text-[#1E293B] tracking-[-0.03em] uppercase">Kammerjäger</span>
                            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-[0.18em]">Structon</span>
                        </div>
                    </Link>

                    {/* Desktop navigation / Навигация для ПК */}
                    <nav className="hidden lg:flex items-center h-[68px]">
                        {Object.keys(MENUS).map((key) => (
                            <div
                                key={key}
                                onMouseEnter={() => { handleEnter(key); setHoveredMenu(key); }}
                                onMouseLeave={() => { handleLeave(); setHoveredMenu(null); }}
                                className="relative h-full flex items-center"
                            >
                                <Link
                                    href={MENUS[key]!.href}
                                    className={`flex items-center h-full px-[18px] text-[15px] font-medium whitespace-nowrap transition-colors border-b-[3px] duration-150 ${
                                        hoveredMenu === key 
                                            ? 'text-[#C8102E] border-[#C8102E]' 
                                            : 'text-slate-600 border-transparent'
                                    }`}
                                >
                                    {key}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    {/* Desktop action buttons: phone & booking / Кнопки на ПК: звонок и бронь */}
                    <div className="hidden lg:flex items-center gap-3 shrink-0">
                        <a href="tel:016092376320" className="flex items-center gap-1.5 text-[15px] font-medium text-[#C8102E] no-underline">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Kontakt
                        </a>
                        <a href="tel:016092376320" className="px-[18px] py-[7px] text-[15px] font-bold text-[#C8102E] whitespace-nowrap">
                            0160 92376320
                        </a>
                        
                        <div className="relative">
                            {user ? (
                                <button
                                    onClick={() => setProfileMenuOpen(prev => !prev)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 cursor-pointer p-0"
                                    aria-label="Profile"
                                >
                                    {user.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-slate-600 font-bold uppercase text-[15px]">{user.email?.charAt(0)}</span>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer border-none"
                                    aria-label="Account"
                                >
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>
                            )}

                            {/* Profile Dropdown */}
                            {profileMenuOpen && user && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                                        <div className="text-[13px] text-slate-500">Angemeldet als</div>
                                        <div className="text-[14px] font-bold text-slate-800 truncate">{user.email}</div>
                                    </div>
                                    <Link href="/dashboard" onClick={() => setProfileMenuOpen(false)} className="block px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-[#C8102E] transition-colors">
                                        Mein Konto
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-[#C8102E] transition-colors border-none bg-transparent cursor-pointer">
                                        Abmelden
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-quiz-modal'))}
                            className="bg-[#C8102E] text-white px-[22px] py-[9px] text-[14px] font-bold whitespace-nowrap shadow-[0_4px_14px_rgba(200,16,46,0.25)] rounded-none cursor-pointer"
                        >
                            Online Termin buchen
                        </button>
                    </div>

                    {/* Mobile action buttons: phone & hamburger / Кнопки на мобильных: звонок и бургер */}
                    <div className="flex lg:hidden items-center gap-2">
                        {user ? (
                            <button
                                onClick={() => setProfileMenuOpen(prev => !prev)}
                                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 cursor-pointer p-0"
                            >
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-slate-600 font-bold uppercase text-[15px]">{user.email?.charAt(0)}</span>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 border-none"
                                aria-label="Account"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                        )}
                        <a href="tel:016092376320" className="flex items-center justify-center w-10 h-10 text-[#C8102E]" aria-label="Anrufen">
                            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </a>
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border-none cursor-pointer p-2 relative"
                            aria-label="Menü öffnen"
                        >
                            <span className={`block absolute w-[22px] h-[2px] transition-all duration-300 ${mobileOpen ? 'bg-[#C8102E] rotate-45' : 'bg-[#1E293B] -translate-y-[7px]'}`} />
                            <span className={`block absolute w-[22px] h-[2px] transition-opacity duration-300 ${mobileOpen ? 'opacity-0 bg-[#C8102E]' : 'opacity-100 bg-[#1E293B]'}`} />
                            <span className={`block absolute w-[22px] h-[2px] transition-all duration-300 ${mobileOpen ? 'bg-[#C8102E] -rotate-45' : 'bg-[#1E293B] translate-y-[7px]'}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown menu / Выпадающее меню для мобильных */}
                <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out bg-white ${
                    mobileOpen ? 'max-h-[400px] border-t border-slate-100' : 'max-h-0 border-none'
                }`}>
                    <div className="px-5 pt-4 pb-6 flex flex-col">
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-[14px] text-[17px] font-semibold text-[#1E293B] border-b border-slate-100"
                            >
                                {label}
                            </Link>
                        ))}
                        {user && (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className="block py-[14px] text-[17px] font-semibold text-[#1E293B] border-b border-slate-100"
                                >
                                    Mein Konto
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        handleLogout();
                                    }}
                                    className="block w-full text-left py-[14px] text-[17px] font-semibold text-[#C8102E] border-b border-slate-100 bg-transparent"
                                >
                                    Abmelden
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => {
                                setMobileOpen(false);
                                window.dispatchEvent(new CustomEvent('open-quiz-modal'));
                            }}
                            className="mt-4 w-full bg-[#C8102E] text-white p-[14px] text-[15px] font-bold uppercase tracking-[0.05em]"
                        >
                            Online Termin buchen
                        </button>
                        <a href="tel:016092376320" className="mt-2.5 block text-center text-[16px] font-bold text-[#C8102E] py-2.5">
                            📞 0160 92376320
                        </a>
                    </div>
                </div>

                {/* Desktop mega-menu dropdown / Мега-меню для ПК */}
                {!isTouch && (
                    <div
                        onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
                        onMouseLeave={handleLeave}
                        className={`absolute top-[68px] left-0 right-0 bg-white border-t-2 border-[#C8102E] shadow-[0_20px_40px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-200 z-[9998] ${
                            activeMenu ? 'max-h-[400px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}
                    >
                        {activeMenu && MENUS[activeMenu] && (
                            <div className="max-w-[1280px] mx-auto py-9 px-8 grid grid-cols-[280px_1fr] gap-12">
                                <div className="flex flex-col gap-3">
                                    <h3 className="m-0 text-[20px] font-black text-[#1E293B] uppercase tracking-[-0.02em]">
                                        {MENUS[activeMenu].title}
                                    </h3>
                                    <p className="m-0 text-[14px] text-slate-500 leading-[1.6]">
                                        {MENUS[activeMenu].description}
                                    </p>
                                    <Link href={MENUS[activeMenu].href} className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#C8102E]">
                                        {MENUS[activeMenu].cta} →
                                    </Link>
                                </div>
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-y-2 gap-x-6">
                                    {MENUS[activeMenu].links.map((link) => (
                                        <Link
                                            key={link}
                                            href="#"
                                            className="text-[14px] text-slate-700 font-medium py-1 transition-colors hover:text-[#C8102E]"
                                        >
                                            {link}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </header>
        </>
    );
}
