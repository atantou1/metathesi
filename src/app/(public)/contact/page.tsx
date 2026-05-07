import * as React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { ContactForm } from "@/components/contact-form";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Επικοινωνία | metaThesi",
    description: "Επικοινωνήστε με την ομάδα της metaThesi για οποιαδήποτε απορία ή πρόβλημα αντιμετωπίζετε.",
};

export default async function ContactPage() {
    const session = await auth();

    const defaultValues = {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
    };

    return (
        <div className="relative min-h-screen py-24 px-6 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            </div>

            <div className="mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Πώς μπορούμε να <span className="text-primary">βοηθήσουμε;</span>
                    </h1>
                    <p className="text-xl text-text-tertiary max-w-2xl mx-auto">
                        Είμαστε εδώ για να λύσουμε κάθε απορία σας σχετικά με την πλατφόρμα 
                        και να σας βοηθήσουμε στην αναζήτηση της αμοιβαίας μετάθεσης.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-border flex items-start gap-4 hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1">Email</h4>
                                <p className="text-text-tertiary text-sm">
                                    info@metathesi.gr
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-border flex items-start gap-4 hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1">Live Chat</h4>
                                <p className="text-text-tertiary text-sm">
                                    Διαθέσιμο για εγγεγραμμένους χρήστες εντός των Matches.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-border flex items-start gap-4 hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1">Τοποθεσία</h4>
                                <p className="text-text-tertiary text-sm">
                                    Αθήνα, Ελλάδα
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <ContactForm defaultValues={defaultValues} />
                    </div>
                </div>
            </div>
        </div>
    );
}
