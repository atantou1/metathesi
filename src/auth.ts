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
import Facebook from "next-auth/providers/facebook"
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
                emailVerified: createdUser.emailVerified,
                role: createdUser.role,
                status: createdUser.status
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
                emailVerified: user.emailVerified,
                role: user.role,
                status: user.status
            } as any;
        },
        getUserByEmail: async (email) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return null;
            return {
                ...user,
                name: user.fullName,
                id: user.id.toString(),
                emailVerified: user.emailVerified,
                role: user.role,
                status: user.status
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
                emailVerified: account.user.emailVerified,
                role: account.user.role,
                status: account.user.status
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
                emailVerified: updatedUser.emailVerified,
                role: updatedUser.role,
                status: updatedUser.status
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
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await getUser(email)

                    if (!user || !user.passwordHash) {
                        throw new Error("Invalid credentials");
                    }

                    if (user.status === "BANNED") {
                        throw new Error(`Ο λογαριασμός έχει αποκλειστεί. ${user.banReason ? "Αιτιολογία: " + user.banReason : ""}`);
                    }

                    if (!user.emailVerified) {
                        console.log("Email not verified")
                        throw new Error("Email not verified");
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
                    if (passwordsMatch) {
                        // Return a User object that conforms to next-auth's User type
                        return {
                            id: user.id.toString(),
                            name: user.fullName || "",
                            email: user.email,
                            image: user.image || "",
                            role: user.role,
                            status: user.status,
                            avatarColor: (user as any).avatarColor

                        }

                    }
                }

                console.log("Invalid credentials")
                throw new Error("Invalid credentials");
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // For OAuth users, the user object will come from either the db lookup or provider
            // We check the status to block banned users
            if ((user as any).status === "BANNED") {
                return false; /****/
            }
            return true;
        },
        async session({ session, token }) {
            if (token?.sub) {
                session.user.id = token.sub;
            }
            if (token?.role) {
                session.user.role = token.role as any;
            }
            if (token?.status) {
                session.user.status = token.status as any;
            }
            if (token?.name) {
                session.user.name = token.name as string;
            }
            if (token?.avatarColor) {
                (session.user as any).avatarColor = token.avatarColor;
            }
            return session
        },

        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }
            if (trigger === "update" && session?.avatarColor) {
                token.avatarColor = session.avatarColor;
            }

            if (user) {
                token.sub = user.id ? user.id.toString() : '';
                token.name = user.name;
                token.avatarColor = (user as any).avatarColor;

                
                // For OAuth users, the 'user' object might be the provider profile initially.
                // We ensure role and status are fetched from the database.
                if (!(user as any).role) {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: parseInt(user.id as string, 10) },
                        select: { role: true, status: true }
                    });
                    token.role = dbUser?.role || "USER";
                    token.status = dbUser?.status || "ACTIVE";
                } else {
                    token.role = (user as any).role;
                    token.status = (user as any).status;
                }
            }
            return token
        }

    },
    session: { strategy: "jwt" }, // Because we are keeping credentials sign in
    secret: process.env.AUTH_SECRET,
})
