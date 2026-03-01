import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Sends a notification email to a user when they get a new match.
 * @param email - The destination email address
 * @param userName - The name of the user receiving the email
 * @param matchName - The name of the person they matched with
 * @param matchZoneName - The target posting zone of the new match
 */
export async function sendMatchEmail({
    email,
    userName,
    matchName,
    matchZoneName
}: {
    email: string;
    userName: string;
    matchName: string;
    matchZoneName: string;
}) {
    if (!resend) {
        console.warn('RESEND_API_KEY is not defined. Skipping match email for:', email);
        return { success: false, error: 'API key missing' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'metaThesi <noreply@resend.dev>', // Update this to verified domain when going to prod
            to: [email],
            subject: '🎉 Βρέθηκε Νέο Ταίριασμα Μετάθεσης!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
                    <h2 style="color: #0ea5e9;">Συγχαρητήρια ${userName}!</h2>
                    <p>Μόλις βρέθηκε ένα νέο ταίριασμα για την αίτηση μετάθεσής σας.</p>
                    
                    <div style="background-color: #f8fafc; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                        <p style="margin: 0 0 8px 0;"><strong>Ονοματεπώνυμο:</strong> ${matchName}</p>
                        <p style="margin: 0;"><strong>Περιοχή Υπηρέτησης:</strong> ${matchZoneName}</p>
                    </div>

                    <p>Μπορείτε τώρα να συνδεθείτε στην πλατφόρμα, να ελέγξετε το προφίλ της αντιστοίχισης και να ξεκινήσετε άμεσα συζήτηση μέσω του <strong>Match Chat</strong>!</p>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/matches" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            Προβολή Αντιστοίχισης
                        </a>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Failed to send email with Resend:', error);
            return { success: false, error };
        }

        console.log(`Match email sent successfully to ${email}`);
        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error while sending email:', err);
        return { success: false, error: err };
    }
}
