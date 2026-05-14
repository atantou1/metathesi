import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Default sender email using the verified domain
const FROM_EMAIL = process.env.EMAIL_FROM || 'metaThesi <noreply@metathesi.gr>';

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
            from: FROM_EMAIL,
            to: [email],
            subject: '🎉 Βρέθηκε Νέα αντιστοίχιση Μετάθεσης!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
                    <h2 style="color: #0369a1;">Συγχαρητήρια ${userName}!</h2>
                    <p>Μόλις βρέθηκε μια νέα αντιστοίχιση για την αίτηση μετάθεσής σας.</p>
                    
                    <div style="background-color: #f8fafc; border-left: 4px solid #0369a1; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                        <p style="margin: 0 0 8px 0;"><strong>Ονοματεπώνυμο:</strong> ${matchName}</p>
                        <p style="margin: 0;"><strong>Περιοχή Υπηρέτησης:</strong> ${matchZoneName}</p>
                    </div>

                    <p>Μπορείτε τώρα να συνδεθείτε στην πλατφόρμα, να ελέγξετε το προφίλ της αντιστοίχισης και να ξεκινήσετε άμεσα συζήτηση μέσω του <strong>Match Chat</strong>!</p>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/matches" style="background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
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

/**
 * Sends a verification email to a newly registered user.
 * @param email - The destination email address
 * @param token - The verification token
 */
export async function sendVerificationEmail(
    email: string,
    token: string
) {
    if (!resend) {
        console.warn('RESEND_API_KEY is not defined. Skipping verification email for:', email);
        return { success: false, error: 'API key missing' };
    }

    const confirmLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/new-verification?token=${token}`;

    if (process.env.NODE_ENV !== 'production') {
        console.log("-----------------------------------------");
        console.log(`[DEV MODE] Verification Link for ${email}:`);
        console.log(confirmLink);
        console.log("-----------------------------------------");
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [email],
            subject: '✅ Επιβεβαιώστε το email σας - metaThesi',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
                    <h2 style="color: #0369a1;">Καλώς ήρθατε στο metaThesi!</h2>
                    <p>Παρακαλούμε επιβεβαιώστε το email σας κάνοντας κλικ στον παρακάτω σύνδεσμο:</p>
                    
                    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
                        <a href="${confirmLink}" style="background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            Επιβεβαίωση Email
                        </a>
                    </div>
                    
                    <p>Αν δεν δημιουργήσατε εσείς αυτόν τον λογαριασμό, μπορείτε να αγνοήσετε αυτό το email.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Failed to send verification email with Resend:', error);
            return { success: false, error: error.message };
        }

        console.log(`Verification email sent successfully to ${email}`);
        return { success: true, data };
    } catch (err: any) {
        console.error('Unexpected error while sending verification email:', err);
        return { success: false, error: err.message || 'Unknown error' };
    }
}

/**
 * Sends a password reset email to a user.
 * @param email - The destination email address
 * @param token - The reset token
 */
export async function sendPasswordResetEmail(
    email: string,
    token: string
) {
    if (!resend) {
        console.warn('RESEND_API_KEY is not defined. Skipping password reset email for:', email);
        return { success: false, error: 'API key missing' };
    }

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    if (process.env.NODE_ENV !== 'production') {
        console.log("-----------------------------------------");
        console.log(`[DEV MODE] Password Reset Link for ${email}:`);
        console.log(resetLink);
        console.log("-----------------------------------------");
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [email],
            subject: '🔑 Επαναφορά κωδικού πρόσβασης - metaThesi',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
                    <h2 style="color: #0369a1;">Επαναφορά Κωδικού</h2>
                    <p>Λάβαμε ένα αίτημα για επαναφορά του κωδικού πρόσβασης για τον λογαριασμό σας.</p>
                    <p>Κάντε κλικ στον παρακάτω σύνδεσμο για να ορίσετε έναν νέο κωδικό:</p>
                    
                    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
                        <a href="${resetLink}" style="background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            Επαναφορά Κωδικού
                        </a>
                    </div>
                    
                    <p>Αν δεν ζητήσατε εσείς την επαναφορά, μπορείτε να αγνοήσετε αυτό το email. Ο σύνδεσμος θα λήξει σε 1 ώρα.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Failed to send password reset email with Resend:', error);
            return { success: false, error: error.message };
        }

        console.log(`Password reset email sent successfully to ${email}`);
        return { success: true, data };
    } catch (err: any) {
        console.error('Unexpected error while sending password reset email:', err);
        return { success: false, error: err.message || 'Unknown error' };
    }
}

/**
 * Sends an email notification to the admin for a new contact form inquiry.
 */
export async function sendContactInquiryEmail({
    name,
    email,
    subject,
    message,
    userId
}: {
    name: string;
    email: string;
    subject: string;
    message: string;
    userId?: number | null;
}) {
    if (!resend) {
        console.warn('RESEND_API_KEY is not defined. Skipping contact inquiry email.');
        return { success: false, error: 'API key missing' };
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'info@metathesi.gr';

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [adminEmail],
            subject: `📩 Νέο Μήνυμα: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #0369a1; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Νέο Μήνυμα Επικοινωνίας</h2>
                    </div>
                    
                    <div style="padding: 24px;">
                        <div style="margin-bottom: 20px;">
                            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Από</p>
                            <p style="margin: 4px 0 0 0; font-size: 16px;"><strong>${name}</strong> (${email})</p>
                            ${userId ? `<p style="margin: 4px 0 0 0; font-size: 13px; color: #0369a1;">Συνδεδεμένος Χρήστης (ID: ${userId})</p>` : ''}
                        </div>

                        <div style="margin-bottom: 20px;">
                            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Θέμα</p>
                            <p style="margin: 4px 0 0 0; font-size: 16px;">${subject}</p>
                        </div>

                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #f1f5f9;">
                            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">Μήνυμα</p>
                            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
                        </div>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
                        Αυτό είναι ένα αυτοματοποιημένο μήνυμα από την πλατφόρμα metaThesi.
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Failed to send contact inquiry email with Resend:', error);
            return { success: false, error };
        }

        console.log(`Contact inquiry email sent successfully to admin: ${adminEmail}`);
        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error while sending contact email:', err);
        return { success: false, error: err };
    }
}
