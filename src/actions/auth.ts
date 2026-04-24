"use server"

import { AuthError } from "next-auth"
import { signUpSchema, SignUpValues, loginSchema, LoginValues } from "@/lib/schemas"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/emails"

export async function loginWithProvider(provider: 'google' | 'facebook') {
    await signIn(provider, { redirectTo: "/dashboard" })
}

export async function login(values: LoginValues) {
    const validatedFields = loginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Μη έγκυρα δεδομένα." }
    }

    const { email, password } = validatedFields.data

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            // NextAuth wraps our thrown errors inside the cause property for CallbackRouteError
            const errorMsg = error.cause?.err?.message || error.message;

            if (errorMsg === "Email not verified") {
                return { error: "Παρακαλούμε επιβεβαιώστε το email σας πριν συνδεθείτε." }
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

    const { fullName, email, password } = validatedFields.data
    
    // Use the part before @ as a default name if none provided
    const userFullName = fullName || email.split('@')[0]

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "Το email χρησιμοποιείται ήδη." }
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
