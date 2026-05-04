"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/schemas"
import { requestPasswordReset } from "@/actions/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useState } from "react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState<string | undefined>("")
  const [error, setError] = useState<string | undefined>("")

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: ResetPasswordValues) {
    setError("")
    setSuccess("")
    
    startTransition(async () => {
      try {
        const result = await requestPasswordReset(values)
        if (result?.error) {
          setError(result.error)
        } else {
          setSuccess(result?.success)
        }
      } catch (error) {
        console.error("ForgotPasswordForm error:", error)
        setError("Κάτι πήγε στραβά.")
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
                backgroundImage: 'radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-hover" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl mb-6">
                <Logo className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 tracking-tight">metaThesi</h2>
              <p className="text-primary-foreground/80 text-sm max-w-xs leading-relaxed">
                Επαναφορά πρόσβασης στον λογαριασμό σας με ασφάλεια.
              </p>
            </div>
          </div>

          {/* Right Form Pane */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-10 bg-card/60 backdrop-blur-xl border-l border-white/5">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Ξεχάσατε τον κωδικό σας;</h1>
                  <p className="text-sm text-balance text-muted-foreground mt-2">
                    Εισάγετε το email σας για να λάβετε έναν σύνδεσμο επαναφοράς
                  </p>
                </div>

                {success ? (
                  <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <p className="text-sm font-medium text-center text-success max-w-[200px]">
                      {success}
                    </p>
                    <Button asChild variant="outline" className="mt-2 rounded-2xl">
                      <Link href="/login">Επιστροφή στη σύνδεση</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input
                                placeholder="teacher@gmail.com"
                                {...field}
                                required
                                className="pl-10 h-11 bg-muted/30 border-border focus:bg-card transition-all rounded-2xl"
                                disabled={isPending}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-2xl text-center font-medium animate-in fade-in slide-in-from-top-1">
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full h-11 font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] rounded-2xl" disabled={isPending}>
                      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Αποστολή συνδέσμου"}
                    </Button>

                    <Button asChild variant="ghost" className="h-11 rounded-2xl">
                      <Link href="/login" className="flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Πίσω στη σύνδεση</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
