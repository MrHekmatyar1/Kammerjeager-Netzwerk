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
        { name: 'Neue Aufträge', href: '/dashboard' },
        { name: 'Meine Aufträge', href: '/dashboard/orders' },
        { name: 'Einstellungen', href: '/dashboard/settings' },
        { name: 'Abrechnung', href: '/dashboard/billing' },
    ];

    if (user?.email === 'asus017447@gmail.com') {
        navItems.push({ name: 'Admin CRM', href: '/admin' });
    }

    const NavLinks = () => (
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {navItems.map(item => {
                const active = pathname === item.href;
                return (
                    <Link key={item.name} href={item.href} style={{
                        display: 'block',
                        padding: '13px 20px',
                        color: active ? '#C8102E' : '#475569',
                        fontWeight: active ? 700 : 500,
                        textDecoration: 'none',
                        fontSize: '15px',
                        background: active ? 'rgba(200,16,46,0.08)' : 'transparent',
                        borderBottom: '1px solid #e2e8f0',
                    }}>
                        {item.name}
                    </Link>
                );
            })}
            <button
                onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
                style={{
                    display: 'block', textAlign: 'left', padding: '13px 20px',
                    background: 'none', border: 'none',
                    color: '#94a3b8', fontWeight: 500, fontSize: '14px',
                    cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px',
                }}
            >
                Abmelden
            </button>
        </nav>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 70px)', background: '#f1f5f9' }}>

            {/* ══════════════════════════════════════
                MOBILE ONLY
            ══════════════════════════════════════ */}
            <div className="md:hidden">

                {/* ──────────────────────────────
                    "Tube" button hanging under the header.
                    Header height is 68px.
                ────────────────────────────── */}
                <button
                    onClick={() => setDrawerOpen(o => !o)}
                    aria-label="Menü"
                    style={{
                        position: 'fixed',
                        top: '68px',        // Right below the header
                        left: '20px',       // Align near the logo
                        zIndex: 9998,       // Above the drawer, below header (9999)
                        width: '44px',
                        height: '38px',     // Tube length
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderTop: 'none',  // Seamless with header
                        borderRadius: '0 0 22px 22px', // perfectly rounded bottom
                        cursor: 'pointer',
                        padding: 0,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: '4px',
                        transition: 'opacity 0.2s, background 0.2s',
                        opacity: drawerOpen ? 0 : 1,
                        pointerEvents: drawerOpen ? 'none' : 'auto',
                    }}
                >
                    {/* Downward chevron inside the tube */}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: drawerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>

                {/* ── Overlay ── */}
                <div
                    onClick={() => setDrawerOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.35)',
                        zIndex: 9996,       // Below header (9999) and below drawer
                        opacity: drawerOpen ? 1 : 0,
                        pointerEvents: drawerOpen ? 'auto' : 'none',
                        transition: 'opacity 0.2s',
                    }}
                />

                {/* ── Narrow top-sliding drawer ── */}
                <div style={{
                    position: 'fixed',
                    top: '68px',
                    left: 0,
                    width: '240px',     // narrow panel hugging left wall
                    zIndex: 9997,       // Below tube button (9998)
                    background: '#fff',
                    borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    borderRadius: '0 0 16px 0',
                    boxShadow: '4px 8px 24px rgba(0,0,0,0.15)',
                    transform: drawerOpen ? 'translateY(0)' : 'translateY(-120%)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', // Fast slide from top
                }}>
                    {/* User info */}
                    <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Partner-Portal</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>{user.email}</div>
                    </div>
                    <div style={{ paddingBottom: '12px' }}>
                        <NavLinks />
                    </div>
                </div>

                {/* Mobile content — full width */}
                <main style={{ padding: '40px 16px 40px' }}>
                    {children}
                </main>
            </div>

            {/* ══════════════════════════════════════
                DESKTOP: classic sidebar layout (unchanged)
            ══════════════════════════════════════ */}
            <div className="hidden md:flex">
                <aside style={{
                    width: '250px',
                    background: '#fff',
                    borderRight: '1px solid #cbd5e1',
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
