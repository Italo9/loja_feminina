import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "contatoemillysl@gmail.com,carolinamoura767@gmail.com").split(",").map((e) => e.trim().toLowerCase())

function getRole(email: string | null | undefined, existingRole?: string | null): string {
  if (existingRole === "ADMIN") return "ADMIN"
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return "ADMIN"
  return existingRole || "CUSTOMER"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        )

        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.email = (user as { email?: string }).email ?? undefined
        const dbUser = await prisma.user.findUnique({ where: { id: user.id as string } })
        token.role = dbUser?.role ?? getRole((user as { email?: string }).email ?? null)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role as string
      }
      return session
    },
  },
})
