import { auth } from "@/app/auth"

export default async function UserSession() {
    const session = await auth()

    if (!session?.user) {
        return session;
    }else {
        return null;
    }
}