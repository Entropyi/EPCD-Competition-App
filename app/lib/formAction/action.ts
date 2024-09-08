"use server"
import {signIn} from "@/app/auth";
import {getLocale} from 'next-intl/server';

export default async function formAction(){
    const locale =  await getLocale();

    return await signIn("google", {redirectTo:`/${locale}/email-sent`});
}
