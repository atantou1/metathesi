import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-muted px-6 pt-20 md:pt-32 pb-20">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
