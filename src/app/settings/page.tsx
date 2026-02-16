import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SettingsLayout } from "@/components/settings/settings-layout"

export default async function SettingsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="flex flex-col min-h-screen pt-20 bg-slate-50 dark:bg-slate-950">
            <SettingsLayout />
        </div>
    )
}
