'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLeadPricing } from '@/lib/pricing';

export default function ConfirmClient({ lead, billingModel }: { lead: any, billingModel: string }) {
    const router = useRouter();
    const [invoiceAmount, setInvoiceAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Swipe Slider State
    const sliderRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const pricing = getLeadPricing(lead.schaedling, billingModel, lead.billing_override_type, lead.billing_override_value);
    const needsInvoice = pricing.type === 'percentage';

    // Handle touch/mouse drag for slider
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (isConfirmed || loading || success) return;
        setIsDragging(true);
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !sliderRef.current || !thumbRef.current) return;
        
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const thumbWidth = thumbRef.current.offsetWidth;
        const maxDrag = sliderRect.width - thumbWidth - 8; // 4px padding on each side
        
        let clientX = 0;
        if ('touches' in e) {
            clientX = (e as unknown as TouchEvent).touches[0]?.clientX || 0;
        } else {
            clientX = (e as unknown as MouseEvent).clientX || 0;
        }

        let newPos = clientX - sliderRect.left - (thumbWidth / 2);
        
        if (newPos < 0) newPos = 0;
        if (newPos > maxDrag) newPos = maxDrag;
        
        setDragPosition(newPos);

        // If dragged to the end (over 95%)
        if (newPos > maxDrag * 0.95) {
            handleConfirm();
        }
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (!isConfirmed) {
            // Snap back
            setDragPosition(0);
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging]);


    const handleConfirm = async () => {
        if (needsInvoice && (!invoiceAmount || parseFloat(invoiceAmount) <= 0)) {
            setError('Bitte geben Sie einen gültigen Rechnungsbetrag ein.');
            setDragPosition(0);
            setIsDragging(false);
            return;
        }

        setIsConfirmed(true);
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/leads/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: lead.id,
                    invoiceAmount: invoiceAmount || '0'
                })
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                setError(data.error || 'Ein Fehler ist aufgetreten.');
                setIsConfirmed(false);
                setDragPosition(0);
            }
        } catch (err) {
            setError('Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung.');
            setIsConfirmed(false);
            setDragPosition(0);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif', background: '#f1f5f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#fff', padding: '40px 24px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                    <h2 style={{ color: '#0f172a', marginBottom: '12px', fontSize: '24px', fontWeight: 800 }}>Auftrag abgeschlossen!</h2>
                    <p style={{ color: '#475569', fontSize: '15px' }}>Der Auftrag wurde erfolgreich als abgeschlossen markiert. Sie werden weitergeleitet...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f1f5f9', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ background: '#0f172a', padding: '24px 20px', color: '#fff', paddingBottom: '40px' }}>
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>
                        Kammerjäger Structon
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase' }}>
                        Auftrag Abschließen
                    </h1>
                </div>
            </div>

            <div style={{ maxWidth: '400px', margin: '-20px auto 40px', padding: '0 16px' }}>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' }}>
                    
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Kunde in {lead.plz}</div>
                        <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700 }}>{lead.schaedling || 'Schädlingsbekämpfung'}</div>
                    </div>

                    {needsInvoice && (
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                Rechnungsbetrag (Netto in €) <span style={{ color: '#C8102E' }}>*</span>
                            </label>
                            <input 
                                type="number" 
                                value={invoiceAmount}
                                onChange={(e) => {
                                    setInvoiceAmount(e.target.value);
                                    setError('');
                                }}
                                placeholder="z.B. 150.00"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '10px',
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    outline: 'none',
                                    color: '#0f172a',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', lineHeight: 1.5 }}>
                                Bitte tragen Sie hier den vom Endkunden gezahlten Betrag ein. Die Provision ({pricing.value}) wird basierend darauf berechnet.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, marginBottom: '24px' }}>
                            {error}
                        </div>
                    )}

                    {/* Swipe to confirm slider */}
                    <div style={{ marginTop: '16px' }}>
                        <div 
                            ref={sliderRef}
                            style={{
                                background: isConfirmed ? '#16a34a' : '#1e293b',
                                height: '64px',
                                borderRadius: '32px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'background 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                userSelect: 'none',
                                touchAction: 'none' // Prevent scrolling while swiping
                            }}
                        >
                            <span style={{ color: isConfirmed ? '#fff' : '#94a3b8', fontSize: '15px', fontWeight: 700, zIndex: 1, pointerEvents: 'none', opacity: (isConfirmed || dragPosition > 50) ? 0 : 1, transition: 'opacity 0.2s' }}>
                                SWIPE ZUM ABSCHLIESSEN
                            </span>

                            <div 
                                ref={thumbRef}
                                onMouseDown={handleDragStart}
                                onTouchStart={handleDragStart}
                                style={{
                                    position: 'absolute',
                                    left: '4px',
                                    top: '4px',
                                    bottom: '4px',
                                    width: '56px',
                                    background: '#fff',
                                    borderRadius: '28px',
                                    cursor: isConfirmed ? 'default' : 'grab',
                                    transform: `translateX(${dragPosition}px)`,
                                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 2,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                }}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-[#1e293b] border-t-transparent rounded-full animate-spin"></div>
                                ) : isConfirmed ? (
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
