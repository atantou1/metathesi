"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type UserContextType = {
    name: string
    setName: (name: string) => void
    avatarColor: string
    setAvatarColor: (color: string) => void
}

import { getGenderFromName, NEUTRAL_COLORS } from '@/lib/avatar-utils'

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {

    const { data: session } = useSession()
    const [name, setName] = useState("")
    const [avatarColor, setAvatarColor] = useState("bg-emerald-600")

    // Sync with session initially
    useEffect(() => {
        const user = session?.user as any;
        if (user?.name) {
            setName(user.name)
        }
        if (user?.avatarColor) {
            setAvatarColor(user.avatarColor)
        }
    }, [session])


    return (
        <UserContext.Provider value={{ name, setName, avatarColor, setAvatarColor }}>
            {children}
        </UserContext.Provider>
    )
}


export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
