'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [captchaValue, setCaptchaValue] = useState('');
    const [leadData, setLeadData] = useState({ phone: '', name: 'ChatBot Lead', time: '' });

    const verifyCaptcha = () => {
        if (captchaValue === '5') setStep(3);
        else alert('Falsche Antwort. Bitte versuchen Sie es erneut.');
    };

    const handleFinalSubmit = async (selectedTime: string) => {
        setLoading(true);
        const finalData = {
            phone: leadData.phone,
            pest_type: `CHAT_BOT: Termin ${selectedTime}`, // Помечаем, что лид из чата
            plz: 'BERLIN_CHAT' // Заглушка, если в чате не спрашивали PLZ
        };

        try {
            const { error } = await supabase.from('leads').insert([finalData]);
            if (error) throw error;
            setStep(5);
        } catch (error: any) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed bottom-8 left-8 z-[9999] font-sans">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-[#C8102E] text-white flex items-center justify-center shadow-2xl border-2 border-black hover:bg-black transition-colors"
            >
                {isOpen ? (
                    <span className="text-2xl font-bold">✕</span>
                ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="fixed sm:absolute bottom-0 sm:bottom-20 left-0 w-full sm:w-[360px] h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[600px] bg-white border-t-[3px] sm:border-[3px] border-black shadow-none sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
                    <div className="bg-black text-white p-4 flex justify-between items-center shrink-0">
                        <div>
                            <h4 className="text-lg font-black uppercase italic tracking-tighter">System-Assistent</h4>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400">Status: Einsatzbereit</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="sm:hidden text-2xl">✕</button>
                    </div>

                    <div className="p-6 space-y-4 flex-grow overflow-y-auto bg-[#F5F5F5]">
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className="bg-white border border-gray-300 p-4 text-sm font-bold uppercase shadow-sm">
                                    Identifizieren Sie Ihr Problem. Benötigen Sie sofortige Hilfe?
                                </p>
                                <button
                                    onClick={() => setStep(2)}
                                    className="mt-4 w-full bg-[#C8102E] text-white py-4 sm:py-2 font-black uppercase hover:bg-black transition-all"
                                >
                                    JA, SOFORTIGE HILFE
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in fade-in duration-300 space-y-3">
                                <p className="text-xs font-bold uppercase text-gray-500">Sicherheitsprüfung:</p>
                                <p className="bg-white border border-gray-300 p-3 text-sm font-bold font-mono">Was ergibt 2 + 3?</p>
                                <input
                                    type="number"
                                    placeholder="Antwort"
                                    className="w-full border-2 border-black p-3 outline-none focus:bg-yellow-50"
                                    value={captchaValue}
                                    onChange={(e) => setCaptchaValue(e.target.value)}
                                />
                                <button
                                    onClick={verifyCaptcha}
                                    className="w-full bg-black text-white py-3 font-black uppercase"
                                >
                                    VERIFIZIEREN
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in duration-300 space-y-3">
                                <p className="bg-white border border-gray-300 p-3 text-sm font-bold uppercase italic">
                                    Geben Sie Ihre Telefonnummer an.
                                </p>
                                <input
                                    type="tel"
                                    placeholder="0151..."
                                    className="w-full border-2 border-black p-3 outline-none focus:bg-yellow-50"
                                    onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                                />
                                <button
                                    onClick={() => setStep(4)}
                                    className="w-full bg-[#C8102E] text-white py-3 font-black uppercase"
                                >
                                    WEITER
                                </button>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-in fade-in duration-300 space-y-3">
                                <p className="text-sm font-bold uppercase">Termin-Präferenz:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {['Heute', 'Morgen', 'Montag', 'Flexibel'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => handleFinalSubmit(t)}
                                            className="border-2 border-black p-4 sm:p-2 text-xs font-black uppercase hover:bg-black hover:text-white transition-all"
                                            disabled={loading}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="animate-in zoom-in duration-300 text-center py-12">
                                <div className="text-[#C8102E] font-black text-5xl mb-4 uppercase italic">OK.</div>
                                <p className="text-sm font-black uppercase leading-tight">
                                    Vorgang abgeschlossen. <br />Ein Techniker kontaktiert Sie in Kürze.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
