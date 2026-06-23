'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

    // Close sidebar when route changes
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

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

    const SidebarContent = () => (
        <>
            <div style={{ padding: '0 24px', marginBottom: '32px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Partner-Portal</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>{user.email}</div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
                {navItems.map(item => {
                    const active = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} style={{
                            display: 'block', padding: '12px 12px', borderRadius: '8px',
                            background: active ? 'rgba(200,16,46,0.05)' : 'transparent',
                            color: active ? '#C8102E' : '#475569',
                            fontWeight: active ? 700 : 500,
                            textDecoration: 'none', fontSize: '16px'
                        }}>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ padding: '0 24px', marginTop: '40px' }}>
                <button onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/');
                }} style={{
                    background: 'none', border: 'none', color: '#64748b', fontWeight: 500,
                    fontSize: '15px', cursor: 'pointer', padding: 0, fontFamily: 'inherit'
                }}>
                    Abmelden
                </button>
            </div>
        </>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 70px)', background: '#f8fafc' }}>

            {/* ── MOBILE TOP BAR ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', background: '#fff', borderBottom: '1px solid #e2e8f0',
                position: 'sticky', top: '70px', zIndex: 100,
            }}
                className="md:hidden"
            >
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Partner-Portal</span>
                <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        alignItems: 'center', gap: '5px', width: '40px', height: '40px',
                        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%',
                        cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                    }}
                    aria-label="Menü öffnen"
                >
                    <span style={{ display: 'block', width: '16px', height: '1.5px', background: '#1E293B', borderRadius: '2px' }} />
                    <span style={{ display: 'block', width: '16px', height: '1.5px', background: '#1E293B', borderRadius: '2px' }} />
                    <span style={{ display: 'block', width: '16px', height: '1.5px', background: '#1E293B', borderRadius: '2px' }} />
                </button>
            </div>

            {/* ── MOBILE SIDEBAR OVERLAY ── */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                        zIndex: 9998, display: 'block'
                    }}
                    className="md:hidden"
                />
            )}

            {/* ── MOBILE SIDEBAR DRAWER ── */}
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, bottom: 0, width: '280px',
                    background: '#fff', zIndex: 9999, padding: '24px 0',
                    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.14)' : 'none',
                    overflowY: 'auto'
                }}
                className="md:hidden"
            >
                {/* Close button */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        width: '32px', height: '32px', background: '#f1f5f9',
                        border: 'none', borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', color: '#64748b', lineHeight: 1
                    }}
                >
                    ×
                </button>
                <div style={{ paddingTop: '8px' }}>
                    <SidebarContent />
                </div>
            </div>

            {/* ── DESKTOP LAYOUT ── */}
            <div style={{ display: 'flex' }} className="hidden md:flex">
                {/* Desktop Sidebar */}
                <aside style={{ width: '250px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '24px 0', minHeight: 'calc(100vh - 70px)', flexShrink: 0 }}>
                    <SidebarContent />
                </aside>

                {/* Desktop Main Content */}
                <main style={{ flex: 1, padding: '32px', minWidth: 0 }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>

            {/* ── MOBILE MAIN CONTENT ── */}
            <main style={{ padding: '20px 16px' }} className="md:hidden">
                {children}
            </main>
        </div>
    );
}
