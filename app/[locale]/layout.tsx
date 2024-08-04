import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {getMessages, getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import "../globals.css";
import Header from "@/app/ui/header/Header";

const inter = Inter({subsets: ["latin"]});

type Props = {
    params: { locale: string };
}

export async function generateMetadata({
                                           params: {locale}
                                       }: Omit<Props, 'children'>) {
    const t = await getTranslations({locale, namespace: 'LocaleLayout'});

    return {
        title: t('title')
    };
}

export default async function LocaleLayout({
                                               children,
                                               params: {locale}
                                           }: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    unstable_setRequestLocale(locale);
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