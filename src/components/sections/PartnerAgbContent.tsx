import React from 'react';

export default function PartnerAgbContent() {
    return (
        <div className="w-full max-w-[800px] text-[#374151]">
            <h1 
                className="text-4xl md:text-5xl font-black mb-10 text-[#1E293B] uppercase tracking-tight"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
                AGB für Partner (Kooperationsbedingungen)
            </h1>

            <div className="space-y-8 text-[15px] leading-relaxed">
                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 1 Vertragsgegenstand</h3>
                    <p>
                        (1) Diese Allgemeinen Geschäftsbedingungen für Partner (nachfolgend <strong>"AGB-Partner"</strong>) gelten für alle Verträge zwischen dem Einzelunternehmen Yehor Kalchuk, Drakestr 30, 12205 Berlin (nachfolgend <strong>"Vermittler"</strong>) und gewerblichen Schädlingsbekämpfungsunternehmen (nachfolgend <strong>"Partner"</strong>).
                    </p>
                    <p className="mt-2">
                        (2) Gegenstand des Vertrages ist die entgeltliche Übermittlung von qualifizierten Kundenanfragen (sog. <strong>"Leads"</strong>) im Bereich der Schädlingsbekämpfung durch den Vermittler an den Partner.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 2 Pflichten des Partners</h3>
                    <p>
                        (1) Der Partner verpflichtet sich, erhaltene Leads unverzüglich (idealerweise innerhalb von 30 Minuten) zu kontaktieren.
                    </p>
                    <p className="mt-2">
                        (2) Der Partner sichert zu, dass er über alle erforderlichen behördlichen Erlaubnisse, die notwendige Sachkunde (z.B. IHK-Prüfung) sowie eine ausreichende Betriebshaftpflichtversicherung zur Durchführung von Schädlingsbekämpfungsmaßnahmen verfügt.
                    </p>
                    <p className="mt-2">
                        (3) Die Leistungserbringung gegenüber dem Endkunden sowie die Rechnungsstellung erfolgt ausschließlich durch den Partner im eigenen Namen und auf eigene Rechnung.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 3 Vergütung, Preise und Abrechnung</h3>
                    <p>
                        (1) Für jeden vom Vermittler an den Partner übermittelten und vom Partner akzeptierten Lead zahlt der Partner eine Vermittlungsprovision (Lead-Gebühr).
                    </p>
                    <p className="mt-2">
                        (2) Die Höhe der Lead-Gebühr richtet sich nach der aktuellen Preisliste oder der individuellen vertraglichen Vereinbarung.
                    </p>
                    <p className="mt-2">
                        (3) Die Abrechnung erfolgt wöchentlich oder monatlich. Die Zahlung erfolgt wahlweise per automatischer Belastung (SEPA-Lastschrift/Kreditkarte via Stripe) oder per Überweisung innerhalb von 7 Tagen nach Rechnungsstellung.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 4 Reklamation und Rückgabe von Leads</h3>
                    <p>
                        (1) Ein Lead kann vom Partner innerhalb von <strong>5 Werktagen</strong> nach Übermittlung reklamiert werden, sofern triftige Gründe vorliegen. 
                    </p>
                    <p className="mt-2">
                        (2) Anerkannte Reklamationsgründe sind ausschließlich:
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Die angegebenen Kontaktdaten (Telefonnummer, E-Mail) sind nachweislich ungültig.</li>
                            <li>Der Einsatzort liegt außerhalb des vom Partner angegebenen Einsatzgebietes.</li>
                            <li>Die Anfrage handelt sich offensichtlich um Spam oder einen Testanruf.</li>
                        </ul>
                    </p>
                    <p className="mt-2">
                        (3) Eine Reklamation aufgrund von reiner Konkurrenzsituation (Kunde hat sich für einen anderen Anbieter entschieden) oder mangelndem Abschlussgeschick des Partners ist ausgeschlossen.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 5 Qualität und Nachbesserungsgarantie</h3>
                    <p>
                        (1) Der Partner verpflichtet sich zur Einhaltung höchster Qualitäts- und Diskretionsstandards (HACCP-Konformität, neutrale Fahrzeuge).
                    </p>
                    <p className="mt-2">
                        (2) Der Vermittler bewirbt gegenüber Endkunden eine Zufriedenheits- bzw. Nachbesserungsgarantie. Sollte ein Endkunde berechtigte Mängel an der durchgeführten Schädlingsbekämpfung feststellen, verpflichtet sich der Partner, innerhalb der gesetzlichen Gewährleistungsfristen (in der Regel kostenfreie Nachbesserung innerhalb von 30 Tagen) tätig zu werden.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 6 Haftung und Freistellung</h3>
                    <p>
                        (1) Der Vermittler haftet gegenüber dem Partner nicht für das Zustandekommen eines Vertrages mit dem Endkunden oder die Bonität des Endkunden.
                    </p>
                    <p className="mt-2">
                        (2) Der Partner stellt den Vermittler von sämtlichen Ansprüchen Dritter (insbesondere von Endkunden) frei, die auf einer mangelhaften Leistungserbringung oder Pflichtverletzung durch den Partner beruhen.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 7 Schlussbestimmungen</h3>
                    <p>
                        (1) Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Berlin.
                    </p>
                    <p className="mt-2">
                        (2) Änderungen oder Ergänzungen dieser Bedingungen bedürfen der Schriftform.
                    </p>
                </div>
            </div>
        </div>
    );
}
