"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginValues } from "@/lib/schemas"
import { login } from "@/actions/auth"
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
import { Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
    const [isPending, startTransition] = useTransition()
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(values: LoginValues) {
        startTransition(async () => {
            try {
                const result = await login(values)
                if (result?.error) {
                    form.setError("root", { message: result.error })
                }
            } catch (error) {
                form.setError("root", { message: "Κάτι πήγε στραβά." })
            }
        })
    }

    return (
        <AuthLayout
            title="Καλωσήρθατε"
            subtitle="Συνδεθείτε για να δείτε τα αιτήματά σας."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                            placeholder="john@example.com"
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
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <FormLabel className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Κωδικός</FormLabel>
                                    <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                        Ξεχάσατε τον κωδικό;
                                    </a>
                                </div>
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

                    {form.formState.errors.root && (
                        <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{form.formState.errors.root.message}</div>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full flex justify-center py-6 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all transform active:scale-[0.98] lg:hover:-translate-y-0.5"
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Σύνδεση"}
                        </Button>
                    </div>
                </form>
            </Form>

            <div className="mt-auto text-center lg:text-left pt-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    Δεν έχετε λογαριασμό;{" "}
                    <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Εγγραφή
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}
