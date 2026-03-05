import { LoginForm } from "@/components/auth/login-form"
import { Suspense } from "react"

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center p-4"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#0369A1] animate-spin"></div></div>}>
            <LoginForm />
        </Suspense>
    )
}
