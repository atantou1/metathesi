import { SignUpForm } from "@/components/signup-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Εγγραφή",
  description: "Δημιουργήστε νέο λογαριασμό στο metaThesi και βάλτε την αναζήτηση για μετάθεση στον αυτόματο πιλότο.",
  alternates: {
    canonical: "/signup",
  },
}


export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden px-6 py-12 transition-colors duration-500">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full transition-all duration-700" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full transition-all duration-700" />
      </div>

      <div className="w-full max-w-sm md:max-w-4xl relative z-10">
          <SignUpForm />
      </div>
    </div>
  )
}
