'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// ─── PLZ Setup Modal ──────────────────────────────────────────────────────────
// Shown after Google OAuth when a partner hasn't set their home PLZ yet.
function PlzSetupModal({ onSaved }: { onSaved: () => void }) {
    const [plz, setPlz] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = plz.trim();
        if (!/^\d{5}$/.test(trimmed)) {
            setError('Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const res = await fetch('/api/partner/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_plz: trimmed,
                    billing_model: 'commission',
                    is_active: true,
                    pests_handled: [],
                    firma: '',
                    name: '',
                    telefon: '',
                    telegram_chat_id: '',
                }),
            });
            if (res.ok) {
                onSaved();
            } else {
                const d = await res.json();
                setError(d.error || 'Fehler beim Speichern.');
            }
        } catch {
            setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(15,23,42,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(4px)',
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '400px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            }}>
                {/* Header */}
                <div style={{ background: '#0f172a', padding: '20px 24px' }}>
                    <div style={{
                        fontSize: '10px', color: '#94a3b8', fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px',
                    }}>
                        Kammerjäger Structon · Partner-Portal
                    </div>
                    <div style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '22px', fontWeight: 900,
                        color: '#fff', lineHeight: 1.1, textTransform: 'uppercase',
                    }}>
                        Ihr Einsatzgebiet
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'grid', gap: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                        Um Ihnen passende Aufträge zuzuweisen, benötigen wir Ihre <strong style={{ color: '#0f172a' }}>Heimat-Postleitzahl</strong>.
                        Sie erhalten dann Aufträge im Umkreis von <strong style={{ color: '#0f172a' }}>4 km</strong> davon.
                    </p>

                    <div style={{ display: 'grid', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                            Ihre Postleitzahl (PLZ) <span style={{ color: '#0f172a' }}>*</span>
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="z.B. 10115"
                            value={plz}
                            onChange={e => { setPlz(e.target.value.replace(/\D/g, '')); setError(''); }}
                            autoFocus
                            style={{
                                padding: '10px 14px',
                                border: `1.5px solid ${error ? '#0f172a' : '#d1d5db'}`,
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                outline: 'none',
                                fontFamily: 'inherit',
                                color: '#0f172a',
                                transition: 'border-color 0.15s',
                            }}
                        />
                        {error && (
                            <p style={{ fontSize: '12px', color: '#0f172a', margin: 0, fontWeight: 500 }}>{error}</p>
                        )}
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 14px' }}>
                        <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                            <strong style={{ color: '#0f172a' }}>Info:</strong> Sie können Ihr Einsatzgebiet später in den Einstellungen anpassen.
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving || plz.length !== 5}
                        style={{
                            background: plz.length === 5 && !saving ? '#0f172a' : '#cbd5e1',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: plz.length === 5 && !saving ? 'pointer' : 'not-allowed',
                            fontFamily: "'Barlow Condensed', sans-serif",
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            transition: 'background 0.2s',
                        }}
                    >
                        {saving ? 'Wird gespeichert...' : 'Einsatzgebiet speichern →'}
                    </button>
                </form>
            </div>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [credits, setCredits] = useState(0);
    const [showPlzModal, setShowPlzModal] = useState(false);
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
                const { data: master } = await supabase
                    .from('masters')
                    .select('credits, plz_bereiche')
                    .or(`email.eq.${session.user.email},user_id.eq.${session.user.id}`)
                    .maybeSingle();
                setCredits(master?.credits || 0);
                // Show PLZ modal if no PLZ has been set yet
                const hasPlz = master?.plz_bereiche && master.plz_bereiche.length > 0 && master.plz_bereiche[0]?.trim();
                if (!hasPlz) setShowPlzModal(true);
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

    if (user?.email?.toLowerCase() === 'edorkalchuk@gmail.com') {
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
                        borderBottom: '1px solid #cbd5e1',
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

            {/* PLZ Setup Modal — shown when partner has no PLZ set */}
            {showPlzModal && <PlzSetupModal onSaved={() => setShowPlzModal(false)} />}

            {/* ══════════════════════════════════════
                MOBILE ONLY
            ══════════════════════════════════════ */}
            <div className="md:hidden">

                <button
                    onClick={() => setDrawerOpen(o => !o)}
                    aria-label="Menü"
                    style={{
                        position: 'fixed',
                        top: '68px',
                        left: '20px',
                        zIndex: 9998,
                        width: '44px',
                        height: '38px',
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderTop: 'none',
                        borderRadius: '0 0 22px 22px',
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
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: drawerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>

                <div
                    onClick={() => setDrawerOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.35)',
                        zIndex: 9996,
                        opacity: drawerOpen ? 1 : 0,
                        pointerEvents: drawerOpen ? 'auto' : 'none',
                        transition: 'opacity 0.2s',
                    }}
                />

                <div style={{
                    position: 'fixed',
                    top: '68px',
                    left: 0,
                    width: '240px',
                    zIndex: 9997,
                    background: '#fff',
                    borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    borderRadius: '0 0 16px 0',
                    boxShadow: '4px 8px 24px rgba(0,0,0,0.15)',
                    transform: drawerOpen ? 'translateY(0)' : 'translateY(-120%)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                    <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Partner-Portal</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>{user.email}</div>
                    </div>
                    <div style={{ paddingBottom: '12px' }}>
                        <NavLinks />
                    </div>
                </div>

                <main style={{ padding: '40px 16px 40px' }}>
                    {children}
                </main>
            </div>

            {/* ══════════════════════════════════════
                DESKTOP: classic sidebar layout
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
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-all', marginBottom: '4px' }}>{user.email}</div>
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
