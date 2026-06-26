import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import { sql } from "./db"
import { verifyPassword } from "./crypto"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Console",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          // Query Neon Postgres database for admin email
          const result = await sql`SELECT * FROM admins WHERE email = ${credentials.email} LIMIT 1`
          const admin = result?.[0]
          
          if (admin && verifyPassword(credentials.password, admin.password_hash)) {
            return { id: admin.id.toString(), email: admin.email }
          }
        } catch (err) {
          console.error("Auth database query error:", err)
        }
        
        return null
      }
    })
  ],
  
  session: {
    strategy: "jwt",
  },
  
  pages: {
    signIn: "/console",
    error: "/console",
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email
      }
      return session
    },
  },
}

export default authOptions