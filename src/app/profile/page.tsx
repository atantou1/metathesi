
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/profile/profile-form"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/login")
    }

    const userId = parseInt(session.user.id)
    const profile = await prisma.profile.findUnique({
        where: { userId },
        include: {
            division: true,
            specialty: true,
            currentZone: {
                include: {
                    region: true
                }
            }
        }
    })

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Διαχείριση Προφίλ
            </h1>
            <ProfileForm initialData={profile} />
        </div>
    )
}
