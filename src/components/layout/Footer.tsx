'use client';

// Bottom footer — logo, nav links, copyright
// Нижний футер — лого, ссылки, копирайт

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    const feedbackEmail = "ideen@kammerjaeger-structon.de";
    const feedbackSubject = encodeURIComponent("Ideen zur Website-Verbesserung");

    return (
        <footer style={{ width: '100%', backgroundColor: '#1a1a1a', color: 'white', paddingTop: '40px', paddingBottom: '24px', marginTop: '64px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '28px' }}>

                {/* Logo + Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <Image src="/logo_k.png" alt="Kammerjäger Structon Logo" width={34} height={34} style={{ objectFit: 'contain' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1', textAlign: 'left' }}>
                        <span style={{ fontWeight: 900, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'white', fontStyle: 'italic' }}>Kammerjäger</span>
                        <span style={{ fontWeight: 700, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#9ca3af' }}>Structon</span>
                    </div>
                </div>

                {/* Nav links */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px 32px', fontSize: '13px', fontWeight: 500, color: '#9ca3af' }}>
                    <Link href="/ueber-uns" style={{ color: '#9ca3af', textDecoration: 'none' }}>Über uns</Link>
                    <Link href="/geschaeftskunden" style={{ color: '#9ca3af', textDecoration: 'none' }}>Für Geschäftskunden</Link>
                    <Link href="/fuer-schaedlingsbekaempfer" style={{ color: '#9ca3af', textDecoration: 'none' }}>Für Schädlingsbekämpfer</Link>
                    <Link href="/impressum" style={{ color: '#9ca3af', textDecoration: 'none' }}>Impressum</Link>
                    <Link href="/agb" style={{ color: '#9ca3af', textDecoration: 'none' }}>AGB</Link>
                    <Link href="/datenschutz" style={{ color: '#9ca3af', textDecoration: 'none' }}>Datenschutz</Link>
                    <a href={`mailto:${feedbackEmail}?subject=${feedbackSubject}`} style={{ color: '#9ca3af', textDecoration: 'none' }}>Ideen & Verbesserungen</a>
                </div>

                {/* Divider */}
                <div style={{ width: '100%', maxWidth: '600px', height: '1px', backgroundColor: '#374151' }}></div>

                {/* Copyright */}
                <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: 0 }}>
                    © {new Date().getFullYear()} Kammerjäger Structon. Alle Rechte vorbehalten.
                </p>
            </div>
        </footer>
    );
}
