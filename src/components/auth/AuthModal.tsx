'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type AuthState = 'select' | 'login' | 'register';

export default function AuthModal() {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<AuthState>('select');
    const [role, setRole] = useState<'kunden' | 'partner' | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            }
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        const onOpen = () => {
            setOpen(true);
            setView('select');
            setRole(null);
            setEmail('');
            setPassword('');
            setError('');
            setSuccess(false);
        };
        window.addEventListener('open-auth-modal', onOpen);
        return () => window.removeEventListener('open-auth-modal', onOpen);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    return (
        <>
            <style>{`
                @keyframes am-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes am-card-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .am-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.60); z-index: 99999; animation: am-backdrop-in 0.18s ease forwards; }
                .am-scroll  { position: absolute; inset: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; display: flex; align-items: center; justify-content: center; padding: 16px; }
                
                .am-card { 
                    background: #fff; 
                    width: 100%; 
                    max-width: 440px; 
                    position: relative; 
                    animation: am-card-in 0.22s ease forwards; 
                    flex-shrink: 0;
                    border-radius: 20px;
                    border: 2px solid #f0f0f0;
                    box-shadow: 0 12px 48px rgba(0,0,0,0.12);
                }

                .am-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 30px; height: 30px;
                    border: 1px solid #edf0f4;
                    background: #fff;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: #64748b;
                    z-index: 10;
                    transition: transform 0.1s, background 0.15s;
                }
                .am-close:active {
                    transform: scale(0.9);
                    background: #f8fafc;
                }
                
                .am-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #94a3b8;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    border-radius: 8px;
                    font-size: 15px;
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .am-input:focus {
                    border-color: #C8102E;
                    box-shadow: 0 0 0 3px rgba(200,16,46,0.1);
                }

                @media (min-width: 640px) { 
                    .am-close { top: 20px; right: 20px; width: 32px; height: 32px; }
                }
            `}</style>

            <div className="am-overlay" onClick={e => { if (e.target === e.currentTarget && !loading) setOpen(false); }}>
                <div className="am-scroll" onClick={e => { if (e.target === e.currentTarget && !loading) setOpen(false); }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
                        {/* Peeking Roach - Right Side */}
                        <img
                            src="/pests/roach_runner.png"
                            alt="Roach"
                            style={{
                                position: 'absolute',
                                top: '40%',
                                right: '-45px',
                                width: '90px',
                                height: 'auto',
                                zIndex: 0,
                                transform: 'translateY(-50%) rotate(75deg)'
                            }}
                        />
                        {/* (Bottom Left Roach moved to Kammerjäger button) */}
                        <div className="am-card" ref={cardRef} style={{ position: 'relative', zIndex: 10 }}>
                            <button className="am-close" onClick={() => !loading && setOpen(false)} disabled={loading}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>

                            <div style={{ padding: '36px 24px' }}>
                                {view !== 'select' && (
                                    <button
                                        onClick={() => setView('select')}
                                        disabled={loading}
                                        style={{
                                            position: 'absolute', top: '16px', left: '16px',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            fontSize: '13px', fontWeight: 600, color: '#64748b',
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        ← Zurück
                                    </button>
                                )}

                                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#C8102E', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>
                                    {view === 'select' ? 'Login & Registrierung' : role === 'partner' ? 'Für Partner' : 'Für Kunden'}
                                </p>
                                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.6rem,5vw,2.2rem)', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', textAlign: 'center', marginBottom: '6px', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
                                    {view === 'select' ? 'Mein Konto' : view === 'login' ? 'Anmelden' : 'Registrieren'}
                                </h2>
                                <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '32px' }}>
                                    {view === 'select' ? 'Bitte wählen Sie Ihren Kontotyp aus' : 'Geben Sie Ihre Daten ein'}
                                </p>

                                {view === 'select' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {/* Client Button */}
                                        <button
                                            onClick={() => { setRole('kunden'); setView('login'); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '16px',
                                                width: '100%', padding: '16px',
                                                background: '#fff', border: '1px solid #94a3b8',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                borderRadius: '12px', cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                textAlign: 'left'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.background = '#fdf7f8'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#fff'; }}
                                        >
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(200,16,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8102E' }}>
                                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>Für Kunden</div>
                                                <div style={{ fontSize: '13px', color: '#64748b' }}>Aufträge einsehen und verwalten</div>
                                            </div>
                                            <div style={{ marginLeft: 'auto', color: '#cbd5e1' }}>
                                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                            </div>
                                        </button>

                                        {/* Partner Button Wrapper */}
                                        <div style={{ position: 'relative' }}>
                                            {/* Peeking Roach - Under Kammerjäger Button */}
                                            <img
                                                src="/pests/roach_runner.png"
                                                alt="Roach"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '-15px',
                                                    left: '-45px',
                                                    width: '90px',
                                                    height: 'auto',
                                                    zIndex: 5,
                                                    transform: 'rotate(-120deg)'
                                                }}
                                            />
                                            {/* Partner Button */}
                                            <button
                                                onClick={() => { setRole('partner'); setView('login'); }}
                                                style={{
                                                    position: 'relative',
                                                    zIndex: 10,
                                                    display: 'flex', alignItems: 'center', gap: '16px',
                                                    width: '100%', padding: '16px',
                                                    background: '#fff', border: '1px solid #94a3b8',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                    borderRadius: '12px', cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    textAlign: 'left'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#64748b'; e.currentTarget.style.background = '#f8fafc'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#fff'; }}
                                            >
                                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>Für Partner / Kammerjäger</div>
                                                    <div style={{ fontSize: '13px', color: '#64748b' }}>Arbeitskonto</div>
                                                </div>
                                                <div style={{ marginLeft: 'auto', color: '#cbd5e1' }}>
                                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        setLoading(true);
                                        setError('');
                                        setSuccess(false);

                                        if (view === 'login') {
                                            const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
                                            if (error) setError(error.message);
                                            else {
                                                setOpen(false);
                                                const isAdmin = authData.user?.email?.toLowerCase() === 'edorkalchuk@gmail.com';
                                                const isKunde = authData.user?.user_metadata?.role === 'kunden';
                                                router.push((isKunde && !isAdmin) ? '/kunden' : '/dashboard');
                                            }
                                        } else {
                                            const { error } = await supabase.auth.signUp({
                                                email, password, options: { data: { role } }
                                            });
                                            if (error) setError(error.message);
                                            else setSuccess(true);
                                        }
                                        setLoading(false);
                                    }}>
                                        {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
                                        {success && <div style={{ background: '#f0fdf4', color: '#15803d', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>Bitte überprüfen Sie Ihre E-Mails, um Ihre Registrierung zu bestätigen.</div>}

                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={handleGoogleLogin}
                                            style={{
                                                width: '100%', background: '#fff', color: '#1E293B', padding: '12px', borderRadius: '8px',
                                                fontSize: '15px', fontWeight: 600, border: '1px solid #cbd5e1', cursor: loading ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                marginBottom: '20px', transition: 'background 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                            </svg>
                                            Mit Google {view === 'login' ? 'anmelden' : 'registrieren'}
                                        </button>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                                            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Oder mit E-Mail</div>
                                            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>E-Mail Adresse</label>
                                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="am-input" placeholder="ihre@email.de" />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Passwort</label>
                                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="am-input" />
                                            </div>
                                        </div>

                                        <button type="submit" disabled={loading} style={{
                                            width: '100%', background: '#C8102E', color: '#fff', padding: '14px', borderRadius: '8px',
                                            fontSize: '15px', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                            opacity: loading ? 0.7 : 1, fontFamily: 'inherit'
                                        }}>
                                            {loading ? 'Wird geladen...' : view === 'login' ? 'Anmelden' : 'Registrieren'}
                                        </button>

                                        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
                                            {view === 'login' ? (
                                                <>Neu hier? <button type="button" onClick={() => { setView('register'); setError(''); setSuccess(false); }} style={{ background: 'none', border: 'none', color: '#C8102E', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Jetzt registrieren</button></>
                                            ) : (
                                                <>Bereits registriert? <button type="button" onClick={() => { setView('login'); setError(''); setSuccess(false); }} style={{ background: 'none', border: 'none', color: '#C8102E', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Anmelden</button></>
                                            )}
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
