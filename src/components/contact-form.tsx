"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle, User, MessageSquare, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { sendContactForm } from "@/actions/contact";

const ContactSchema = z.object({
    name: z.string().min(2, "Το όνομα πρέπει να είναι τουλάχιστον 2 χαρακτήρες"),
    email: z.string().email("Μη έγκυρη διεύθυνση email"),
    subject: z.string().min(5, "Το θέμα πρέπει να είναι τουλάχιστον 5 χαρακτήρες"),
    message: z.string().min(10, "Το μήνυμα πρέπει να είναι τουλάχιστον 10 χαρακτήρες"),
});

type ContactFormValues = z.infer<typeof ContactSchema>;

interface ContactFormProps {
    defaultValues?: Partial<ContactFormValues>;
}

export function ContactForm({ defaultValues }: ContactFormProps) {
    const [isPending, setIsPending] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            email: defaultValues?.email || "",
            subject: defaultValues?.subject || "",
            message: defaultValues?.message || "",
        },
    });

    async function onSubmit(values: ContactFormValues) {
        setIsPending(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await sendContactForm(values);
            if (result.error) {
                setError(result.error);
            } else if (result.success) {
                setSuccess(result.success);
                form.reset({
                    name: values.name,
                    email: values.email,
                    subject: "",
                    message: "",
                });
            }
        } catch (e) {
            setError("Παρουσιάστηκε ένα σφάλμα. Παρακαλώ δοκιμάστε ξανά.");
        } finally {
            setIsPending(false);
        }
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 text-center bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-4xl border border-primary/20 shadow-2xl"
            >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Εστάλη!</h3>
                <p className="text-text-tertiary mb-8 max-w-sm">
                    {success}
                </p>
                <Button
                    variant="outline"
                    onClick={() => setSuccess(null)}
                    className="rounded-full px-8"
                >
                    Αποστολή νέου μηνύματος
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-4xl border border-border shadow-2xl p-6 md:p-10">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Επικοινωνήστε μαζί μας</h2>
                <p className="text-text-tertiary">
                    Συμπληρώστε την παρακάτω φόρμα και η ομάδα μας θα σας απαντήσει το συντομότερο δυνατό.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-primary" />
                                        Ονοματεπώνυμο
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="π.χ. Ιωάννης Παπαδόπουλος"
                                            {...field}
                                            disabled={isPending}
                                            className="h-12 bg-white/50 dark:bg-black/20 border-border focus:ring-primary/20 rounded-2xl"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary" />
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="π.χ. email@example.com"
                                            {...field}
                                            disabled={isPending}
                                            className="h-12 bg-white/50 dark:bg-black/20 border-border focus:ring-primary/20 rounded-2xl"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" />
                                    Θέμα
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Πώς μπορούμε να σας βοηθήσουμε;"
                                        {...field}
                                        disabled={isPending}
                                        className="h-12 bg-white/50 dark:bg-black/20 border-border focus:ring-primary/20 rounded-2xl"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                    Μήνυμα
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Γράψτε το μήνυμά σας εδώ..."
                                        rows={5}
                                        {...field}
                                        disabled={isPending}
                                        className="bg-white/50 dark:bg-black/20 border-border focus:ring-primary/20 rounded-3xl resize-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-2xl flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-14 rounded-2xl text-lg font-semibold bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/20 group"
                    >
                        {isPending ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Αποστολή...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Αποστολή Μηνύματος
                            </div>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
