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
    const [step, setStep] = useState(1);

    return (
        <div className="w-full">
            {step === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PESTS_DATA.map((p) => (
                        <PestCard key={p.id} p={p} onClick={() => setStep(2)} />
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="text-center py-10">
                    <h3 className="text-xl font-bold mb-6">Postleitzahl eingeben</h3>
                    <input
                        type="text"
                        placeholder="PLZ"
                        className="border-2 border-gray-100 p-4 rounded-xl w-full max-w-xs text-center font-bold text-lg outline-none focus:border-[#C8102E]"
                    />
                </div>
            )}
        </div>
    );
}
