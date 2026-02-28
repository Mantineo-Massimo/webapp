import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    return null
                }

                if (!user.emailVerified) {
                    if (user.verificationToken) {
                        throw new Error("Email non verificata. Controlla la tua casella di posta.")
                    }

                    // For legacy users created before the verification feature (no token), 
                    // we verify them on their first successful login.
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { emailVerified: new Date() }
                    });
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role
                token.id = user.id
                token.name = user.name
            }
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    role: token.role as string,
                    id: token.id as string,
                    name: token.name as string
                }
            }
            return session
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
