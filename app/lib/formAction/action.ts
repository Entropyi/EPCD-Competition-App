"use server"
import {signIn} from "@/app/auth";

export default async function formAction(email : string){
    return await signIn("email",{email: email});
}
