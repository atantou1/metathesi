"use client"

import { useTransition } from "react"
import { deleteTransferRequest } from "@/actions/request"
import { useRouter } from "next/navigation"

export function DeleteRequestButton() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε την αίτησή σας; Η ενέργεια αυτή θα ακυρώσει τυχόν ενεργά ταιριάσματα.")) {
            return
        }

        startTransition(async () => {
            const result = await deleteTransferRequest()
            if (result.error) {
                alert(`Error: ${result.error}`)
            } else {
                router.refresh()
            }
        })
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
            {isPending ? "Διαγραφή..." : "Διαγραφή"}
        </button>
    )
}
