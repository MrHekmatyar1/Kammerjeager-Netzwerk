'use client';

export default function DashboardBilling() {
    return (
        <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a', lineHeight: 1 }}>
                Abrechnung
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
                Verwalten Sie Ihre Zahlungsmethoden und Rechnungen über Stripe Connect.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Stripe Status */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 91, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <path d="M2 10h20" />
                            </svg>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Stripe Account</h3>
                            <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                                Nicht verbunden
                            </div>
                        </div>
                    </div>
                    
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                        Um Leads auf Provisionsbasis zu erhalten, müssen Sie Ihr Bankkonto oder eine Kreditkarte über Stripe hinterlegen. 
                        Es fallen nur Gebühren an, wenn Sie einen Auftrag erfolgreich abschließen.
                    </p>

                    <button style={{
                        width: '100%', background: '#635BFF', color: '#fff', border: 'none', padding: '12px',
                        borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'opacity 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                        Mit Stripe verbinden
                    </button>
                </div>

                {/* Balance (Prepaid fallback) */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Plattform-Guthaben</h3>
                    <div style={{ fontSize: '48px', fontWeight: 900, color: '#0f172a', marginBottom: '8px', lineHeight: 1 }}>
                        0,00 <span style={{ fontSize: '24px', color: '#94a3b8' }}>€</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
                        Alternativ können Sie Guthaben aufladen, um Leads zum Festpreis (CPL) zu kaufen, anstatt Provision zu zahlen.
                    </p>

                    <button style={{
                        width: '100%', background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px',
                        borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                    }}>
                        Guthaben aufladen
                    </button>
                </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '16px' }}>Vergangene Rechnungen</h3>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                Sie haben noch keine Rechnungen erhalten.
            </div>
        </div>
    );
}
