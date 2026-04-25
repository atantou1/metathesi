import NextAuth, { DefaultSession, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Role, UserStatus } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role | string
      status: UserStatus | string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role?: Role | string
    status?: UserStatus | string
    banReason?: string | null
    bannedAt?: Date | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string
    role?: Role | string
    status?: UserStatus | string
  }
}
