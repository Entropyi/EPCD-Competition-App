import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/prisma/prisma"
import EmailProvider from "next-auth/providers/email";
import customVerificationRequest from "@/app/lib/customVerificationRequest/customVerificationRequest"
import type {Provider} from "next-auth/providers"
import {getLocale} from 'next-intl/server';
import {createId} from '@paralleldrive/cuid2';

const getLocalea = async (): Promise<string> => {
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

        from: "admain@absher.sa",
        sendVerificationRequest: customVerificationRequest,
    }),
]

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers,
    adapter: PrismaAdapter(prisma),
    trustHost: true,
    pages: {
        signIn: `../../en/verification`,
        verifyRequest: "../../en/email-sent",
    },

    session: {
        generateSessionToken: () => {
            let id = createId();
            console.log(id);
            return id;
        },
        strategy: "jwt",

    },

    callbacks: {
        async jwt({token, account, profile}) {

            if (account) {
                token.accessToken = account.access_token
                token.id = profile?.id
            }   
            return token
        },

        async signIn({user, account, profile, email, credentials}) {
            const isAllowedToSignIn = true
            if (isAllowedToSignIn) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        }
    },
})

