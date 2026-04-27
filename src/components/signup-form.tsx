"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, SignUpValues } from "@/lib/schemas"
import { signUp, loginWithProvider } from "@/actions/auth"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Mail, Lock, Loader2, EyeOff, Eye, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
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
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-none shadow-2xl p-0 bg-transparent rounded-4xl">
                <CardContent className="grid p-0 md:grid-cols-2">
                    {/* Left Decorative Pane */}
                    <div className="relative hidden bg-primary md:flex flex-col items-center justify-center overflow-hidden p-10 text-white">
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-hover" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl mb-6">
                                <Logo className="w-16 h-16 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 tracking-tight">metaThesi</h2>
                            <p className="text-sky-100/80 text-sm max-w-xs leading-relaxed">
                                Γίνετε μέλος της μεγαλύτερης κοινότητας εκπαιδευτικών για αμοιβαίες μεταθέσεις.
                            </p>
                        </div>
                    </div>

                    {/* Right Form Pane */}
                    <div className="p-6 md:p-10 bg-card/60 backdrop-blur-xl border-l border-white/5">
                        {successMessage ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-success-soft rounded-full flex items-center justify-center text-success shadow-inner">
                                    <Mail className="w-10 h-10" />
                                </div>
                                <div>
                                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Εγγραφή</h1>
                                    <p className="text-text-tertiary font-medium">Στείλαμε έναν σύνδεσμο επιβεβαίωσης στο email σας.</p>
                                </div>
                                <div className="bg-card/50 p-4 rounded-2xl border border-border/20 text-sm text-text-tertiary max-w-xs">
                                    Παρακαλούμε ελέγξτε και τον φάκελο ανεπιθύμητων (spam) αν δεν το βρείτε στα εισερχόμενά σας.
                                </div>
                                <Button variant="outline" asChild className="mt-4">
                                    <Link href="/login">Επιστροφή στη Σύνδεση</Link>
                                </Button>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Εγγραφή</h1>
                                        <p className="text-sm text-balance text-muted-foreground mt-2">
                                            Δημιουργήστε έναν λογαριασμό για να ξεκινήσετε
                                        </p>
                                    </div>

                                    <div className="grid gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="grid gap-2">
                                                    <FormLabel className="text-sm font-medium text-foreground">Email Address</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary group-focus-within:text-primary transition-colors" />
                                                            <Input
                                                                placeholder="teacher@school.gov"
                                                                {...field}
                                                                required
                                                                className="pl-10 h-11 bg-muted/30 border-border focus:bg-card transition-all rounded-2xl"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="grid gap-2">
                                                    <FormLabel className="text-sm font-medium text-foreground">Κωδικός Πρόσβασης</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary group-focus-within:text-primary transition-colors" />
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                required
                                                                {...field}
                                                                placeholder="******"
                                                                className="pl-10 pr-10 h-11 bg-surface-dim/50 border-border focus:bg-card transition-all rounded-2xl"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-quaternary hover:text-text-tertiary transition-colors cursor-pointer"
                                                            >
                                                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem className="grid gap-2">
                                                    <FormLabel className="text-sm font-medium text-foreground">Επιβεβαίωση Κωδικού</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary group-focus-within:text-primary transition-colors" />
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                required
                                                                {...field}
                                                                placeholder="******"
                                                                className="pl-10 pr-10 h-11 bg-surface-dim/50 border-border focus:bg-card transition-all rounded-2xl"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {form.formState.errors.root && (
                                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-2xl text-center font-medium animate-in fade-in slide-in-from-top-1">
                                                {form.formState.errors.root.message}
                                            </div>
                                        )}

                                        <Button type="submit" className="w-full h-11 font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] rounded-2xl" disabled={isPending}>
                                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Δημιουργία Λογαριασμού"}
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 border-t border-border" />
                                        <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">Ή εγγραφείτε με</span>
                                        <div className="flex-1 border-t border-border" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="h-11 font-medium border-border transition-all active:scale-[0.98] bg-card/50 rounded-2xl"
                                            onClick={() => startTransition(() => loginWithProvider('google'))}
                                            disabled={isPending}
                                        >
                                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                                <path
                                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            Google
                                        </Button>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="h-11 font-medium border-border transition-all active:scale-[0.98] bg-card/50 rounded-2xl"
                                            onClick={() => startTransition(() => loginWithProvider('facebook'))}
                                            disabled={isPending}
                                        >
                                            <svg className="mr-2 h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                            </svg>
                                            Facebook
                                        </Button>
                                    </div>

                                    <div className="text-center text-sm">
                                        Έχετε ήδη λογαριασμό;{" "}
                                        <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
                                            Σύνδεση
                                        </Link>
                                    </div>
                                </form>
                            </Form>
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary transition-colors">
                Κάνοντας κλικ στη συνέχεια, συμφωνείτε με τους <a href="#">Όρους Παροχής Υπηρεσιών</a>{" "}
                και την <a href="#">Πολιτική Απορρήτου</a>.
            </div>
        </div>
    )
}
