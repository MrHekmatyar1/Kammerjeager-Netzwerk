export type PricingResult = {
    type: 'free' | 'fixed' | 'percentage';
    label: string;
    value: string;
    numericValue: number; // For fixed (e.g. 60) or percentage (e.g. 0.20), 0 for free
};

export function getLeadPricing(
    schaedling: string | null,
    billingModel: string, // Default master billing model
    overrideType?: string | null,
    overrideValue?: number | null
): PricingResult {
    // 1. Check for overrides first
    if (overrideType === 'free') {
        return { type: 'free', label: 'Kostenlos', value: '0 €', numericValue: 0 };
    }
    if (overrideType === 'fixed' && overrideValue != null) {
        return { type: 'fixed', label: 'Fixpreis (Manuell)', value: `${overrideValue} €`, numericValue: overrideValue };
    }
    if (overrideType === 'percentage' && overrideValue != null) {
        return { type: 'percentage', label: 'Provision (Manuell)', value: `${overrideValue}%`, numericValue: overrideValue / 100 };
    }

    // 2. Default logic
    const defaultPricing: PricingResult = { type: 'percentage', label: 'Provision', value: '20%', numericValue: 0.20 };
    if (billingModel !== 'pay_per_lead') return defaultPricing;
    if (!schaedling) return defaultPricing;

    const s = schaedling.toLowerCase();
    if (s.includes('beratung') || s.includes('sonstige')) return defaultPricing;

    const fixedPrices: Record<string, number> = {
        'wespen': 35,
        'ameisen': 40,
        'flöhe': 50,
        'floh': 50,
        'mäuse': 60,
        'ratten': 60,
        'schaben': 60,
        'kakerlaken': 60,
        'marder': 70,
        'tauben': 70,
        'bettwanzen': 90,
    };

    for (const key of Object.keys(fixedPrices)) {
        if (s.includes(key)) {
            const price = fixedPrices[key] as number;
            return { type: 'fixed', label: 'Fixpreis', value: `${price} €`, numericValue: price };
        }
    }

    return defaultPricing;
}
