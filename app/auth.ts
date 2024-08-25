import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/prisma/prisma"
import EmailProvider from "next-auth/providers/email";
import customVerificationRequest from "@/app/lib/customVerificationRequest/customVerificationRequest"
import type { Provider } from "next-auth/providers"
import {getLocale} from 'next-intl/server';

const getLocalea = async () : Promise<string> =>{
    return await getLocale();
}

const providers: Provider[] = [
    EmailProvider({
        server: {
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),

            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        },
        maxAge:60*60,
        from: "admain@absher.sa",
        sendVerificationRequest: customVerificationRequest,
    }),
    ]

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers,
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: `../../en/verification`,
        verifyRequest:"../../en/email-sent",
        error:"../../en/email-error",
    },
    callbacks:{


    }
})

