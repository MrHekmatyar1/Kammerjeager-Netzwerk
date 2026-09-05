export interface Service {
    name: string;
    slug: string;
    description: string;
    shortName: string;
}

export const SERVICES: Service[] = [
    { 
        name: 'Wespennest entfernen', 
        slug: 'wespennest-entfernen', 
        description: 'Professionelle und sichere Entfernung von Wespennestern.',
        shortName: 'Wespen'
    },
    { 
        name: 'Bettwanzen bekämpfen', 
        slug: 'bettwanzen-bekaempfen', 
        description: 'Effektive und nachhaltige Bekämpfung von Bettwanzen in Schlafräumen.',
        shortName: 'Bettwanzen'
    },
    { 
        name: 'Ratten bekämpfen', 
        slug: 'ratten-bekaempfen', 
        description: 'Diskrete und schnelle Rattenbekämpfung für private und gewerbliche Objekte.',
        shortName: 'Ratten'
    },
    { 
        name: 'Mäuse bekämpfen', 
        slug: 'maeuse-bekaempfen', 
        description: 'Zuverlässige Lösung gegen Mäusebefall in Haus, Keller und Gewerbe.',
        shortName: 'Mäuse'
    },
    { 
        name: 'Schaben & Kakerlaken bekämpfen', 
        slug: 'schaben-bekaempfen', 
        description: 'Gründliche Beseitigung von Schaben und Kakerlaken (inkl. HACCP für Gewerbe).',
        shortName: 'Schaben'
    },
    { 
        name: 'Ameisen bekämpfen', 
        slug: 'ameisen-bekaempfen', 
        description: 'Nachhaltige Vernichtung von Ameisenstraßen und Nestern im Haus und Garten.',
        shortName: 'Ameisen'
    },
    { 
        name: 'Marder vertreiben', 
        slug: 'marder-vertreiben', 
        description: 'Tierschutzgerechte Marderabwehr vom Dachboden und aus dem Haus.',
        shortName: 'Marder'
    },
    { 
        name: 'Taubenabwehr', 
        slug: 'taubenabwehr', 
        description: 'Montage von Spikes, Netzen und anderen effektiven Taubenabwehr-Systemen.',
        shortName: 'Tauben'
    },
];
