"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Mail, Lock, Loader2, EyeOff, Eye } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Logo } from "@/components/logo"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-none shadow-2xl p-0 bg-transparent">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left Decorative Pane */}
          <div className="relative hidden bg-[#0369a1] md:flex flex-col items-center justify-center overflow-hidden p-10 text-white">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0369a1] to-[#0c4a6e]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl mb-6">
                <Logo className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 tracking-tight">metaThesi</h2>
              <p className="text-sky-100/80 text-sm max-w-xs leading-relaxed">
                Η πιο σύγχρονη πλατφόρμα διαχείρισης μεταθέσεων με την δύναμη των δεδομένων.
              </p>
            </div>
          </div>

          {/* Right Form Pane */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-10 bg-white/40 backdrop-blur-md border-l border-white/10">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Καλώς ήρθατε</h1>
                  <p className="text-sm text-balance text-muted-foreground mt-2">
                    Συνδεθείτε στον λογαριασμό σας για να συνεχίσετε
                  </p>
                </div>

                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel className="text-sm font-medium text-slate-700">Email</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                              placeholder="teacher@gmail.com"
                              {...field}
                              required
                              className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
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
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-medium text-slate-700">Κωδικός Πρόσβασης</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-primary hover:underline underline-offset-4"
                          >
                            Ξεχάσατε τον κωδικό σας;
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              required
                              {...field}
                              className="pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.formState.errors.root && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-1">
                      {form.formState.errors.root.message}
                    </div>
                  )}

                  <Button type="submit" className="w-full h-11 font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] rounded-lg" disabled={isPending}>
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Σύνδεση"}
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">Ή συνεχίστε με</span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="h-11 font-medium border-slate-200 transition-all active:scale-[0.98] rounded-lg"
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
                    className="h-11 font-medium border-slate-200 transition-all active:scale-[0.98] rounded-lg"
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
                  Δεν έχετε λογαριασμό;{" "}
                  <Link href="/signup" className="font-medium text-primary hover:underline underline-offset-4">
                    Εγγραφή
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary transition-colors">
        Κάνοντας κλικ στη συνέχεια, συμφωνείτε με τους <a href="#">Όρους Παροχής Υπηρεσιών</a>{" "}
        και την <a href="#">Πολιτική Απορρήτου</a>.
      </div>
    </div>
  )
}
