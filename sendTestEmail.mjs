import { Resend } from 'resend';

const resend = new Resend('re_PugEdqU8_5oED8UVCuGn1agD7qSJWitMA');
const email = 'edorkalchuk@gmail.com';

const testLead = {
    plz: '10115',
    name: 'Yehor Test',
    telefon: '+49 174 1234567',
    email: 'asus017447@gmail.com',
    firma: '-',
    schaedling: 'Bettwanzen (Клопы)',
    raeume: '2 Zimmer',
    befall: 'Schwer',
    zugang: 'Heute',
    zugang_beschreibung: 'Bitte rufen Sie vorher an.'
};

async function sendTest() {
    console.log('Sending ADMIN notification to:', email);
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `NEUER TEST LEAD: ${testLead.schaedling} in ${testLead.plz}`,
            html: `
                <h2>Neue Kundenanfrage (TEST)</h2>
                <p><strong>PLZ/Ort:</strong> ${testLead.plz}</p>
                <p><strong>Name:</strong> ${testLead.name}</p>
                <p><strong>Telefon:</strong> ${testLead.telefon}</p>
                <p><strong>Email:</strong> ${testLead.email}</p>
                <p><strong>Firma:</strong> ${testLead.firma || '-'}</p>
                <hr />
                <p><strong>Schädling:</strong> ${testLead.schaedling || '-'}</p>
                <p><strong>Räume:</strong> ${testLead.raeume || '-'}</p>
                <p><strong>Befall:</strong> ${testLead.befall || '-'}</p>
                <p><strong>Zugang:</strong> ${testLead.zugang || '-'}</p>
                <p><strong>Beschreibung:</strong> ${testLead.zugang_beschreibung || '-'}</p>
                <br />
                <p style="font-size: 10px; color: #aaaaaa;">Влад лох</p>
            `,
        });

        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Success! Admin Email ID:', data.id);
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

sendTest();
