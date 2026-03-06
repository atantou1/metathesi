"use client"

import { useTransition, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginValues } from "@/lib/schemas"
import { login, loginWithProvider } from "@/actions/auth"
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
import { Mail, Lock, Loader2, EyeOff, Eye } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function LoginForm() {
    const searchParams = useSearchParams()
    const urlError = searchParams.get("error")

    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        if (urlError === "OAuthAccountNotLinked") {
            form.setError("root", {
                message: "Αυτό το email χρησιμοποιείται ήδη. Συνδεθείτε με τον κωδικό σας."
            })
        }
    }, [urlError, form])

    function onSubmit(values: LoginValues) {
        startTransition(async () => {
            try {
                const result = await login(values)
                if (result?.error) {
                    form.setError("root", { message: result.error })
                }
            } catch (error) {
                if (
                    (error as Error)?.message?.includes("NEXT_REDIRECT") ||
                    (error as any)?.digest?.includes("NEXT_REDIRECT")
                ) {
                    throw error
                }
                form.setError("root", { message: "Κάτι πήγε στραβά." })
            }
        })
    }

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Please sign in to continue your journey."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</FormLabel>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="text-slate-400 w-5 h-5 group-focus-within:text-[#0369A1] transition-colors" />
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="you@company.com"
                                            {...field}
                                            className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-[#0369A1] focus:ring-4 focus:ring-[#0369A1]/10 focus:bg-white transition-all text-sm font-medium sm:text-base h-auto"
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
                                    <FormLabel className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</FormLabel>
                                    <a href="#" className="text-xs font-medium text-[#0369A1] hover:text-[#0284c7] transition-colors">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="text-slate-400 w-5 h-5 group-focus-within:text-[#0369A1] transition-colors" />
                                    </div>
                                    <FormControl>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            className="block w-full pl-11 pr-11 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-[#0369A1] focus:ring-4 focus:ring-[#0369A1]/10 focus:bg-white transition-all text-sm font-medium sm:text-base h-auto"
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <Eye className="w-5 h-5" />
                                        ) : (
                                            <EyeOff className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {form.formState.errors.root && (
                        <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{form.formState.errors.root.message}</div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-md text-sm sm:text-base font-bold text-white bg-[#0369A1] hover:bg-[#0284c7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0369A1] transition-all transform active:scale-[0.98] lg:hover:-translate-y-0.5"
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                        </button>
                    </div>
                </form>
            </Form>

            <div className="relative my-8 lg:my-10">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-slate-400 text-xs font-medium uppercase tracking-wide">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    type="button"
                    onClick={() => startTransition(() => {
                        loginWithProvider('google')
                    })}
                    disabled={isPending}
                    className="flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors lg:hover:border-slate-300 disabled:opacity-50"
                >
                    <svg className="h-5 w-5 mr-2.5" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    <span className="text-xs sm:text-sm">Google</span>
                </button>
                <button
                    type="button"
                    onClick={() => startTransition(() => {
                        loginWithProvider('facebook')
                    })}
                    disabled={isPending}
                    className="flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors lg:hover:border-slate-300 disabled:opacity-50"
                >
                    <svg className="h-5 w-5 mr-2.5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs sm:text-sm">Facebook</span>
                </button>
            </div>

            <div className="text-center lg:text-left">
                <p className="text-sm text-slate-500">
                    New to the platform?{" "}
                    <Link href="/signup" className="font-semibold text-[#0369A1] hover:text-[#0284c7] transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}
