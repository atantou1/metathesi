import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SettingsLayout } from "@/components/settings/settings-layout"

export default async function SettingsPage() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { fullName: true }
    })

    return (
        <div className="flex flex-col min-h-screen pt-20">
            <SettingsLayout initialName={user?.fullName || ""} />
        </div>
    )
}

