import React from 'react';

export default function ImpressumContent() {
    return (
        <div className="w-full max-w-[800px] text-[#374151]">
            <h1 
                className="text-4xl md:text-5xl font-black mb-10 text-[#1E293B]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
                Impressum
            </h1>

            <div className="space-y-8 text-[15px] leading-relaxed">
                {/* Intro Line */}
                <p>
                    Kammerjeager-Structon ist eine Marke der Kammerjeager-Structon.
                </p>

                {/* Company Details */}
                <div>
                    <p>Angaben gemäß § 5 DDG:</p>
                    <p className="mt-4">
                        Kammerjeager-Structon<br />
                        Drakestr 30<br />
                        12205 Berlin
                    </p>
                </div>

                {/* Contact Details */}
                <div>
                    <p>
                        Telefon: 0160 92376320<br />
                        E-Mail: <br />
                        Umsatzsteuer-ID: 
                    </p>
                </div>

                {/* Additional Contacts */}
                <div>
                    <p>
                        Aufträge: <br />
                        Presse-Anfragen: 
                    </p>
                </div>

                {/* Cooperation text */}
                <div>
                    <p>
                        Für Anfragen zu Aufträgen oder Kooperationen, senden Sie uns gern eine E-Mail an [].
                    </p>
                </div>

                {/* Register Details */}
                <div>
                    <p>Registereintrag Kammerjeager-Structon:</p>
                    <p>
                        Registergericht: <br />
                        Registernummer: <br />
                        Geschäftsführer: Yehor Kalchuk
                    </p>
                </div>

                {/* Legal Paragraphs */}
                <div className="pt-6 space-y-6">
                    <div>
                        <h3 className="font-bold text-[#1E293B] mb-2 text-lg">Urheberrechte</h3>
                        <p>
                            Der Inhalt einschließlich Bilder und die Gestaltung dieser Internetpräsenz sind urheberrechtlich geschützt. 
                            Jede vom Urheberrecht nicht zugelassene Verwertung, insbesondere Wiedergabe, Verarbeitung und Reproduktion 
                            bedarf der vorherigen schriftlichen Zustimmung des Diensteanbieters. Hiervon ausgenommen ist das auf dieser 
                            Internetpräsenz ausdrücklich für die Weiterverbreitung angebotene Text- und Bildmaterial.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#1E293B] mb-2 text-lg">Markenzeichen</h3>
                        <p>
                            Soweit nicht anders angegeben, sind alle auf dieser Internetpräsenz verwendeten Marken, Kennzeichen und 
                            geschäftliche Bezeichnungen markenrechtlich geschützt.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#1E293B] mb-2 text-lg">Haftung</h3>
                        <p>
                            Die Informationen, die auf dieser Webseite zur Verfügung gestellt werden, wurden mit größtmöglicher 
                            Sorgfalt zusammengestellt und werden laufend aktualisiert. Trotz sorgfältigster Kontrolle kann die 
                            Fehlerfreiheit nicht garantiert werden. Der Diensteanbieter schließt daher jede Haftung oder Garantie 
                            hinsichtlich der Genauigkeit, Vollständigkeit und Aktualität der auf dieser Webseite bereitgestellten 
                            Informationen aus. Der Diensteanbieter behält sich das Recht vor, jederzeit ohne Ankündigung, Änderungen 
                            oder Ergänzungen der bereitgestellten Informationen oder Daten vorzunehmen.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#1E293B] mb-2 text-lg">Verweise und Links</h3>
                        <p>
                            Für Webseiten, auf die mittels eines Links verwiesen wird, gilt Folgendes:
                            Es handelt sich dabei um fremde Webseiten, auf deren Inhalt kein Einfluss besteht. Der Diensteanbieter 
                            schließt daher eine Haftung für den Inhalt derartiger Seiten ausdrücklich aus. Für den Inhalt der 
                            verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. Der Diensteanbieter ist auch nicht 
                            verantwortlich für die Datenschutzvorkehrungen der Betreiber derartiger Webseiten.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
