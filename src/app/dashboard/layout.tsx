'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/');
                setTimeout(() => window.dispatchEvent(new CustomEvent('open-auth-modal')), 500);
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };
        checkUser();
    }, [router, supabase]);

    // Close drawer on route change
    useEffect(() => { setDrawerOpen(false); }, [pathname]);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Lädt...</div>;
    if (!user) return null;

    const navItems = [
        { name: 'Marktplatz', href: '/dashboard' },
        { name: 'Meine Aufträge', href: '/dashboard/orders' },
        { name: 'Einstellungen', href: '/dashboard/settings' },
        { name: 'Abrechnung', href: '/dashboard/billing' },
    ];

    if (user?.email === 'asus017447@gmail.com') {
        navItems.push({ name: '👑 Admin CRM', href: '/admin' });
    }

    const NavItems = () => (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px' }}>
            {navItems.map(item => {
                const active = pathname === item.href;
                return (
                    <Link key={item.name} href={item.href} style={{
                        display: 'block', padding: '12px 14px', borderRadius: '8px',
                        background: active ? 'rgba(200,16,46,0.06)' : 'transparent',
                        color: active ? '#C8102E' : '#475569',
                        fontWeight: active ? 700 : 500,
                        textDecoration: 'none', fontSize: '15px',
                        transition: 'background 0.15s'
                    }}>
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 70px)', background: '#f8fafc' }}>

            {/* ══════════════════════════════
                MOBILE: teardrop toggle button
                Мобильная: кнопка-капля
            ══════════════════════════════ */}
            <div className="md:hidden">
                {/* Teardrop / location-pin button — fixed, top-left below header */}
                <button
                    onClick={() => setDrawerOpen(o => !o)}
                    aria-label="Menü öffnen"
                    style={{
                        position: 'fixed',
                        top: '82px',
                        left: '12px',
                        zIndex: 10002,
                        width: '52px',
                        height: '62px',
                        background: '#1E293B',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // Teardrop shape: round top, pointed bottom
                        borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
                        clipPath: 'polygon(50% 100%, 0% 30%, 0% 0%, 100% 0%, 100% 30%)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                        paddingBottom: '8px',
                    }}
                >
                    {/* Downward chevron / тупой треугольник вниз */}
                    <svg width="22" height="16" viewBox="0 0 22 14" fill="none">
                        <path d="M2 2L11 11L20 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {/* Dark overlay / Затемнение */}
                <div
                    onClick={() => setDrawerOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 10000,
                        opacity: drawerOpen ? 1 : 0,
                        pointerEvents: drawerOpen ? 'auto' : 'none',
                        transition: 'opacity 0.25s',
                    }}
                />

                {/* Left drawer panel / Боковая панель слева */}
                <div style={{
                    position: 'fixed',
                    top: '70px',          // below site header
                    left: 0,
                    bottom: 0,
                    width: '230px',       // narrow, hugs left wall
                    background: '#fff',
                    zIndex: 10001,
                    boxShadow: drawerOpen ? '4px 0 20px rgba(0,0,0,0.15)' : 'none',
                    transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
                    overflowY: 'auto',
                    borderRight: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 0 32px',
                }}>
                    {/* User info / Данные пользователя */}
                    <div style={{ padding: '0 20px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Partner-Portal</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>{user.email}</div>
                    </div>

                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0 20px 16px' }} />

                    <NavItems />

                    {/* Logout / Выход */}
                    <div style={{ marginTop: 'auto', padding: '20px 22px 0' }}>
                        <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} style={{
                            background: 'none', border: 'none', color: '#94a3b8', fontWeight: 500,
                            fontSize: '14px', cursor: 'pointer', padding: 0, fontFamily: 'inherit'
                        }}>
                            Abmelden
                        </button>
                    </div>
                </div>

                {/* Mobile main content / Мобильный контент */}
                <main style={{ padding: '20px 16px 32px' }}>
                    {children}
                </main>
            </div>

            {/* ══════════════════════════════
                DESKTOP: classic sidebar layout
                ПК: классический сайдбар
            ══════════════════════════════ */}
            <div style={{ display: 'flex' }} className="hidden md:flex">
                <aside style={{
                    width: '250px', background: '#fff',
                    borderRight: '1px solid #e2e8f0',
                    padding: '24px 0',
                    minHeight: 'calc(100vh - 70px)',
                    flexShrink: 0,
                }}>
                    <div style={{ padding: '0 24px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Partner-Portal</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>{user.email}</div>
                    </div>
                    <NavItems />
                    <div style={{ padding: '0 24px', marginTop: '40px' }}>
                        <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} style={{
                            background: 'none', border: 'none', color: '#64748b', fontWeight: 500,
                            fontSize: '15px', cursor: 'pointer', padding: 0, fontFamily: 'inherit'
                        }}>
                            Abmelden
                        </button>
                    </div>
                </aside>

                <main style={{ flex: 1, padding: '32px', minWidth: 0 }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
