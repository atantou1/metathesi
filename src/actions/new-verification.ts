"use server";

import { prisma } from "@/lib/prisma";

export const newVerification = async (token: string) => {
    const existingToken = await prisma.verificationToken.findUnique({
        where: { token }
    });

    if (!existingToken) {
        return { error: "Ο σύνδεσμος δεν υπάρχει ή έχει λήξει!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Ο σύνδεσμος έχει λήξει!" };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.email }
    });

    if (!existingUser) {
        return { error: "Δε βρέθηκε χρήστης με αυτό το email!" };
    }

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            // Ensure the main email stays synced in case the token email might differ in future edge cases
            email: existingToken.email,
        }
    });

    await prisma.verificationToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "Το email επιβεβαιώθηκε επιτυχώς!" };
};
