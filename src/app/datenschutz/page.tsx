import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DatenschutzContent from '@/components/sections/DatenschutzContent';

export default function DatenschutzPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main style={{ paddingTop: '100px' }} className="w-full flex-grow flex justify-center py-16 px-6">
                <DatenschutzContent />
            </main>

            <Footer />
        </div>
    );
}
