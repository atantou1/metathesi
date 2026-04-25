import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

export default function NewVerificationPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Φόρτωση...</div>}>
            <NewVerificationForm />
        </Suspense>
    );
}
