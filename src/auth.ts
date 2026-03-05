import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        return user
    } catch (error) {
        console.error("Failed to fetch user:", error)
        throw new Error("Failed to fetch user.")
    }
}

import Google from "next-auth/providers/google"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: {
        ...PrismaAdapter(prisma),
        createUser: async (user) => {
            const createdUser = await prisma.user.create({
                data: {
                    email: user.email,
                    fullName: user.name || null,
                    image: user.image || null,
                    emailVerified: user.emailVerified || null,
                }
            });
            return {
                ...createdUser,
                name: createdUser.fullName,
                id: createdUser.id.toString(), // Keep as string for NextAuth compatibility
                emailVerified: createdUser.emailVerified
            } as any;
        },
        getUser: async (id) => {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId)) return null;
            const user = await prisma.user.findUnique({ where: { id: parsedId } });
            if (!user) return null;
            return {
                ...user,
                name: user.fullName,
                id: user.id.toString(),
                emailVerified: user.emailVerified
            } as any;
        },
        getUserByEmail: async (email) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return null;
            return {
                ...user,
                name: user.fullName,
                id: user.id.toString(),
                emailVerified: user.emailVerified
            } as any;
        },
        getUserByAccount: async ({ providerAccountId, provider }) => {
            const account = await prisma.account.findUnique({
                where: { provider_providerAccountId: { providerAccountId, provider } },
                select: { user: true },
            });
            if (!account?.user) return null;
            return {
                ...account.user,
                name: account.user.fullName,
                id: account.user.id.toString(),
                emailVerified: account.user.emailVerified
            } as any;
        },
        updateUser: async (user) => {
            const updatedUser = await prisma.user.update({
                where: { id: parseInt(user.id as string, 10) },
                data: {
                    emailVerified: user.emailVerified,
                    image: user.image,
                }
            });
            return {
                ...updatedUser,
                name: updatedUser.fullName,
                id: updatedUser.id.toString(),
                emailVerified: updatedUser.emailVerified
            } as any;
        },
        linkAccount: async (account) => {
            return prisma.account.create({
                data: {
                    ...account,
                    userId: parseInt(account.userId as unknown as string, 10),
                } as any
            }) as any;
        },
        createSession: async (session) => {
            return prisma.session.create({
                data: {
                    ...session,
                    userId: parseInt(session.userId as unknown as string, 10),
                } as any
            }) as any;
        }
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        MicrosoftEntraID({
            clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
            clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await getUser(email)
                    if (!user || (!user.passwordHash && !user.emailVerified)) return null

                    if (user.passwordHash) {
                        const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
                        if (passwordsMatch) {
                            // Return a User object that conforms to next-auth's User type
                            return {
                                id: user.id.toString(),
                                name: user.fullName || "",
                                email: user.email,
                                image: user.image || "",
                            }
                        }
                    }
                }

                console.log("Invalid credentials")
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token, user }) {
            // Include user.id if using database sessions, or token.sub if JWT
            if (user?.id) {
                session.user.id = user.id?.toString() ?? "";
            } else if (token?.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token, user, account }) {
            if (account && user?.id) {
                token.sub = user.id.toString();
            } else if (user?.id) {
                token.sub = user.id.toString()
            }
            return token
        }
    },
    session: { strategy: "jwt" }, // Because we are keeping credentials sign in
    secret: process.env.AUTH_SECRET,
})
