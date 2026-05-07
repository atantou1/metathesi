"use server"

import { AuthError } from "next-auth"
import { signUpSchema, SignUpValues, loginSchema, LoginValues, resetPasswordSchema, ResetPasswordValues, newPasswordSchema, NewPasswordValues } from "@/lib/schemas"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { signIn } from "@/auth"
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens"
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/emails"

async function verifyTurnstile(token: string | undefined) {
    if (!token) return false;
    if (!process.env.TURNSTILE_SECRET_KEY) return true;
    
    try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`
        });
        const verifyData = await verifyRes.json();
        return verifyData.success;
    } catch {
        return false;
    }
}

export async function loginWithProvider(provider: 'google' | 'facebook') {
    await signIn(provider, { redirectTo: "/dashboard" })
}

export async function login(values: LoginValues) {
    const validatedFields = loginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Μη έγκυρα δεδομένα." }
    }

    const { email, password, recaptchaToken: turnstileToken } = validatedFields.data

    const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true }
    });

    const redirectTo = (user?.role === "ADMIN" || user?.role === "SUPERADMIN") 
        ? "/admin" 
        : "/dashboard";

    try {
        console.log(`Attempting login for: ${email}`);
        await signIn("credentials", {
            email,
            password,
            recaptchaToken: turnstileToken,
            redirectTo,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            // NextAuth wraps our thrown errors inside the cause property for CallbackRouteError
            const errorMsg = error.cause?.err?.message || error.message;

            if (errorMsg === "Email not verified") {
                return { error: "Λάθος email ή κωδικός." }
            }
            if (errorMsg?.includes("έχει κλειδωθεί") || errorMsg?.includes("αποκλειστεί") || errorMsg?.includes("Turnstile")) {
                return { error: errorMsg }
            }
            if (errorMsg === "Invalid credentials" || error.type === "CredentialsSignin") {
                return { error: "Λάθος email ή κωδικός." }
            }
            return { error: "Κάτι πήγε στραβά." }
        }

        // If it's a redirect error, rethrow it so Next.js can handle the redirect
        if ((error as Error).message.includes("NEXT_REDIRECT")) {
            throw error;
        }
        throw error
    }
}

export async function signUp(values: SignUpValues) {
    const validatedFields = signUpSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Μη έγκυρα δεδομένα." }
    }

    const { fullName, email, password, recaptchaToken: turnstileToken } = validatedFields.data
    
    const isHuman = await verifyTurnstile(turnstileToken)
    if (!isHuman) {
        return { error: "Αποτυχία επαλήθευσης Turnstile (Πιθανό Bot)." }
    }

    // Use the part before @ as a default name if none provided
    const userFullName = fullName || email.split('@')[0]

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        // Return same success message as new registration to avoid enumeration
        return { success: "Επιβεβαιώστε το email σας!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            fullName: userFullName,
            email,
            passwordHash: hashedPassword,
        },
    })

    // Instead of signing in immediately, generate the verification token and send the email
    try {
        const verificationToken = await generateVerificationToken(email);
        const emailResult = await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        if (!emailResult?.success) {
            // Include specific Resend error message so user knows why it failed
            return { error: `Η εγγραφή έγινε, αλλά το email απέτυχε: ${emailResult?.error}` };
        }

        return { success: "Επιβεβαιώστε το email σας!" };
    } catch (error) {
        console.error("Failed to generate or send verification token:", error);
        return { error: "Η εγγραφή έγινε, αλλά η αποστολή email επιβεβαίωσης απέτυχε." };
    }
}

export async function requestPasswordReset(values: ResetPasswordValues) {
    console.log("requestPasswordReset called with:", values)
    const validatedFields = resetPasswordSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Μη έγκυρο email." }
    }

    const { email, recaptchaToken: turnstileToken } = validatedFields.data

    const isHuman = await verifyTurnstile(turnstileToken)
    if (!isHuman) {
        return { error: "Αποτυχία επαλήθευσης Turnstile (Πιθανό Bot)." }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (!existingUser || !existingUser.passwordHash) {
            // Return generic success to avoid enumeration
            return { success: "Το email επαναφοράς στάλθηκε!" }
        }

        const passwordResetToken = await generatePasswordResetToken(email)
        const emailResult = await sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token
        )

        if (!emailResult.success) {
            return { error: `Αποτυχία αποστολής email: ${emailResult.error}` }
        }

        return { success: "Το email επαναφοράς στάλθηκε!" }
    } catch (error) {
        console.error("Error in requestPasswordReset:", error)
        return { error: "Κάτι πήγε στραβά κατά την επεξεργασία του αιτήματος." }
    }
}

export async function resetPassword(values: NewPasswordValues, token?: string | null) {
    if (!token) {
        return { error: "Λείπει το token." }
    }

    const validatedFields = newPasswordSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Μη έγκυρα δεδομένα." }
    }

    const { password } = validatedFields.data

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const existingToken = await prisma.passwordResetToken.findFirst({
        where: { token: hashedToken }
    })

    if (!existingToken) {
        return { error: "Μη έγκυρο token." }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
        return { error: "Το token έχει λήξει." }
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.email }
    })

    if (!existingUser) {
        return { error: "Ο χρήστης δεν βρέθηκε." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { passwordHash: hashedPassword },
    })

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Ο κωδικός ενημερώθηκε!" }
}
