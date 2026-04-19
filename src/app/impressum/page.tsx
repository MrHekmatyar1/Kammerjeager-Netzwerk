import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ImpressumContent from '@/components/sections/ImpressumContent';

export default function ImpressumPage() {
    return (
        <>
            <Header />

            <main style={{ paddingTop: '68px' }} className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">
                <section className="w-full flex justify-center py-16 px-6">
                    <ImpressumContent />
                </section>
            </main>

            <Footer />
        </>
    );
}
