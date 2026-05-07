import { z } from "zod"

export const signUpSchema = z.object({
    fullName: z.string().optional(),
    email: z.string().email("Μη έγκυρο email"),
    password: z.string().min(6, "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"),
    confirmPassword: z.string(),
    recaptchaToken: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Οι κωδικοί δεν ταιριάζουν",
    path: ["confirmPassword"],
})

export const loginSchema = z.object({
    email: z.string().email("Μη έγκυρο email"),
    password: z.string().min(1, "Απαιτείται κωδικός"),
    recaptchaToken: z.string().optional(),
})

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Απαιτείται ο τρέχων κωδικός"),
    newPassword: z.string().min(6, "Ο νέος κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Οι νέοι κωδικοί δεν ταιριάζουν",
    path: ["confirmPassword"],
})

export type SignUpValues = z.infer<typeof signUpSchema>
export const profileSchema = z.object({
    fullName: z.string().optional(),
    divisionId: z.number().min(1, "Επιλέξτε βαθμίδα"),
    specialtyId: z.number().min(1, "Επιλέξτε ειδικότητα"),
    currentZoneId: z.number().min(1, "Επιλέξτε περιοχή οργανικής"),
})

export const requestSchema = z.object({
    targetZoneIds: z.array(z.number()).min(1, "Επιλέξτε τουλάχιστον μία περιοχή"),
})

export type RequestValues = z.infer<typeof requestSchema>
export type ProfileValues = z.infer<typeof profileSchema>
export type LoginValues = z.infer<typeof loginSchema>

export const resetPasswordSchema = z.object({
    email: z.string().email("Μη έγκυρο email"),
    recaptchaToken: z.string().optional(),
})

export const newPasswordSchema = z.object({
    password: z.string().min(6, "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Οι κωδικοί δεν ταιριάζουν",
    path: ["confirmPassword"],
})

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
export type NewPasswordValues = z.infer<typeof newPasswordSchema>
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
