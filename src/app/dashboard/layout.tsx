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

    const NavLinks = () => (
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {navItems.map(item => {
                const active = pathname === item.href;
                return (
                    <Link key={item.name} href={item.href} style={{
                        display: 'block',
                        padding: '14px 24px',
                        color: active ? '#C8102E' : '#475569',
                        fontWeight: active ? 700 : 500,
                        textDecoration: 'none',
                        fontSize: '16px',
                        background: active ? 'rgba(200,16,46,0.05)' : 'transparent',
                        borderBottom: '1px solid #f1f5f9',
                    }}>
                        {item.name}
                    </Link>
                );
            })}
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} style={{
                display: 'block', textAlign: 'left', padding: '14px 24px',
                background: 'none', border: 'none', borderTop: '1px solid #f1f5f9',
                color: '#94a3b8', fontWeight: 500, fontSize: '15px',
                cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px',
            }}>
                Abmelden
            </button>
        </nav>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 70px)', background: '#f8fafc' }}>

            {/* ══════════════════════════
                MOBILE ONLY
            ══════════════════════════ */}
            <div className="md:hidden">

                {/* ── Pin-drop button (white, teardrop shape) ── */}
                <button
                    onClick={() => setDrawerOpen(o => !o)}
                    aria-label="Menü"
                    style={{
                        position: 'fixed',
                        top: '78px',
                        left: '14px',
                        zIndex: 10010,
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        width: '52px',
                        height: '64px',
                    }}
                >
                    {/* Teardrop / location-pin SVG shape */}
                    <svg viewBox="0 0 52 64" width="52" height="64"
                        style={{ position: 'absolute', top: 0, left: 0, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}>
                        <path
                            d="M26 2 C14.4 2 5 11.4 5 23 C5 39 26 62 26 62 C26 62 47 39 47 23 C47 11.4 37.6 2 26 2 Z"
                            fill="white"
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                        />
                    </svg>
                    {/* Downward blunt chevron inside the pin */}
                    <svg viewBox="0 0 24 16" width="22" height="14"
                        style={{ position: 'absolute', top: '13px', left: '15px' }}
                        fill="none">
                        <path d="M2 3L12 12L22 3" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* ── Dark overlay ── */}
                <div
                    onClick={() => setDrawerOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 10007,
                        opacity: drawerOpen ? 1 : 0,
                        pointerEvents: drawerOpen ? 'auto' : 'none',
                        transition: 'opacity 0.2s',
                    }}
                />

                {/* ── Top-sliding drawer panel ── */}
                <div style={{
                    position: 'fixed',
                    top: '70px',   // right below the site header
                    left: 0,
                    right: 0,
                    zIndex: 10008,
                    background: '#fff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                    borderBottom: '1px solid #e2e8f0',
                    transform: drawerOpen ? 'translateY(0)' : 'translateY(-110%)',
                    transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)',
                }}>
                    {/* User info row */}
                    <div style={{ padding: '16px 24px 12px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Partner-Portal</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>{user.email}</div>
                    </div>
                    <NavLinks />
                </div>

                {/* Mobile main content — full width, no sidebar */}
                <main style={{ padding: '24px 16px 40px' }}>
                    {children}
                </main>
            </div>

            {/* ══════════════════════════
                DESKTOP: sidebar + content
            ══════════════════════════ */}
            <div style={{ display: 'flex' }} className="hidden md:flex">
                <aside style={{
                    width: '250px',
                    background: '#fff',
                    borderRight: '1px solid #e2e8f0',
                    padding: '24px 0',
                    minHeight: 'calc(100vh - 70px)',
                    flexShrink: 0,
                }}>
                    <div style={{ padding: '0 24px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Partner-Portal</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>{user.email}</div>
                    </div>
                    <NavLinks />
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
