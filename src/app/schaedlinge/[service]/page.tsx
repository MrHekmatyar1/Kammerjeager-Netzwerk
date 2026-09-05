import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICES } from '@/lib/data/services';

import Hero from '@/components/sections/Hero';
import ReviewSlider from '@/components/sections/ReviewSlider';
import UnserProzess from '@/components/sections/UnserProzess';
import LeadWizard from '@/components/interactive/LeadWizard';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/interactive/ChatBot';

export async function generateStaticParams() {
    return SERVICES.map((service) => ({
        service: service.slug,
    }));
}

export async function generateMetadata({ params }: { params: { service: string } }): Promise<Metadata> {
    const serviceData = SERVICES.find((s) => s.slug === params.service);
    
    if (!serviceData) {
        return { title: 'Service nicht gefunden' };
    }

    return {
        title: `Kammerjäger für ${serviceData.name} - 24/7 Notdienst | Experten vor Ort`,
        description: `${serviceData.description} Wir vermitteln zertifizierte Schädlingsbekämpfer in Ihrer Nähe. Schnell, diskret und zum Festpreis.`,
    };
}

export default function ServicePage({ params }: { params: { service: string } }) {
    const serviceData = SERVICES.find((s) => s.slug === params.service);

    if (!serviceData) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">
            <Hero serviceName={serviceData.shortName} />

            <UnserProzess />

            <section className="w-full flex flex-col items-center bg-white px-6 pt-[128px] pb-[200px]">
                <div className="w-full max-w-[850px]">
                    <LeadWizard />
                </div>
            </section>

            <section className="w-full bg-[#F8FAFC] border-t border-gray-100 pt-[80px] pb-[96px]">
                <ReviewSlider />
            </section>

            <Footer />
            <ChatBot />
        </main>
    );
}
