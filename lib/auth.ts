import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) throw new Error("User not found")

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) throw new Error("Invalid password")

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}

// import { type NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import { prisma } from "@/lib/prisma";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing credentials");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) {
//           throw new Error("User not found");
//         }

//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.passwordHash
//         );

//         if (!isValid) {
//           throw new Error("Invalid password");
//         }

//         return {
//           id: user.id.toString(), 
//           email: user.email,
//           name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
//           role: user.role,
//         };
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };
