import React from 'react';

export default function AgbContent() {
    return (
        <div className="w-full max-w-[800px] text-[#374151]">
            <h1 
                className="text-4xl md:text-5xl font-black mb-10 text-[#1E293B] uppercase tracking-tight"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
                Allgemeine Geschäftsbedingungen (AGB)
            </h1>

            <div className="space-y-8 text-[15px] leading-relaxed">
                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 1 Geltungsbereich und Anbieter</h3>
                    <p>
                        (1) Diese Allgemeinen Geschäftsbedingungen gelten für alle Vermittlungsleistungen, die über die Website <span className="font-medium">Kammerjäger Structon</span>, betrieben durch das Einzelunternehmen Yehor Kalchuk, Drakestr 30, 12205 Berlin (nachfolgend <strong>"Vermittler"</strong> oder "wir" genannt), an Verbraucher und Unternehmer (nachfolgend <strong>"Kunde"</strong> genannt) erbracht werden.
                    </p>
                    <p className="mt-2">
                        (2) Abweichende, entgegenstehende oder ergänzende AGB des Kunden werden nur dann Vertragsbestandteil, wenn wir ihrer Geltung ausdrücklich zugestimmt haben.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 2 Leistung des Vermittlers (Reine Vermittlung)</h3>
                    <p>
                        (1) Der Vermittler betreibt eine Plattform zur Kontaktanbahnung zwischen Kunden, die Schädlingsbekämpfungsleistungen suchen, und qualifizierten, regionalen Schädlingsbekämpfern (nachfolgend <strong>"Partner"</strong>).
                    </p>
                    <p className="mt-2 text-[#C8102E] font-medium">
                        (2) Der Vermittler führt selbst keine Schädlingsbekämpfungsarbeiten oder handwerklichen Leistungen aus. 
                    </p>
                    <p className="mt-2">
                        (3) Sobald ein Kunde eine Anfrage über die Website stellt, leitet der Vermittler diese Anfrage an einen passenden Partner weiter. Der eigentliche Vertrag über die Dienstleistung (Werkvertrag/Dienstvertrag) kommt <strong className="underline">ausschließlich zwischen dem Kunden und dem beauftragten Partnerunternehmen</strong> zustande. 
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 3 Kosten und Vertragsabschluss</h3>
                    <p>
                        (1) Die Nutzung der Plattform und die Vermittlung an ein Partnerunternehmen sind für den Kunden <strong>vollständig kostenfrei</strong>. 
                    </p>
                    <p className="mt-2">
                        (2) Die Kosten für die eigentliche Schädlingsbekämpfung (inklusive etwaiger Anfahrtskosten oder Wochenendzuschläge) berechnet sich nach der Preisgestaltung des jeweiligen Partners. Ein verbindlicher Kostenvoranschlag oder Preis wird direkt durch den Partner vor Ort oder telefonisch mitgeteilt. Der Kunde hat stets das Recht, den Vertrag mit dem Partner nicht abzuschließen.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 4 Haftungsbeschränkung des Vermittlers</h3>
                    <p>
                        (1) Der Vermittler haftet nicht für die ordnungsgemäße Durchführung der vom Partner erbrachten Schädlingsbekämpfung. Für Leistungsstörungen, Schlechtleistung, Sach- oder Personenschäden im Rahmen des Hauptvertrages haftet ausschließlich das ausführende Partnerunternehmen.
                    </p>
                    <p className="mt-2">
                        (2) Der Vermittler haftet lediglich für Schäden, die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung der Vermittlungstätigkeit beruhen, nach den gesetzlichen Bestimmungen. Für leichte Fahrlässigkeit haftet der Vermittler nur bei Verletzung wesentlicher Vertragspflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 5 Datenschutz</h3>
                    <p>
                        Der Vermittler erhebt, verarbeitet und nutzt personenbezogene Daten der Kunden nach Maßgabe der gesetzlichen Datenschutzbestimmungen (DSGVO). Die vollständige Datenschutzerklärung findet sich unter unserem Menüpunkt "Datenschutz". Durch die Absendung der Anfrage willigt der Kunde ein, dass seine Kontaktdaten zwecks Auftragserfüllung an regionale Partner weitergegeben werden.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">§ 6 Schlussbestimmungen</h3>
                    <p>
                        (1) Es gilt das Recht der Bundesrepublik Deutschland.
                    </p>
                    <p className="mt-2">
                        (2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt die einschlägige gesetzliche Regelung.
                    </p>
                </div>
            </div>
        </div>
    );
}
