"use server"
import {signIn} from "@/app/auth";
import * as v from "valibot";

export default async function formAction(email: string) {
    const validEmail = v.email(email);
    console.log(validEmail);
    return await signIn("email", {email: email});
}
