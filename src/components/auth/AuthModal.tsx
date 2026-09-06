'use client';

import { useState, useEffect } from 'react';
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

    const router = useRouter();
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        const nextUrl = role === 'kunden' ? '/kunden' : '/dashboard';
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${nextUrl}&role=${role}`,
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
                @keyframes am-drawer-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .am-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.50); z-index: 99999; animation: am-backdrop-in 0.2s ease forwards; display: flex; justify-content: flex-end; }
                
                .am-card { 
                    background: #fff; 
                    width: 100%; 
                    max-width: 500px; 
                    height: 100%;
                    position: relative; 
                    animation: am-drawer-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
                    flex-shrink: 0;
                    box-shadow: -12px 0 48px rgba(0,0,0,0.12);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                .am-close {
                    position: absolute;
                    top: 32px;
                    right: 32px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #1e293b;
                    z-index: 10;
                    transition: transform 0.1s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .am-close:hover {
                    color: #C8102E;
                }
                .am-close:active {
                    transform: scale(0.9);
                }
                
                .am-input {
                    width: 100%;
                    padding: 8px 0;
                    border: none;
                    border-bottom: 1px solid #cbd5e1;
                    background: transparent;
                    font-size: 15px;
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.2s;
                    color: #1e293b;
                }
                .am-input:focus {
                    border-color: #C8102E;
                }
                .am-label {
                    display: block;
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 4px;
                }
                .am-label span {
                    color: #C8102E;
                }
            `}</style>

            <div className="am-overlay" onClick={e => { if (e.target === e.currentTarget && !loading) setOpen(false); }}>
                <div className="am-card">
                    {/* Close Button */}
                    <button className="am-close" onClick={() => !loading && setOpen(false)} disabled={loading}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div style={{ padding: '48px 40px', flex: 1 }}>
                        {view !== 'select' && (
                            <button
                                onClick={() => setView('select')}
                                disabled={loading}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '13px', fontWeight: 600, color: '#64748b',
                                    fontFamily: 'inherit', marginBottom: '32px', padding: 0
                                }}
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                Zurück zur Auswahl
                            </button>
                        )}

                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2rem,6vw,2.5rem)', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', marginBottom: '8px', lineHeight: 1.0, letterSpacing: '-0.02em', marginTop: view === 'select' ? '24px' : 0 }}>
                            {view === 'select' ? 'Konto erstellen oder anmelden' : view === 'login' ? 'Anmelden' : 'Registrieren'}
                        </h2>
                        
                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '40px', lineHeight: 1.5 }}>
                            {view === 'select' ? 'Wählen Sie Ihren Kontotyp aus, um fortzufahren.' : 'Bereits Kunde? Loggen Sie sich ein, um Termine online zu planen, Rechnungen zu bezahlen und vieles mehr.'}
                        </p>

                        {view === 'select' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Client Button */}
                                <button
                                    onClick={() => { setRole('kunden'); setView('login'); }}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '20px',
                                        width: '100%', padding: '24px',
                                        background: '#f8fafc', border: '1px solid #e2e8f0',
                                        borderRadius: '16px', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textAlign: 'left'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.background = '#fdf7f8'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8102E', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '4px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase', letterSpacing: '0.02em' }}>Ich bin Kunde</div>
                                        <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.4 }}>Aufträge einsehen, Rechnungen herunterladen und Termine verwalten.</div>
                                    </div>
                                </button>

                                {/* Partner Button */}
                                <button
                                    onClick={() => { setRole('partner'); setView('login'); }}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '20px',
                                        width: '100%', padding: '24px',
                                        background: '#f8fafc', border: '1px solid #e2e8f0',
                                        borderRadius: '16px', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textAlign: 'left'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#64748b'; e.currentTarget.style.background = '#f1f5f9'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '4px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase', letterSpacing: '0.02em' }}>Ich bin Partner</div>
                                        <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.4 }}>Arbeitskonto für Kammerjäger. Aufträge annehmen und bearbeiten.</div>
                                    </div>
                                </button>
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
                                        
                                        // Если у юзера роль была сохранена, или он выбрал ее сейчас
                                        const finalRole = authData.user?.user_metadata?.role || role;
                                        const isKunde = finalRole === 'kunden';
                                        
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
                                {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '24px', borderLeft: '4px solid #ef4444' }}>{error}</div>}
                                {success && <div style={{ background: '#f0fdf4', color: '#15803d', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '24px', borderLeft: '4px solid #22c55e' }}>Bitte überprüfen Sie Ihre E-Mails, um Ihre Registrierung zu bestätigen.</div>}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '32px' }}>
                                    <div>
                                        <label className="am-label">E-Mail Adresse <span>*</span></label>
                                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="am-input" />
                                    </div>
                                    <div>
                                        <label className="am-label">Passwort <span>*</span></label>
                                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="am-input" />
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="btn-color-hover" style={{
                                    width: '100%', background: '#C8102E', color: '#fff', padding: '16px', borderRadius: '0',
                                    fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1, fontFamily: 'inherit', marginBottom: '24px'
                                }}>
                                    {loading ? 'Wird geladen...' : view === 'login' ? 'Anmelden' : 'Konto Erstellen'}
                                </button>

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleGoogleLogin}
                                    style={{
                                        width: '100%', background: '#fff', color: '#1E293B', padding: '14px', borderRadius: '0',
                                        fontSize: '15px', fontWeight: 700, border: '2px solid #e2e8f0', cursor: loading ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        marginBottom: '32px', transition: 'background 0.2s'
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

                                <div style={{ textAlign: 'center', fontSize: '14px', color: '#1e293b' }}>
                                    {view === 'login' ? (
                                        <>Noch kein Konto? <button type="button" onClick={() => { setView('register'); setError(''); setSuccess(false); }} style={{ background: 'none', border: 'none', color: '#C8102E', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginLeft: '4px' }}>Konto erstellen</button></>
                                    ) : (
                                        <>Bereits registriert? <button type="button" onClick={() => { setView('login'); setError(''); setSuccess(false); }} style={{ background: 'none', border: 'none', color: '#C8102E', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginLeft: '4px' }}>Anmelden</button></>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                    
                    {/* Footer Contact Info (Matches Orkin screenshot bottom text) */}
                    {view !== 'select' && (
                        <div style={{ padding: '24px 40px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                            Benötigen Sie Hilfe? Rufen Sie uns an <a href="tel:016092376320" style={{ color: '#C8102E', fontWeight: 700, textDecoration: 'none' }}>0160 92376320</a>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
