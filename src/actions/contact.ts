"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendContactInquiryEmail } from "@/lib/emails";
import { headers } from "next/headers";

const ContactSchema = z.object({
    name: z.string().min(2, "Το όνομα πρέπει να είναι τουλάχιστον 2 χαρακτήρες"),
    email: z.string().email("Μη έγκυρη διεύθυνση email"),
    subject: z.string().min(5, "Το θέμα πρέπει να είναι τουλάχιστον 5 χαρακτήρες"),
    message: z.string().min(10, "Το μήνυμα πρέπει να είναι τουλάχιστον 10 χαρακτήρες"),
    recaptchaToken: z.string().optional(),
});

export async function sendContactForm(values: z.infer<typeof ContactSchema>) {
    const session = await auth();
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "127.0.0.1";

    const validatedFields = ContactSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Μη έγκυρα πεδία!" };
    }

    const { name, email, subject, message, recaptchaToken } = validatedFields.data;

    // Rate Limiting: Max 3 per hour per IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentInquiriesCount = await prisma.contactInquiry.count({
        where: {
            ip: ip,
            createdAt: {
                gt: oneHourAgo,
            },
        },
    });

    if (recentInquiriesCount >= 3) {
        return { error: "Έχετε υπερβεί το όριο υποβολών. Παρακαλώ δοκιμάστε ξανά σε μία ώρα." };
    }

    // Verify Turnstile token
    if (process.env.TURNSTILE_SECRET_KEY) {
        if (!recaptchaToken) {
            return { error: "Αποτυχία επαλήθευσης ασφαλείας (Turnstile missing)." };
        }

        const secretKey = process.env.TURNSTILE_SECRET_KEY.replace(/[^a-zA-Z0-9]/g, '');
        
        try {
            const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `secret=${secretKey}&response=${recaptchaToken}`
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                return { error: "Αποτυχία επαλήθευσης ασφαλείας (Bot detected)." };
            }
        } catch (error) {
            console.error("Turnstile verification error:", error);
            return { error: "Σφάλμα κατά την επαλήθευση ασφαλείας." };
        }
    }

    try {
        // Save to database
        await prisma.contactInquiry.create({
            data: {
                name,
                email,
                subject,
                message,
                ip,
                userId: session?.user?.id ? parseInt(session.user.id) : null,
            }
        });

        console.log("Contact Form Saved to DB:", { name, email, subject, message, userId: session?.user?.id, ip });
        
        // Send email notification to administrator
        await sendContactInquiryEmail({
            name,
            email,
            subject,
            message,
            userId: session?.user?.id ? parseInt(session.user.id) : null,
        });

        return { success: "Το μήνυμά σας στάλθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας σύντομα." };
    } catch (error) {
        console.error("Failed to save contact inquiry:", error);
        return { error: "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά αργότερα." };
    }
}
