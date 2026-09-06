import { Resend } from 'resend';

// Если ключ отсутствует, мы используем fallback-режим
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Эмейл, на который будут приходить уведомления о заявках
const ADMIN_EMAIL = 'edorkalchuk@gmail.com';

// Отправитель. Пока домен не подтвержден в Resend, можно использовать только тестовый адрес
const FROM_EMAIL = 'onboarding@resend.dev';

// ─── Уведомление партнёру о новом лиде ────────────────────────────────────
export async function sendPartnerLeadNotification(partnerEmail: string, partnerName: string, lead: any) {
    const subject = `Neuer Auftrag: ${lead.schaedling || 'Schädlingsbekämpfung'} in ${lead.plz}`;

    const html = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">

            <!-- Header -->
            <div style="background: #0f172a; padding: 28px 32px; text-align: center;">
                <div style="font-size: 13px; color: #94a3b8; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;">Kammerjäger Structon</div>
                <div style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">Neuer Auftrag für Sie!</div>
            </div>

            <!-- Urgency banner -->
            <div style="background: #C8102E; padding: 12px 32px; text-align: center;">
                <span style="color: #fff; font-weight: 700; font-size: 15px;">Bitte reagieren Sie schnell — Aufträge werden direkt vergeben!</span>
            </div>

            <!-- Body -->
            <div style="padding: 32px;">
                <p style="font-size: 16px; color: #1e293b; margin: 0 0 24px; line-height: 1.6;">
                    Hallo <strong>${partnerName || 'Partner'}</strong>,<br>
                    ein neuer qualifizierter Auftrag wurde Ihnen zugewiesen.
                </p>

                <!-- Lead details card -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
                    <div style="font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px;">Auftragsdetails</div>

                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; width: 40%; font-weight: 600;">Schädling</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 700;">
                                <span style="background: #fef2f2; color: #C8102E; padding: 2px 10px; border-radius: 20px; font-size: 13px;">${lead.schaedling || 'Nicht angegeben'}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">PLZ / Ort</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 700;">${lead.plz}${lead.strasse ? ` · ${lead.strasse} ${lead.hausnummer || ''}` : ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">Kundentyp</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a;">${lead.kunde_typ || '-'} ${lead.objekt_typ ? `(${lead.objekt_typ})` : ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 600;">Befall / Räume</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a;">${lead.befall || '-'} ${lead.raeume ? `· ${lead.raeume} Räume` : ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Zugang</td>
                            <td style="padding: 8px 0; font-size: 14px; color: #0f172a;">${lead.zugang || 'Normal'} ${lead.zugang_beschreibung ? `· ${lead.zugang_beschreibung}` : ''}</td>
                        </tr>
                    </table>
                </div>

                <!-- CTA -->
                <div style="text-align: center; margin-bottom: 24px;">
                    <a href="https://kammerjaeger-structon.de/api/partner/leads/accept-from-email?lead_id=${lead.id}&master_id=${lead.master_id}" style="display: inline-block; background: #C8102E; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 700; font-size: 15px; letter-spacing: 0.05em;">
                        Auftrag jetzt annehmen
                    </a>
                </div>

                <p style="font-size: 13px; color: #94a3b8; text-align: center; margin: 0;">
                    <em>Haben Sie versehentlich geklickt?</em><br>
                    Keine Sorge! Sie können den Auftrag innerhalb von 10 Minuten in Ihrem Dashboard stornieren. Der Kunde wird erst danach informiert.
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">kammerjaeger-structon.de · Automatische Benachrichtigung · Bitte nicht antworten</p>
            </div>
        </div>
    `;

    if (!resend) {
        console.log('--- [EMAIL FALLBACK] PARTNER NOTIFICATION ---');
        console.log(`TO: ${partnerEmail}`);
        console.log(`SUBJECT: ${subject}`);
        return { success: true, fallback: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: partnerEmail,
            subject,
            html,
        });
        if (error) { console.error('[Resend Partner] Error:', error); return { success: false, error }; }
        return { success: true, data };
    } catch (err) {
        console.error('[Resend Partner] Exception:', err);
        return { success: false, error: err };
    }
}

// ─── Email клиенту при принятии заказа партнёром ──────────────────────────
export async function sendClientStatusUpdate(lead: any, partnerName?: string, delayMinutes: number = 0) {
    if (!lead.email) return { success: false, error: 'No customer email' };

    const subject = 'Ihr Experte ist gefunden! – Kammerjäger Structon';

    const html = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: #0f172a; padding: 28px 32px; text-align: center;">
                <div style="font-size: 13px; color: #94a3b8; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;">Kammerjäger Structon</div>
                <div style="font-size: 22px; font-weight: 900; color: #ffffff;">Ihr Experte ist unterwegs!</div>
            </div>
            <div style="padding: 32px;">
                <p style="font-size: 16px; color: #1e293b; margin: 0 0 20px; line-height: 1.6;">
                    Hallo <strong>${lead.name}</strong>,<br>
                    ein zertifizierter Schädlingsbekämpfer${partnerName ? ` (<strong>${partnerName}</strong>)` : ''} hat Ihren Auftrag angenommen und wird sich <strong>in Kürze bei Ihnen melden</strong>.
                </p>
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <div style="font-weight: 700; color: #166534; margin-bottom: 8px;">Was passiert als nächstes?</div>
                    <p style="color: #15803d; font-size: 14px; margin: 0; line-height: 1.7;">
                        Der Experte wird Sie unter <strong>${lead.telefon}</strong> kontaktieren, um einen Termin zu vereinbaren und alle Details zu besprechen.
                    </p>
                </div>
                <p style="font-size: 13px; color: #64748b; line-height: 1.7; margin: 0;">
                    Bei Fragen oder Änderungswünschen wenden Sie sich bitte an unser Team.<br>
                    <strong>Kammerjäger Structon</strong> – Ihr Partner für schnelle Schädlingsbekämpfung.
                </p>
            </div>
            <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">kammerjaeger-structon.de · Automatische Benachrichtigung</p>
            </div>
        </div>
    `;

    if (!resend) {
        console.log('--- [EMAIL FALLBACK] CLIENT STATUS UPDATE ---');
        console.log(`TO: ${lead.email}`);
        return { success: true, fallback: true };
    }

    try {
        const payload: any = { from: FROM_EMAIL, to: lead.email, subject, html };
        
        if (delayMinutes > 0) {
            // Calculate scheduled_at ISO8601 string in UTC
            const scheduledDate = new Date(Date.now() + delayMinutes * 60 * 1000);
            payload.scheduled_at = scheduledDate.toISOString();
        }

        const { data, error } = await resend.emails.send(payload);
        if (error) { console.error('[Resend ClientStatus] Error:', error); return { success: false, error }; }
        return { success: true, data };
    } catch (err) {
        console.error('[Resend ClientStatus] Exception:', err);
        return { success: false, error: err };
    }
}

export async function cancelScheduledEmail(emailId: string) {
    if (!resend) return { success: true };
    try {
        await resend.emails.cancel(emailId);
        return { success: true };
    } catch (err) {
        console.error('[Resend Cancel] Exception:', err);
        return { success: false, error: err };
    }
}

export async function sendAdminNotification(lead: any) {
    const isB2B = lead.kunde_typ === 'B2B' || lead.kunde_typ === 'Firmenkunde' || lead.kunde_typ === 'Öffentlicher Sektor' || !!lead.firma;
    const subject = isB2B
        ? `B2B-ANFRAGE: ${lead.firma || lead.name} (${lead.schaedling || 'Gewerbe'}) in ${lead.plz}`
        : `NEUER LEAD: ${lead.schaedling || 'Schädlingsbekämpfung'} in ${lead.plz}`;
    
    const html = isB2B ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background: #1e293b; color: #ffffff; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">Neue B2B-Anfrage (Gewerbe / Firma / Cafe)</h2>
            </div>
            <div style="padding: 24px;">
                <p><strong>Firma / Betrieb:</strong> ${lead.firma || 'Nicht angegeben'}</p>
                <p><strong>Ansprechpartner:</strong> ${lead.name}</p>
                <p><strong>Branche / Objekt:</strong> ${lead.objekt_typ || '-'}</p>
                <p><strong>Schädling / Bedarf:</strong> ${lead.schaedling || '-'}</p>
                <p><strong>Telefon:</strong> <a href="tel:${lead.telefon}">${lead.telefon}</a></p>
                <p><strong>E-Mail:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
                <p><strong>PLZ / Ort:</strong> ${lead.plz}</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
                <p><strong>Nachricht / Details:</strong></p>
                <p style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${lead.zugang_beschreibung || 'Keine zusätzliche Nachricht angegeben.'}</p>
                <div style="margin-top: 24px; text-align: center;">
                    <a href="https://kammerjaeger-structon.de/admin" style="display: inline-block; background: #C8102E; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Im Admin Dashboard öffnen
                    </a>
                </div>
            </div>
        </div>
    ` : `
        <h2>Neue Kundenanfrage</h2>
        <p><strong>PLZ/Ort:</strong> ${lead.plz}</p>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Telefon:</strong> ${lead.telefon}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Firma:</strong> ${lead.firma || '-'}</p>
        <hr />
        <p><strong>Schädling:</strong> ${lead.schaedling || '-'}</p>
        <p><strong>Räume:</strong> ${lead.raeume || '-'}</p>
        <p><strong>Befall:</strong> ${lead.befall || '-'}</p>
        <p><strong>Zugang:</strong> ${lead.zugang || '-'}</p>
        <p><strong>Beschreibung:</strong> ${lead.zugang_beschreibung || '-'}</p>
        <br />
        <p style="font-size: 10px; color: #aaaaaa;">kammerjaeger-structon.de</p>
    `;

    if (!resend) {
        console.log('--- [EMAIL FALLBACK] ADMIN NOTIFICATION ---');
        console.log(`TO: ${ADMIN_EMAIL}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(html);
        console.log('-------------------------------------------');
        return { success: true, fallback: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject,
            html,
        });

        if (error) {
            console.error('[Resend Admin] Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('[Resend Admin] Exception:', err);
        return { success: false, error: err };
    }
}

export async function sendCustomerConfirmation(lead: any) {
    if (!lead.email) return { success: false, error: 'No customer email' };

    const isB2B = lead.kunde_typ === 'B2B' || lead.kunde_typ === 'Firmenkunde' || lead.kunde_typ === 'Öffentlicher Sektor' || !!lead.firma;
    const subject = isB2B
        ? 'Ihre B2B-Anfrage bei Kammerjäger Structon'
        : 'Ihre Anfrage bei Kammerjäger Structon';
    
    const html = isB2B ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #C8102E;">Vielen Dank für Ihre Geschäftskunden-Anfrage!</h2>
            <p>Hallo <strong>${lead.name}</strong>,</p>
            <p>wir haben Ihre Anfrage für <strong>${lead.firma || 'Ihr Unternehmen'}</strong> zum Thema <strong>${lead.schaedling || 'Schädlingsschutz'}</strong> erfolgreich entgegengenommen.</p>
            <p>Unser B2B-Team wird sich zeitnah telefonisch unter <strong>${lead.telefon}</strong> bei Ihnen melden, um die Situation diskret abzustimmen und eine maßgeschneiderte Lösung anzubieten.</p>
            <br />
            <p>Mit freundlichen Grüßen,</p>
            <p><strong>Ihr Kammerjäger Structon Team</strong></p>
        </div>
    ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #C8102E;">Vielen Dank für Ihre Anfrage, ${lead.name}!</h2>
            <p>Wir haben Ihr Problem mit <strong>${lead.schaedling || 'Schädlingen'}</strong> in unserem System erfasst.</p>
            <p>Einer unserer zertifizierten Experten in Ihrer Nähe wird sich in Kürze unter der Telefonnummer <strong>${lead.telefon}</strong> bei Ihnen melden, um die Details und den Preis zu besprechen.</p>
            <p>Sollten Sie sofortige Hilfe benötigen, sind wir 24/7 für Sie da.</p>
            <br />
            <p>Mit freundlichen Grüßen,</p>
            <p><strong>Ihr Kammerjäger Structon Team</strong></p>
        </div>
    `;

    if (!resend) {
        console.log('--- [EMAIL FALLBACK] CUSTOMER CONFIRMATION ---');
        console.log(`TO: ${lead.email}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(html);
        console.log('----------------------------------------------');
        return { success: true, fallback: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: lead.email,
            subject,
            html,
        });

        if (error) {
            console.error('[Resend Customer] Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('[Resend Customer] Exception:', err);
        return { success: false, error: err };
    }
}

// ─── Email мастеру со ссылкой на завершение заказа ──────────────────────────
export async function sendCompletionLinkEmail(partnerEmail: string, partnerName: string, lead: any) {
    const subject = `Auftrag abschließen: ${lead.schaedling || 'Schädlingsbekämpfung'} in ${lead.plz}`;

    const html = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: #0f172a; padding: 28px 32px; text-align: center;">
                <div style="font-size: 13px; color: #94a3b8; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;">Kammerjäger Structon</div>
                <div style="font-size: 22px; font-weight: 900; color: #ffffff;">Bitte bestätigen Sie den Abschluss</div>
            </div>
            <div style="padding: 32px;">
                <p style="font-size: 16px; color: #1e293b; margin: 0 0 24px; line-height: 1.6;">
                    Hallo <strong>${partnerName}</strong>,<br>
                    Sie haben kürzlich den Auftrag in <strong>${lead.plz}</strong> übernommen. 
                    Sobald Sie die Arbeit vor Ort abgeschlossen haben, bestätigen Sie dies bitte über den untenstehenden Button.
                </p>

                <div style="text-align: center; margin-bottom: 24px;">
                    <a href="https://kammerjaeger-structon.de/partner/confirm/${lead.id}" style="display: inline-block; background: #C8102E; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 700; font-size: 15px; letter-spacing: 0.05em;">
                        Auftrag jetzt abschließen
                    </a>
                </div>

                <p style="font-size: 13px; color: #94a3b8; text-align: center; margin: 0;">
                    <em>Hinweis:</em> Bei Provisions-Leads werden Sie im nächsten Schritt nach dem Rechnungsbetrag gefragt.
                </p>
            </div>
            <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">kammerjaeger-structon.de · Automatische Benachrichtigung</p>
            </div>
        </div>
    `;

    if (!resend) {
        console.log('--- [EMAIL FALLBACK] COMPLETION LINK NOTIFICATION ---');
        console.log(`TO: ${partnerEmail}`);
        console.log(`SUBJECT: ${subject}`);
        return { success: true, fallback: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: partnerEmail,
            subject,
            html,
        });
        if (error) { console.error('[Resend Completion Link] Error:', error); return { success: false, error }; }
        return { success: true, data };
    } catch (err) {
        console.error('[Resend Completion Link] Exception:', err);
        return { success: false, error: err };
    }
}

// ─── Email мастеру об изменении данных/времени заказа клиентом ─────────────
export async function sendTerminUpdateEmail(partnerEmail: string, partnerName: string, lead: any) {
    const subject = `Termin / Daten aktualisiert: ${lead.plz}`;

    const terminText = lead.termin_time 
        ? new Date(lead.termin_time).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) + ' Uhr'
        : 'Noch nicht festgelegt';

    const html = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: #0f172a; padding: 28px 32px; text-align: center;">
                <div style="font-size: 13px; color: #94a3b8; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;">Kammerjäger Structon</div>
                <div style="font-size: 22px; font-weight: 900; color: #ffffff;">Auftragsdaten aktualisiert</div>
            </div>
            <div style="padding: 32px;">
                <p style="font-size: 16px; color: #1e293b; margin: 0 0 24px; line-height: 1.6;">
                    Hallo <strong>${partnerName}</strong>,<br>
                    der Kunde für den Auftrag in <strong>${lead.plz}</strong> hat seine Daten oder den gewünschten Termin aktualisiert.
                </p>

                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #475569;"><strong>Neuer Termin:</strong> ${terminText}</p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #475569;"><strong>Kunde:</strong> ${lead.name}</p>
                    <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Telefon:</strong> <a href="tel:${lead.telefon}" style="color: #1d4ed8; text-decoration: none;">${lead.telefon}</a></p>
                </div>

                <div style="text-align: center;">
                    <a href="https://kammerjaeger-structon.de/dashboard/orders" style="display: inline-block; background: #C8102E; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 700; font-size: 14px;">
                        Zum Dashboard
                    </a>
                </div>
            </div>
        </div>
    `;

    if (!resend) {
        console.log('--- [EMAIL FALLBACK] TERMIN UPDATE NOTIFICATION ---');
        console.log(`TO: ${partnerEmail}`);
        console.log(`SUBJECT: ${subject}`);
        return { success: true, fallback: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: partnerEmail,
            subject,
            html,
        });
        if (error) { console.error('[Resend Termin Update] Error:', error); return { success: false, error }; }
        return { success: true, data };
    } catch (err) {
        console.error('[Resend Termin Update] Exception:', err);
        return { success: false, error: err };
    }
}
