'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function DatenschutzContent() {
    const router = useRouter();

    return (
        <div className="w-full max-w-[800px] text-[#374151] relative">
            <div className="flex items-center justify-between gap-4 mb-10 border-b border-slate-100 pb-4">
                <h1 
                    className="text-4xl md:text-5xl font-black text-[#1E293B] uppercase tracking-tight m-0"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                    Datenschutzerklärung
                </h1>
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent border border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex-shrink-0 translate-x-2 md:translate-x-4"
                    aria-label="Zurück"
                    title="Zurück"
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div className="space-y-8 text-[15px] leading-relaxed">
                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">1. Datenschutz auf einen Blick</h3>
                    <p className="mb-2"><strong>Allgemeine Hinweise</strong></p>
                    <p>
                        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">2. Allgemeine Hinweise und Pflichtinformationen</h3>
                    <p className="mb-2"><strong>Datenschutz</strong></p>
                    <p>
                        Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.
                        Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. 
                    </p>
                    
                    <p className="mt-4 mb-2"><strong>Hinweis zur verantwortlichen Stelle</strong></p>
                    <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                    <p className="mt-2 font-medium">
                        Kammerjeager-Structon (Einzelunternehmen)<br />
                        Yehor Kalchuk<br />
                        Drakestr 30<br />
                        12205 Berlin<br />
                        <br />
                        Telefon: 0160 92376320<br />
                        E-Mail: kontakt@kammerjaeger-structon.de
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">3. Datenerfassung auf dieser Website (Formulare & ChatBot)</h3>
                    <p>
                        Wenn Sie uns per Kontaktformular, Lead-Assistent oder über unseren ChatBot Anfragen zukommen lassen, werden Ihre Angaben inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. 
                        Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">4. Weitergabe von Daten an Subunternehmer / Partner (Vermittlung)</h3>
                    <p>
                        Kammerjäger Structon fungiert primär als Vermittlungsplattform. Zur Erledigung der von Ihnen angefragten Schädlingsbekämpfungsdienstleistungen geben wir die dafür notwendigen Daten (wie Name, Telefonnummer, Adresse, Postleitzahl und Art des Schädlings) an regionale, zertifizierte Partner-Unternehmen weiter.
                    </p>
                    <p className="mt-2">
                        Diese Weitergabe erfolgt ausschließlich zum Zweck der Vertragsanbahnung und Erfüllung der angefragten Dienstleistung. Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b DSGVO. Unsere Partnerunternehmen sind rechtlich zur Einhaltung der Datenschutzvorgaben (DSGVO) verpflichtet und dürfen Ihre Daten ausschließlich zur Bearbeitung Ihres Auftrags nutzen.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">5. Server-Log-Dateien</h3>
                    <p>
                        Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-[#1E293B] mb-2 text-lg">6. Ihre Rechte (Auskunft, Löschung, Berichtigung)</h3>
                    <p>
                        Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
                    </p>
                </div>
            </div>
        </div>
    );
}
