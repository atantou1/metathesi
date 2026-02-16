"use client"

import { signOut } from "next-auth/react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

export function UserNavLogout() {
    return (
        <DropdownMenuItem
            className="p-0 focus:bg-transparent cursor-pointer"
            onClick={() => signOut()}
        >
            <div className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                Αποσύνδεση
            </div>
        </DropdownMenuItem>
    )
}
