import * as React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { ContactForm } from "@/components/contact-form";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Επικοινωνία",
    description: "Επικοινωνήστε με την ομάδα της metaThesi για οποιαδήποτε απορία ή πρόβλημα αντιμετωπίζετε.",
    alternates: {
        canonical: "/contact",
    },
};

export default async function ContactPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();
    const params = await searchParams;

    const defaultValues = {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        subject: params.subject === "report" ? "Τεχνικό Πρόβλημα" : "",
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

                <div className="max-w-3xl mx-auto">
                    <ContactForm defaultValues={defaultValues} />
                </div>
            </div>
        </div>
    );
}
