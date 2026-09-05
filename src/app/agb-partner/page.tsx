import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PartnerAgbContent from '@/components/sections/PartnerAgbContent';

export const metadata: Metadata = {
    title: 'AGB für Partner | Kammerjäger-Zentrale',
    description: 'Allgemeine Geschäftsbedingungen für unsere Partnerunternehmen und Schädlingsbekämpfer.',
};

export default function PartnerAgbPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main style={{ paddingTop: '100px' }} className="w-full flex-grow flex justify-center py-16 px-6">
                <PartnerAgbContent />
            </main>

            <Footer />
        </div>
    );
}
