import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AgbContent from '@/components/sections/AgbContent';

export default function AgbPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main style={{ paddingTop: '100px' }} className="w-full flex-grow flex justify-center py-16 px-6">
                <AgbContent />
            </main>

            <Footer />
        </div>
    );
}
