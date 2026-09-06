'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BRANCHES: Record<string, {
    slug: string;
    title: string;
    subtitle: string;
    heroImg: string;
    breadcrumb: string;
    label: string;
    intro: string;
    introBody: string;
    risks: { icon: string; title: string; desc: string }[];
    benefits: { title: string; desc: string }[];
    ctaTitle: string;
}> = {
    gastronomie: {
        slug: 'gastronomie',
        title: 'Schädlingsbekämpfung\nfür Gastronomie &\nLebensmittel',
        subtitle: 'HACCP-konform · Diskret · Rechtssicher',
        heroImg: '/b2b/b2b_hero_gastronomie.jpg',
        breadcrumb: 'Gastronomie & Lebensmittel',
        label: 'SCHÄDLINGSSCHUTZ FÜR GASTRONOMIEBETRIEBE',
        intro: 'Zuverlässiger Schutz für Ihren Betrieb und Ihren Ruf',
        introBody: 'In der Gastronomie kann ein einziger Schädlingsfall existenzbedrohend sein. Ein negativer Bewertungsportal-Eintrag oder eine Lebensmittelkontrolle kann jahrelange Arbeit zunichte machen. Wir schützen Ihr Restaurant, Café oder Ihren Lebensmittelbetrieb mit HACCP-konformen Maßnahmen — diskret, professionell und rechtssicher. Unsere Techniker kommen in neutralen Fahrzeugen und arbeiten außerhalb der Öffnungszeiten.',
        risks: [
            { icon: 'Schaben', title: 'Schaben & Kakerlaken', desc: 'Der häufigste und gefährlichste Schädling in Küchen. Überträgt Salmonellen und ist meldepflichtig bei Gesundheitsämtern.' },
            { icon: 'Nager', title: 'Nager (Ratten & Mäuse)', desc: 'Fressen Lebensmittelvorräte, beschädigen Kabel und verbreiten Krankheitserreger wie Leptospirose und Hantavirus.' },
            { icon: 'Fliegen', title: 'Fliegen & Vorratsschädlinge', desc: 'Verderben Lebensmittel, verunreinigen Arbeitsflächen und sind ein direkter Verstoß gegen Hygienevorschriften.' },
            { icon: 'Ameisen', title: 'Ameisen', desc: 'Dringen in Vorratslager ein und kontaminieren Lebensmittel. Schwer zu eliminieren ohne Fachkenntnis.' },
        ],
        benefits: [
            { title: 'HACCP-Dokumentation inklusive', desc: 'Wir liefern vollständige Nachweisdokumentation für Ihre Betriebsakte und Gesundheitsamtkontrollen.' },
            { title: 'Einsatz außerhalb der Öffnungszeiten', desc: 'Abends, nachts oder früh morgens — vollkommen unbemerkt von Gästen und Mitarbeitern.' },
            { title: 'Neutrale Fahrzeuge & Kleidung', desc: 'Kein Logo, keine Erkennungszeichen. Absoluter Schutz Ihres Rufs gegenüber Nachbarn und Kunden.' },
            { title: 'Regelmäßiges Monitoring', desc: 'Präventionsverträge mit quartalsweiser Inspektion für dauerhaft sicheren Betrieb.' },
        ],
        ctaTitle: 'Jetzt diskrete Beratung anfordern',
    },
    hotellerie: {
        slug: 'hotellerie',
        title: 'Schädlingsbekämpfung\nfür Hotels &\nGewerbe',
        subtitle: 'Diskret · Schnell · Für höchste Gästezufriedenheit',
        heroImg: '/b2b/b2b_hero_hotellerie.jpg',
        breadcrumb: 'Hotellerie & Gewerbe',
        label: 'SCHÄDLINGSSCHUTZ FÜR HOTELS UND GASTGEWERBE',
        intro: 'Schnelle und unauffällige Lösungen für höchste Gästezufriedenheit',
        introBody: 'In der Hotellerie ist Diskretion das höchste Gut. Eine einzige Bewertung mit Erwähnung von Schädlingen kann Buchungsraten drastisch senken. Unsere Techniker kommen in Zivilkleidung und neutralen Fahrzeugen, behandeln betroffene Zimmer während der regulären Zimmerpflege und hinterlassen keine Hinweise auf einen Einsatz. Wir sichern Ihren Betrieb 24/7.',
        risks: [
            { icon: 'Bettwanzen', title: 'Bettwanzen', desc: 'Der Albtraum jedes Hoteliers. Bettwanzen verstecken sich in Matratzen und Bettgestellen und breiten sich rasend schnell aus.' },
            { icon: 'Schaben', title: 'Schaben in Küchen', desc: 'Hotelküchen sind beliebte Verstecke. HACCP-Verstöße drohen, wenn kein professionelles Monitoring besteht.' },
            { icon: 'Nager', title: 'Nager', desc: 'Besonders in Außenbereichen, Lagerräumen und Kellern. Beschädigen Infrastruktur und schrecken Gäste ab.' },
            { icon: 'Tauben', title: 'Tauben & Vögel', desc: 'Verschmutzen Balkone, Dachterrassen und Fassaden und hinterlassen gesundheitsschädliche Exkremente.' },
        ],
        benefits: [
            { title: 'Einsatz in Zivilkleidung', desc: 'Keine Schutzanzüge oder auffällige Ausrüstung — vollständige Diskretion gegenüber Gästen.' },
            { title: '24/7 Notfallservice', desc: 'Bei akutem Befall sind wir in der Regel innerhalb weniger Stunden vor Ort, auch am Wochenende.' },
            { title: 'Zimmerweise Behandlung', desc: 'Wir behandeln nur betroffene Bereiche, ohne den restlichen Hotelbetrieb zu stören.' },
            { title: 'Präventionsverträge', desc: 'Regelmäßige Inspektionen aller Risikobereiche — Küche, Keller, Lager, Außenbereiche.' },
        ],
        ctaTitle: 'Jetzt Notfallservice anfordern',
    },
    lager: {
        slug: 'lager',
        title: 'Schädlingsbekämpfung\nfür Lager &\nLogistik',
        subtitle: 'Monitoring · Prävention · Warehousing-Schutz',
        heroImg: '/b2b/b2b_hero_lager.jpg',
        breadcrumb: 'Lager & Logistik',
        label: 'SCHÄDLINGSSCHUTZ FÜR LAGER UND LOGISTIKBETRIEBE',
        intro: 'Kontinuierlicher Schutz für Ihre Waren und Lieferketten',
        introBody: 'Schädlinge in Lagerhallen und Logistikzentren können immense wirtschaftliche Schäden verursachen — verdorbene Waren, beschädigte Verpackungen, gefährdete Lieferketten. Unser kontinuierliches Monitoring mit modernen Fallen und Detektionssystemen erkennt Schädlinge frühzeitig, bevor sie sich ausbreiten. Wir arbeiten nach internationalen Standards und liefern vollständige Dokumentation für Audits und Zertifizierungen.',
        risks: [
            { icon: 'Ratten', title: 'Ratten & Mäuse', desc: 'Benagen Kabel, Verpackungen und Lagergut. Lösen Kurzschlüsse aus und verursachen Brandgefahren.' },
            { icon: 'Käfer', title: 'Vorratsschädlinge', desc: 'Getreidekäfer, Motten und Mehlwürmer vernichten Lebensmittelvorräte und lösen Rückrufaktionen aus.' },
            { icon: 'Schaben', title: 'Schaben', desc: 'Besonders in Kühlhäusern und Lebensmittellagern ein ernstes Hygieneproblem mit Meldepflicht.' },
            { icon: 'Tauben', title: 'Tauben & Spatzen', desc: 'Verschmutzen Lagerflächen, beschädigen Waren durch Exkremente und übertragen Krankheitserreger.' },
        ],
        benefits: [
            { title: 'Intelligentes Monitoring-System', desc: 'Digitale Fallen mit Sofort-Alarm bei Aktivität. Lückenlose Nachverfolgung für Audits.' },
            { title: 'Audit-Dokumentation', desc: 'BRC, IFS, ISO-konforme Protokolle für alle gängigen Lebensmittelsicherheitsstandards.' },
            { title: 'Hallenweite Risikokartierung', desc: 'Wir identifizieren alle Eintrittspunkte und Risikozonen und sichern sie systematisch ab.' },
            { title: 'Minimierung von Betriebsunterbrechungen', desc: 'Einsätze werden koordiniert, um Ihren Lagerbetrieb so wenig wie möglich zu beeinflussen.' },
        ],
        ctaTitle: 'Jetzt Monitoring-Konzept anfragen',
    },
    oeffentlich: {
        slug: 'oeffentlich',
        title: 'Schädlingsbekämpfung\nfür öffentliche\nEinrichtungen',
        subtitle: 'Umweltfreundlich · Sicher · Rechtssicher',
        heroImg: '/b2b/b2b_hero_oeffentlich.jpg',
        breadcrumb: 'Öffentlicher Sektor',
        label: 'SCHÄDLINGSSCHUTZ FÜR ÖFFENTLICHE EINRICHTUNGEN',
        intro: 'Sichere, giftfreie Methoden für sensible Bereiche',
        introBody: 'Schulen, Kindergärten, Krankenhäuser und Behörden stellen besondere Anforderungen an die Schädlingsbekämpfung. Der Schutz von Kindern, Patienten und Mitarbeitern hat höchste Priorität. Wir verwenden ausschließlich zugelassene, umweltschonende Methoden und arbeiten nach streng geregelten Sicherheitsprotokollen. Alle unsere Techniker sind für den Einsatz in sensiblen Bereichen geschult und zertifiziert.',
        risks: [
            { icon: 'Nager', title: 'Nager in Schulen & Kitas', desc: 'Besonders gefährlich in Bereichen, in denen Kinder spielen und essen. Meldepflicht beim Gesundheitsamt.' },
            { icon: 'Schaben', title: 'Schaben in Kantinen', desc: 'Schulkantinen und Krankenhausverpflegung unterliegen strengsten Hygienekontrollen. Wir sichern die Compliance.' },
            { icon: 'Wespen', title: 'Wespen & Hornissen', desc: 'Nester an Gebäuden gefährden Kinder und Patienten. Wir entfernen Nester fachgerecht und sicher.' },
            { icon: 'Tauben', title: 'Tauben & Vogelbefall', desc: 'Behörden und Denkmäler leiden unter Taubenbefall. Wir bieten nachhaltige, tierschutzgerechte Abwehr.' },
        ],
        benefits: [
            { title: 'Zugelassene, kindersichere Mittel', desc: 'Ausschließlich BVL-zugelassene Mittel, sicher für Kinder, Senioren und Immungeschwächte.' },
            { title: 'Einsatz außerhalb der Betriebszeiten', desc: 'Wir kommen nachts, am Wochenende oder in den Ferien — ohne Beeinträchtigung des Betriebs.' },
            { title: 'Behördengerechte Dokumentation', desc: 'Vollständige Nachweisführung für Gesundheitsämter, Schulbehörden und Aufsichtsbehörden.' },
            { title: 'Langfristige Prävention', desc: 'Wir entwickeln individuelle Präventionskonzepte, die dauerhaft wirken und Wiederbefall verhindern.' },
        ],
        ctaTitle: 'Jetzt behördengerechte Beratung anfragen',
    },
};

export default function BranchePage({ params }: { params: Promise<{ branche: string }> }) {
    const { branche } = use(params);
    const data = BRANCHES[branche];
    if (!data) notFound();

    return (
        <>
            <Header />
            {/* No paddingTop on main — hero starts directly behind the fixed header */}
            <main className="min-h-screen bg-white flex flex-col items-center w-full overflow-x-hidden">

                {/* ── Full-bleed Hero — sits directly under the header's red line ── */}
                <section className="relative w-full flex items-end overflow-hidden" style={{ height: 'calc(55vh + 68px)', minHeight: '420px' }}>
                    <img
                        src={data.heroImg}
                        alt={data.breadcrumb}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pb-12">
                        {/* Breadcrumb */}
                        <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.15em] mb-4">
                            <Link href="/geschaeftskunden" className="hover:text-white transition-colors no-underline text-white/60">Geschäftskunden</Link>
                            {' / '}
                            <span className="text-white/80">{data.breadcrumb}</span>
                        </p>
                        {/* Title */}
                        <h1
                            className="text-white uppercase leading-[1.0] tracking-[-0.02em]"
                            style={{
                                fontFamily: "'Barlow Condensed', sans-serif",
                                fontWeight: 900,
                                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {data.title}
                        </h1>
                        <p className="text-white/70 mt-3 text-[15px] font-medium">{data.subtitle}</p>
                    </div>
                </section>

                {/* ── Intro Section ── */}
                <section className="w-full py-20 px-6 flex justify-center bg-white">
                    <div className="w-full max-w-[780px] text-center">
                        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#C8102E] mb-4">{data.label}</p>
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '20px' }}>
                            {data.intro}
                        </h2>
                        <p className="text-[#555] text-[16px] leading-relaxed max-w-[680px] mx-auto">
                            {data.introBody}
                        </p>
                    </div>
                </section>

                {/* ── Risk Grid ── */}
                <section className="w-full bg-[#f8f8f8] py-20 px-6 flex justify-center border-t border-gray-100">
                    <div className="w-full max-w-[1200px]">
                        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#C8102E] mb-3">Häufige Risiken</p>
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '40px' }}>
                            Typische Schädlinge in Ihrer Branche
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {data.risks.map((r, i) => (
                                <div key={i} className="bg-white p-6 border border-gray-100 shadow-sm">
                                    <div className="inline-block bg-[#fef2f2] text-[#C8102E] text-[11px] font-bold uppercase tracking-widest px-2 py-1 mb-4">{r.icon}</div>
                                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '20px', textTransform: 'uppercase', color: '#1a1a1a', marginBottom: '10px', letterSpacing: '0.01em' }}>
                                        {r.title}
                                    </h3>
                                    <p className="text-[#666] text-[14px] leading-relaxed">{r.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Benefits ── */}
                <section className="w-full bg-white py-20 px-6 flex justify-center border-t border-gray-100">
                    <div className="w-full max-w-[1200px]">
                        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#C8102E] mb-3">Unsere Leistungen</p>
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '40px' }}>
                            Was wir für Sie tun
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                            {data.benefits.map((b, i) => (
                                <div key={i} className="flex gap-5 items-start">
                                    <div className="w-8 h-8 rounded-full bg-[#C8102E] flex items-center justify-center shrink-0 mt-1">
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    <div>
                                        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '20px', textTransform: 'uppercase', color: '#1a1a1a', marginBottom: '6px', letterSpacing: '0.01em' }}>
                                            {b.title}
                                        </h3>
                                        <p className="text-[#666] text-[14px] leading-relaxed">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA Banner ── */}
                <section className="w-full bg-[#1a1a1a] py-20 px-6 flex justify-center">
                    <div className="w-full max-w-[900px] flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="flex-1">
                            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '12px' }}>
                                {data.ctaTitle}
                            </h2>
                            <p className="text-white/60 text-[15px] leading-relaxed">
                                Wir antworten innerhalb weniger Stunden — auch am Wochenende.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                            <Link
                                href="/geschaeftskunden#kontakt"
                                className="bg-[#C8102E] text-white font-bold text-[14px] uppercase tracking-[0.1em] px-8 py-4 text-center no-underline transition-colors hover:bg-[#a50d25]"
                            >
                                Anfrage stellen
                            </Link>
                            <a href="tel:016092376320" className="border border-white/30 text-white font-bold text-[14px] uppercase tracking-[0.1em] px-8 py-4 text-center no-underline transition-colors hover:border-white/60">
                                0160 92376320
                            </a>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
