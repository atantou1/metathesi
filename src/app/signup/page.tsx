import { SignUpForm } from "@/components/signup-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-muted px-6 pt-20 md:pt-32 pb-20">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignUpForm />
      </div>
    </div>
  )
}
