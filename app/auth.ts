import "@/envConfig"
import NextAuth from "next-auth"
import Nodemailer from "next-auth/providers/nodemailer"
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from  "@/prisma/prisma"
import {createId} from '@paralleldrive/cuid2';

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),

                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },

            from: "admain@absher.sa",
        }),
    ],
    session: {
        generateSessionToken: () => {
            return createId();
        },
        strategy: "jwt",
        maxAge: 60* 60,
    },
})