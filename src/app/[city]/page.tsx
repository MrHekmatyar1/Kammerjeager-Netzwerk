import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITIES } from '@/lib/data/cities';

import Hero from '@/components/sections/Hero';
import ReviewSlider from '@/components/sections/ReviewSlider';
import UnserProzess from '@/components/sections/UnserProzess';
import LeadWizard from '@/components/interactive/LeadWizard';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/interactive/ChatBot';

// 1. Указываем Next.js, какие страницы (города) предгенерировать во время сборки (SSG)
export async function generateStaticParams() {
    return CITIES.map((city) => ({
        city: city.slug,
    }));
}

// 2. Генерируем уникальные метаданные (SEO-теги) для каждого города
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
    const cityData = CITIES.find((c) => c.slug === params.city);
    
    if (!cityData) {
        return { title: 'Stadt nicht gefunden' };
    }

    return {
        title: `Kammerjäger ${cityData.name} - 24/7 Notdienst | Experten vor Ort`,
        description: `Schädlingsbekämpfung in ${cityData.name}. Wir sind sofort für Sie da. Kammerjäger für Wespen, Ratten, Mäuse, Bettwanzen und mehr.`,
    };
}

// 3. Рендерим саму страницу
export default function CityPage({ params }: { params: { city: string } }) {
    const cityData = CITIES.find((c) => c.slug === params.city);

    // Если в URL ввели город, которого нет в нашем списке, показываем 404
    if (!cityData) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">
            <Hero cityName={cityData.name} />

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
