import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from '@prisma/client'
import * as v from "valibot";
import {useTranslations} from "next-intl";


const prisma = new PrismaClient()


export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.formData()

    const FormSchema = v.object({
        fullName: v.pipe(
            v.string(),
            v.nonEmpty(),
        ),

        email: v.pipe(
            v.string(),
            v.email(),
            v.nonEmpty(),
        ),

        age: v.optional(
                v.number(),
            0
        ),

        phoneNumber: v.pipe(
            v.string(),
            v.nonEmpty(),
            v.maxLength(10),
            v.minLength(10),
        ),

        imageUrl: v.pipe(
            v.string(),
            v.nonEmpty(),
        ),

        photoTitle: v.optional(v.string(), ""),

        comment: v.optional(v.string(), ""),

        photoLocation: v.pipe(
            v.string(),
            v.nonEmpty(),
        ),

        photoPurpose: v.optional(v.string(), ""),
    });

    try {
        const formData = v.parse(
            FormSchema,
            {
                fullName: data.get("fullName"),
                email: data.get("email"),
                age: Number(data.get("age")),
                phoneNumber: data.get("phoneNumber"),
                imageUrl: data.get("imageUrl"),
                photoTitle: data.get("photoTitle"),
                comment: data.get("comments"),
                photoLocation: data.get("photoLocation"),
                photoPurpose: data.get("photoPurpose"),
            }
        )

        try {
            await prisma.form.create({
                data: {
                    fullName: formData.fullName,
                    email: formData.email,
                    age: formData.age,
                    phoneNumber: Number(formData.phoneNumber),
                    imageUrl: formData.imageUrl,
                    photoTitle: formData.photoTitle,
                    comment: formData.comment,
                    photoLocation: formData.photoLocation,
                    photoPurpose: formData.photoPurpose,
                }
            })
        } catch (e) {
            // @ts-ignore
            if (e?.code == "P2002") {
                return NextResponse.json({ success: false, msg: "unique" }, { status: 409 });

            } else {
                // @ts-ignore
                return NextResponse.json({ success: false, msg: e.code }, { status: 409 });
            }
        }

        return NextResponse.json({ success: true, msg: "Successfully uploaded" });

    } catch (e) {
        return NextResponse.json({ success: false, msg: e?.toString() }, { status: 500 });
    }


}

export async function GET(req: NextRequest, res: NextResponse) {

    const result = await prisma.form.findMany();
    return NextResponse.json({success: true, msg: result})
}

export async function DELETE(req: NextRequest, res: NextResponse) {
    const deleteUsers = await prisma.form.deleteMany({})
    return NextResponse.json({success: true, msg: deleteUsers})
}
