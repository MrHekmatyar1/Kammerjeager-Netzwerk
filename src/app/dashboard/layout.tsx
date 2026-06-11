'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/');
                // Open auth modal after redirect
                setTimeout(() => window.dispatchEvent(new CustomEvent('open-auth-modal')), 500);
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };
        checkUser();
    }, [router, supabase]);

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

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '24px 0' }}>
                <div style={{ padding: '0 24px', marginBottom: '32px' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Partner-Portal</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{user.email}</div>
                </div>
                
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
                    {navItems.map(item => {
                        const active = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href} style={{
                                display: 'block', padding: '10px 12px', borderRadius: '8px',
                                background: active ? 'rgba(200,16,46,0.05)' : 'transparent',
                                color: active ? '#C8102E' : '#475569',
                                fontWeight: active ? 700 : 500,
                                textDecoration: 'none', fontSize: '15px'
                            }}>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '0 24px', marginTop: 'auto', paddingTop: '40px' }}>
                    <button onClick={async () => {
                        await supabase.auth.signOut();
                        router.push('/');
                    }} style={{
                        background: 'none', border: 'none', color: '#64748b', fontWeight: 500, fontSize: '15px', cursor: 'pointer', padding: 0, fontFamily: 'inherit'
                    }}>
                        Abmelden
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '32px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
