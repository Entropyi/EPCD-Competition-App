"use server"
import {signIn} from "@/app/auth";
import * as v from "valibot";
import {prisma} from "@/prisma/prisma";

export default async function formAction(email: string) {
    const EmailSchema = v.pipe(v.string(), v.email(), v.nonEmpty())
    const ValidatedEmail = v.parse(EmailSchema, email);

    const tokensCount = await prisma.verificationToken.count({
        where: {identifier: ValidatedEmail},
    })

    if (tokensCount < 3) {
        return await signIn("email", {email: ValidatedEmail});
    } else {
        throw new Error("user email validation exceeded the daily limit");
    }
}
