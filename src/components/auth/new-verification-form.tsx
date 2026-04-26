"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NewVerificationForm() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return; // Prevent double submission

        if (!token) {
            setError("Το token δεν βρέθηκε!");
            return;
        }

        newVerification(token)
            .then((data) => {
                if (data.success) {
                    setSuccess(data.success);
                } else {
                    setError(data.error);
                }
            })
            .catch(() => {
                setError("Κάτι πήγε στραβά!");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <AuthLayout
            title="Επιβεβαίωση Email"
            subtitle="Επαληθεύουμε το email σας..."
        >
            <div className="flex flex-col items-center justify-center space-y-6 w-full py-8">
                {!success && !error && (
                    <div className="flex flex-col items-center justify-center space-y-4 text-text-tertiary">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p>Παρακαλώ περιμένετε...</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center space-y-4 shadow-sm w-full animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Επιτυχία!</h3>
                        <p className="font-medium text-sm">{success}</p>

                        <div className="pt-4">
                            <Button asChild className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-12 rounded-xl shadow-md transition-all active:scale-[0.98]">
                                <Link href="/login">
                                    Σύνδεση τώρα
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}

                {!success && error && (
                    <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 text-center space-y-4 shadow-sm w-full animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                            <XCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Σφάλμα!</h3>
                        <p className="font-medium text-sm">{error}</p>

                        <div className="pt-4">
                            <Button asChild variant="outline" className="w-full h-12 rounded-xl text-text-secondary border-border hover:bg-surface-dim font-bold transition-all">
                                <Link href="/login">
                                    Επιστροφή στη σύνδεση
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
