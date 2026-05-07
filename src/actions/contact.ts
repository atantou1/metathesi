"use server";

import { z } from "zod";

const ContactSchema = z.object({
    name: z.string().min(2, "Το όνομα πρέπει να είναι τουλάχιστον 2 χαρακτήρες"),
    email: z.string().email("Μη έγκυρη διεύθυνση email"),
    subject: z.string().min(5, "Το θέμα πρέπει να είναι τουλάχιστον 5 χαρακτήρες"),
    message: z.string().min(10, "Το μήνυμα πρέπει να είναι τουλάχιστον 10 χαρακτήρες"),
});

export async function sendContactForm(values: z.infer<typeof ContactSchema>) {
    const validatedFields = ContactSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Μη έγκυρα πεδία!" };
    }

    const { name, email, subject, message } = validatedFields.data;

    try {
        // Here you would typically send an email using Resend or another provider
        console.log("Contact Form Submission:", { name, email, subject, message });
        
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return { success: "Το μήνυμά σας στάλθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας σύντομα." };
    } catch (error) {
        return { error: "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά αργότερα." };
    }
}
