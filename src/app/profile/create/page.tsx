import { ProfileForm } from "@/components/profile/profile-form"

export default function CreateProfilePage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Δημιουργία Προφίλ
            </h1>
            <ProfileForm />
        </div>
    )
}

