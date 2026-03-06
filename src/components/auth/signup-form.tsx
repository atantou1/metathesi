"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, SignUpValues } from "@/lib/schemas"
import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth/auth-layout"
import { User, Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function SignUpForm() {
    const [isPending, startTransition] = useTransition()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    function onSubmit(values: SignUpValues) {
        startTransition(async () => {
            try {
                const result = await signUp(values)
                if (result?.error) {
                    form.setError("root", { message: result.error })
                }
                if (result?.success) {
                    setSuccessMessage(result.success)
                }
            } catch (error) {
                form.setError("root", { message: "Κάτι πήγε στραβά." })
            }
        })
    }

    return (
        <AuthLayout
            title="Δημιουργία Λογαριασμού"
            subtitle="Συμπληρώστε τα στοιχεία σας για να εγγραφείτε."
        >
            {successMessage ? (
                <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center space-y-4 shadow-sm animate-in fade-in duration-500">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Ελέγξτε το email σας!</h3>
                    <p className="text-sm font-medium">{successMessage}</p>
                    <p className="text-xs text-green-600/80 mt-2">Παρακαλούμε ελέγξτε και τον φάκελο ανεπιθύμητων (spam) αν δεν το βρείτε στα εισερχόμενά σας.</p>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ονοματεπώνυμο</FormLabel>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="Γιάννης Παπαδόπουλος"
                                                {...field}
                                                className="block w-full pl-11 pr-4 py-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</FormLabel>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="teacher@school.gov"
                                                {...field}
                                                className="block w-full pl-11 pr-4 py-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 gap-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Κωδικός</FormLabel>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="******"
                                                    {...field}
                                                    className="block w-full pl-11 pr-4 py-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Επιβεβαίωση Κωδικού</FormLabel>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="******"
                                                    {...field}
                                                    className="block w-full pl-11 pr-4 py-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {form.formState.errors.root && (
                            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{form.formState.errors.root.message}</div>
                        )}

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-6 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all transform active:scale-[0.98] lg:hover:-translate-y-0.5"
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Δημιουργία Λογαριασμού"}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            <div className="mt-auto text-center lg:text-left pt-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    Έχετε ήδη λογαριασμό;{" "}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Σύνδεση
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}
