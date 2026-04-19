'use client';
import { useState } from 'react';
import { PESTS_DATA } from '../../constants/data';

function PestCard({ p, onClick }: { p: typeof PESTS_DATA[0]; onClick: () => void }) {
    const [imgFailed, setImgFailed] = useState(false);

    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#C8102E] hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
            <div className="w-full aspect-square mb-3 flex items-center justify-center overflow-hidden">
                {!imgFailed ? (
                    <img
                        src={p.img}
                        alt={p.name}
                        className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" />
                        </svg>
                    </div>
                )}
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-[#C8102E] uppercase tracking-wide transition-colors duration-200">
                {p.name}
            </span>
        </button>
    );
}

export default function LeadWizard() {
    const [step, setStep] = useState<number | 'andere'>(1);

    const handleOptionsSelect = () => {
        setStep(2);
    };

    return (
        <div className="w-full">
            {step === 1 && (
                <div className="bg-[#F8FAFC] rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.05)] border border-gray-100 animate-in fade-in duration-300 w-full">
                    <div className="px-8 pt-10 pb-14 md:px-14 md:pt-12 md:pb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-[#1E293B] uppercase leading-[0.9] tracking-tighter text-center mb-8"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                            Welcher Schädling <br /> bereitet Probleme?
                        </h2>
                        <div className="w-full border-t border-gray-100 mb-8" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {PESTS_DATA.map((p) => (
                                <PestCard
                                    key={p.id}
                                    p={p}
                                    onClick={() => {
                                        if (p.id === 'andere') {
                                            setStep('andere');
                                        } else {
                                            setStep(2);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 'andere' && (
                <div className="w-full max-w-[800px] mx-auto bg-white border border-gray-100 rounded-[24px] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.06)] animate-in fade-in zoom-in duration-300 flex flex-col items-center">



                    <h3 className="text-[26px] md:text-[30px] w-full text-center font-black text-[#1E293B] mb-2 font-heading uppercase tracking-tight leading-[1]">
                        Sehr gerne unterstützen wir Sie bei der Identifikation.
                    </h3>

                    <p className="w-full text-center text-gray-500 mb-10 text-[13px] font-medium">Wie können wir Sie unterstützen?</p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-[650px]">
                        {/* Option 1: Bilder identifizieren */}
                        <button
                            onClick={handleOptionsSelect}
                            className="group flex flex-col items-center justify-center flex-1 w-full aspect-square bg-white border border-gray-200 hover:border-[#C8102E] transition-all duration-200 cursor-pointer"
                        >
                            <svg className="mb-4 text-[#1E293B] group-hover:text-[#C8102E] transition-colors" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="8" width="18" height="12" rx="2" ry="2" />
                                <circle cx="12" cy="14" r="3" />
                                <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span className="font-bold text-center text-[#1E293B] group-hover:text-[#C8102E] transition-colors text-[11px] uppercase tracking-wide px-2 leading-tight">
                                Bilder<br />identifizieren
                            </span>
                        </button>

                        {/* Option 2: Beratung am Telefon/E-Mail */}
                        <button
                            onClick={handleOptionsSelect}
                            className="group flex flex-col items-center justify-center flex-1 w-full aspect-square bg-white border border-gray-200 hover:border-[#C8102E] transition-all duration-200 cursor-pointer"
                        >
                            {/* User will add their own icon here */}
                            <span className="font-bold text-center text-[#1E293B] group-hover:text-[#C8102E] transition-colors text-[11px] uppercase tracking-wide px-2 leading-tight">
                                Beratung am<br />Telefon/E-Mail
                            </span>
                        </button>

                        {/* Option 3: Vor-Ort Bestimmung */}
                        <button
                            onClick={handleOptionsSelect}
                            className="group flex flex-col items-center justify-center flex-1 w-full aspect-square bg-white border border-gray-200 hover:border-[#C8102E] transition-all duration-200 cursor-pointer"
                        >
                            {/* User will add their own icon here */}
                            <span className="font-bold text-center text-[#1E293B] group-hover:text-[#C8102E] transition-colors text-[11px] uppercase tracking-wide px-2 leading-tight">
                                Vor-Ort<br />Bestimmung
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[600px] bg-white border border-gray-100 rounded-[24px] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] animate-in fade-in zoom-in duration-300">
                        <h3 className="text-[26px] font-black text-[#1E293B] mb-2 text-center font-heading uppercase tracking-tight">Kontaktdaten</h3>
                        <p className="text-gray-500 mb-8 text-center text-[14px] font-medium">Wo genau benötigen Sie unsere Hilfe?</p>

                        <form className="flex flex-col gap-5 w-full text-left" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[14px] text-[#475569] font-medium ml-1">Postleitzahl</label>
                                <input
                                    type="text"
                                    className="border-2 border-gray-300 p-3.5 rounded-xl w-full text-[15px] outline-none focus:border-[#C8102E] transition-colors bg-white hover:border-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[14px] text-[#475569] font-medium ml-1">Vor- und Nachname</label>
                                <input
                                    type="text"
                                    className="border-2 border-gray-300 p-3.5 rounded-xl w-full text-[15px] outline-none focus:border-[#C8102E] transition-colors bg-white hover:border-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[14px] text-[#475569] font-medium ml-1">Name Ihres Unternehmens</label>
                                <input
                                    type="text"
                                    className="border-2 border-gray-300 p-3.5 rounded-xl w-full text-[15px] outline-none focus:border-[#C8102E] transition-colors bg-white hover:border-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[14px] text-[#475569] font-medium ml-1">Telefonnummer</label>
                                <input
                                    type="tel"
                                    className="border-2 border-gray-300 p-3.5 rounded-xl w-full text-[15px] outline-none focus:border-[#C8102E] transition-colors bg-white hover:border-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[14px] text-[#475569] font-medium ml-1">E-Mail-Adresse</label>
                                <input
                                    type="email"
                                    className="border-2 border-gray-300 p-3.5 rounded-xl w-full text-[15px] outline-none focus:border-[#C8102E] transition-colors bg-white hover:border-gray-400"
                                />
                            </div>

                            <div className="w-full flex justify-center mt-3">
                                <button
                                    type="button"
                                    className="w-full max-w-[240px] bg-[#C8102E] hover:bg-[#A00D24] text-white font-bold text-[14px] py-3.5 rounded-none transition-colors uppercase tracking-wide cursor-pointer"
                                >
                                    Anfrage senden
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
