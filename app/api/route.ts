import {NextRequest, NextResponse} from "next/server";
import { PrismaClient } from '@prisma/client'
import FormSchema from "./validations/script"

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.formData()
    const prisma = new PrismaClient()

    const dataEntry = await prisma.form.create({
        data: {
            fullName: data.get("fullName") as unknown as string,
            email: data.get("email") as unknown as string,
            age: Number(data.get("age")) as unknown as number,
            phoneNumber: Number(data.get("phoneNumber")) as unknown as number,
            imageUrl: data.get("imageUrl") as unknown as string,
            photoTitle: data.get("photoTitle") as unknown as string,
            comment: data.get("comments") as unknown as unknown as string,
            photoLocation: data.get("photoLocation") as unknown as string,
            photoPurpose: data.get("photoPurpose") as unknown as string,
        }
    })

    return NextResponse.json({success: true, msg: "Successfully uploaded"})
}

export async function GET(req: NextRequest, res: NextResponse) {
    return NextResponse.json({success: true, msg: "Hello World!"})
}