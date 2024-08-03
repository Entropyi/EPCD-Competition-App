import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {getMessages, getTranslations} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import "../globals.css";
import Header from "@/app/ui/header/Header";

const inter = Inter({subsets: ["latin"]});

export default async function LocaleLayout({
                                               children,
                                               params: {locale}
                                           }: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body>
        <Header/>
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
        </body>
        </html>
    );
}