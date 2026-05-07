import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const generateVerificationToken = async (email: string) => {
    const token = crypto.randomUUID();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiration

    const existingToken = await prisma.verificationToken.findFirst({
        where: { email },
    });

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token: hashedToken,
            expires,
        },
    });

    return { ...verificationToken, token };
};

export const generatePasswordResetToken = async (email: string) => {
    const token = crypto.randomUUID();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiration

    const existingToken = await prisma.passwordResetToken.findFirst({
        where: { email },
    });

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token: hashedToken,
            expires,
        },
    });

    return { ...passwordResetToken, token };
};
