'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    time: string;
    options?: string[];
}

function getBotResponse(input: string): { text: string; options?: string[] } {
    const lower = input.toLowerCase();

    // 1. Kakerlaken flow (instead of termites)
    if (lower.includes('kakerlakenbekämpfung')) {
        return {
            text: 'Wir können Ihnen auf jeden Fall dabei helfen.\n\nSind Sie Neukunde oder bereits Bestandskunde?',
            options: ['Neukunde', 'Bestandskunde']
        };
    }

    if (lower === 'neukunde' || lower.includes('neu')) {
        return {
            text: 'Willkommen! Bitte geben Sie Ihre Postleitzahl ein, damit wir Ihnen Experten in Ihrer Nähe zuweisen können.',
        };
    }

    if (lower.includes('bestand')) {
        return {
            text: 'Willkommen zurück! Bitte geben Sie Ihre Kundennummer oder Postleitzahl ein, um fortzufahren.',
        };
    }

    // 2. Schädlingsbekämpfung flow
    if (lower.includes('hilfe bei der schädlingsbekämpfung')) {
        return {
            text: 'Welcher Schädling bereitet Ihnen Probleme?',
            options: ['Ratten & Mäuse', 'Wespen', 'Ameisen', 'Bettwanzen', 'Andere Schädlinge']
        };
    }

    // 3. Other generic flows (Rechnung, Termin, etc)
    if (lower.includes('rechnung') || lower.includes('bezahlen')) {
        return {
            text: 'Um Ihre Rechnung zu bezahlen oder einzusehen, benötigen wir Ihre Kundennummer. Möchten Sie zum Portal weitergeleitet werden?',
            options: ['Ja, zum Portal', 'Nein, danke']
        };
    }

    // Default fallback to main menu
    return {
        text: 'Wie kann ich Ihnen heute helfen?\n\nBitte wählen Sie eine der folgenden Optionen:',
        options: [
            'Hilfe bei der Schädlingsbekämpfung',
            'Kakerlakenbekämpfung benötigt',
            'Rechnung bezahlen',
            'Online Termin buchen',
            'Häufige Fragen'
        ]
    };
}

function getTime() {
    return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

// Shield SVG icon (our brand mark)
function ShieldIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill={color} />
            <path d="M9 12l2 2 4-4" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Wie kann ich Ihnen heute helfen?\n\nBitte wählen Sie eine der folgenden Optionen:',
            sender: 'bot',
            time: getTime(),
            options: [
                'Hilfe bei der Schädlingsbekämpfung',
                'Kakerlakenbekämpfung benötigt',
                'Rechnung bezahlen',
                'Online Termin buchen',
                'Häufige Fragen'
            ]
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            setTimeout(() => inputRef.current?.focus(), 120);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now(), text: text.trim(), sender: 'user', time: getTime() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const response = getBotResponse(text);
            const botMsg: Message = {
                id: Date.now() + 1,
                text: response.text,
                options: response.options,
                sender: 'bot',
                time: getTime(),
            };
            setIsTyping(false);
            setMessages(prev => [...prev, botMsg]);
            if (!isOpen) setHasUnread(true);
        }, 800 + Math.random() * 400);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <>
            {/* ── Chat Window ── */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '96px',
                    right: '20px',
                    width: '360px',
                    maxHeight: '560px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 9998,
                    transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(12px)',
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'all' : 'none',
                    transition: 'all 0.28s cubic-bezier(0.34, 1.45, 0.64, 1)',
                    transformOrigin: 'bottom right',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                {/* ── Header ── */}
                <div style={{
                    background: '#e0edec', // Mint/teal from Orkin for aesthetic
                    padding: '16px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <div style={{
                            width: '42px', height: '24px',
                            background: '#C8102E',
                            borderRadius: '2px', // Polygon shape illusion
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            clipPath: 'polygon(15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%, 0 50%)',
                        }}>
                            <ShieldIcon size={12} color="#fff" />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '15px', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                            Nachricht senden
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '20px', lineHeight: 1 }}>…</button>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: '#fff' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Messages ── */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px 14px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    background: '#f8f9fa', // Light gray background
                }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                            {msg.sender === 'bot' ? (
                                <div style={{ alignSelf: 'flex-start', width: '92%' }}>
                                    {/* Bot message bubble (Orkin style white box) */}
                                    <div style={{
                                        background: '#ffffff',
                                        border: '1px solid #d4d4d4',
                                        borderRadius: '0', // Sharp corners as requested
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    }}>
                                        <div style={{
                                            padding: '14px',
                                            fontSize: '14px',
                                            lineHeight: '1.45',
                                            color: '#111',
                                            whiteSpace: 'pre-line',
                                        }}>
                                            {msg.text}
                                        </div>

                                        {/* Selectable Options appended exactly like Orkin */}
                                        {msg.options && msg.options.length > 0 && (
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                {msg.options.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => sendMessage(opt)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderTop: '1px solid #d4d4d4',
                                                            color: '#0066cc',
                                                            padding: '12px 14px',
                                                            fontSize: '14px',
                                                            textAlign: 'center',
                                                            cursor: 'pointer',
                                                            transition: 'background 0.15s, text-decoration 0.15s',
                                                            fontFamily: 'Inter, sans-serif',
                                                            borderRadius: '0', // Ensure sharp corners on hover areas
                                                        }}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.backgroundColor = '#f4f8fb';
                                                            e.currentTarget.style.textDecoration = 'underline';
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                            e.currentTarget.style.textDecoration = 'none';
                                                        }}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
                                    {/* User message tick */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginBottom: '2px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 13l4 4L19 7" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span style={{ fontSize: '11px', color: '#111' }}>Du um {msg.time}</span>
                                    </div>
                                    <div style={{
                                        position: 'relative',
                                        background: '#cae3de', // Mint green matching header
                                        padding: '10px 14px',
                                        fontSize: '14px',
                                        lineHeight: '1.45',
                                        color: '#111',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                    }}>
                                        {msg.text}
                                        {/* Right triangle tip */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '-6px',
                                            width: '0',
                                            height: '0',
                                            borderTop: '6px solid transparent',
                                            borderBottom: '6px solid transparent',
                                            borderLeft: '6px solid #cae3de',
                                        }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div style={{ alignSelf: 'flex-start', width: '92%' }}>
                            <div style={{
                                background: '#ffffff', border: '1px solid #d4d4d4',
                                padding: '14px', borderRadius: '4px',
                                display: 'flex', gap: '5px', alignItems: 'center',
                                width: 'fit-content'
                            }}>
                                {[0, 0.15, 0.3].map((delay, i) => (
                                    <span key={i} style={{
                                        width: '7px', height: '7px', borderRadius: '50%',
                                        background: '#9ca3af', display: 'inline-block',
                                        animation: 'chatBounce 0.8s ease-in-out infinite',
                                        animationDelay: `${delay}s`,
                                    }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* ── Input ── */}
                <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0',
                    borderTop: '2px solid #C8102E', // Red border line at bottom
                    background: '#fff',
                    height: '54px',
                }}>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Schreiben Sie Ihre Nachricht"
                        style={{
                            flex: 1, border: 'none', outline: 'none',
                            fontSize: '14px', color: '#111', fontStyle: 'italic',
                            fontFamily: 'Inter, sans-serif',
                            background: 'transparent',
                            padding: '0 16px',
                            height: '100%'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        aria-label="Senden"
                        style={{
                            background: 'none', border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                            padding: '0 16px', display: 'flex', alignItems: 'center', height: '100%',
                            opacity: input.trim() ? 1 : 0.3, transition: 'opacity 0.2s',
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* ── Floating HELP Button ── */}
            <button
                onClick={() => setIsOpen(o => !o)}
                aria-label="Chat öffnen"
                style={{
                    position: 'fixed',
                    bottom: '28px',
                    right: '20px',
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C8102E 0%, #9B0D22 100%)',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 28px rgba(200,16,46,0.45), 0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s',
                }}
            >
                {isOpen ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg width="40" height="36" viewBox="0 0 84 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M52 6 C52 6 78 6 78 24 C78 40 65 44 59 44 L66 58 L47 44 C47 44 30 44 30 28" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.55)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M34 4 C34 4 6 4 6 24 C6 42 20 46 27 46 L19 62 L39 46 C39 46 62 46 62 24 C62 4 34 4 34 4Z" fill="rgba(255,255,255,0.15)" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
                        <text x="34" y="30" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="Arial Black, Arial, sans-serif" letterSpacing="1">HELP</text>
                    </svg>
                )}
                {hasUnread && !isOpen && (
                    <span style={{ position: 'absolute', top: '6px', right: '6px', width: '13px', height: '13px', borderRadius: '50%', background: '#facc15', border: '2px solid #fff', animation: 'chatPing 1.2s ease-in-out infinite' }} />
                )}
            </button>

            <style>{`
                @keyframes chatBounce { 0%, 100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-5px); opacity: 1; } }
                @keyframes chatPing { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.35); opacity: 0.65; } }
            `}</style>
        </>
    );
}
