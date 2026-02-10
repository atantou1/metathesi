"use server"

import { AuthError } from "next-auth"
import { signUpSchema, SignUpValues, loginSchema, LoginValues } from "@/lib/schemas"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"

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
            redirectTo: "/profile",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Λάθος email ή κωδικός." }
                default:
                    return { error: "Κάτι πήγε στραβά." }
            }
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

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "Το email χρησιμοποιείται ήδη." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            fullName,
            email,
            passwordHash: hashedPassword,
        },
    })

    // Try to sign in immediately after signup
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/profile/create",
        })
    } catch (error) {
        if ((error as Error).message.includes("NEXT_REDIRECT")) {
            throw error;
        }
        return { error: "Η εγγραφή έγινε, αλλά η σύνδεση απέτυχε." }
    }
}
