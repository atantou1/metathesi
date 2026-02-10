import { z } from "zod"

export const signUpSchema = z.object({
    fullName: z.string().min(2, "Το ονοματεπώνυμο πρέπει να έχει τουλάχιστον 2 χαρακτήρες"),
    email: z.string().email("Μη έγκυρο email"),
    password: z.string().min(6, "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Οι κωδικοί δεν ταιριάζουν",
    path: ["confirmPassword"],
})

export const loginSchema = z.object({
    email: z.string().email("Μη έγκυρο email"),
    password: z.string().min(1, "Απαιτείται κωδικός"),
})

export type SignUpValues = z.infer<typeof signUpSchema>
export const profileSchema = z.object({
    divisionId: z.number().min(1, "Επιλέξτε βαθμίδα"),
    specialtyId: z.number().min(1, "Επιλέξτε ειδικότητα"),
    currentZoneId: z.number().min(1, "Επιλέξτε περιοχή οργανικής"),
    // bio: z.string().optional(), // Removed
    // hireDate: z.string().min(1, "Επιλέξτε ημερομηνία διορισμού"), // Hidden for now
    // serviceYears: z.number().min(0), // Hidden for now
    // serviceMonths: z.number().min(0).max(11), // Hidden for now
    // serviceDays: z.number().min(0).max(30), // Hidden for now
})

export const requestSchema = z.object({
    targetZoneIds: z.array(z.number()).min(1, "Επιλέξτε τουλάχιστον μία περιοχή"),
})

export type RequestValues = z.infer<typeof requestSchema>
export type ProfileValues = z.infer<typeof profileSchema>
export type LoginValues = z.infer<typeof loginSchema>
