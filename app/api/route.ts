import {NextRequest, NextResponse} from "next/server";
import * as v from "valibot";
import {prisma} from "@/prisma/prisma";


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

        photoTitle: v.optional(v.string(), ""),

        comment: v.optional(v.string(), ""),

        photoLocation: v.pipe(
            v.string(),
            v.nonEmpty(),
        ),

        photoPurpose: v.optional(v.string(), ""),
    });

    try {
        let utcDate = new Date();
        let formattedUtcDate = utcDate.toISOString();

        const formData = v.parse(
            FormSchema,
            {
                fullName: data.get("fullName"),
                email: data.get("email"),
                age: Number(data.get("age")),
                phoneNumber: data.get("phoneNumber"),
                photoTitle: data.get("photoTitle"),
                comment: data.get("comments"),
                photoLocation: data.get("photoLocation"),
                photoPurpose: data.get("photoPurpose"),
            }
        )

        try {
            await prisma.request.create({
                data: {
                    fullName: formData.fullName,
                    email: formData.email,
                    age: formData.age,
                    phoneNumber: formData.phoneNumber,
                    photoTitle: formData.photoTitle,
                    comment: formData.comment,
                    photoLocation: formData.photoLocation,
                    photoPurpose: formData.photoPurpose,
                    creationDate: formattedUtcDate,
                }
            })


        } catch (e) {
            // @ts-ignore
            if (e?.code == "P2002") {
                return NextResponse.json({success: false, msg: "unique"}, {status: 409});

            } else {
                // @ts-ignore
                return NextResponse.json({success: false, msg: e.code}, {status: 409});
            }
        }

        return NextResponse.json({success: true, msg: "Successfully uploaded"});

    } catch (e) {
        return NextResponse.json({success: false, msg: e}, {status: 500});
    }


}