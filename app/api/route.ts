import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from '@prisma/client'
import {useTranslations} from "next-intl";

import * as v from 'valibot';

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.formData()
    const prisma = new PrismaClient()

    const serverSideErrors = useTranslations("serverSideErrors");

    const FormSchema = v.object({
        fullName: v.pipe(
            v.string(`${serverSideErrors("NameType")}`),
            v.nonEmpty(`${serverSideErrors("nameEmpty")}`),
        ),

        email: v.pipe(
            v.string(`${serverSideErrors("emailType")}`),
            v.email(`${serverSideErrors("emailType")}`),
            v.nonEmpty(`${serverSideErrors("emailType")}`),
        ),

        age: v.pipe(
            v.string(`${serverSideErrors("emailType")}`),
            v.nonEmpty(`${serverSideErrors("emailType")}`),
            v.maxLength(3, `${serverSideErrors("ss")}`),
            v.minLength(1, `${serverSideErrors("ss")}`)
        )

        , phoneNumber: v.pipe(
            v.string(`${serverSideErrors("emailType")}`),
            v.nonEmpty(`${serverSideErrors("emailType")}`),
            v.maxLength(10, `${serverSideErrors("ss")}`),
            v.minLength(10, `${serverSideErrors("ss")}`)
        )

        , imageUrl: v.pipe(
            v.string(`${serverSideErrors("emailType")}`),
            v.nonEmpty(`${serverSideErrors("emailType")}`),
        )

        , photoTitle: v.pipe(
            v.string(`${serverSideErrors("emailType")}`),
            v.nonEmpty(`${serverSideErrors("emailType")}`),
        )

        , comment: v.pipe(
            v.string(`${serverSideErrors("emailType")}`),
            v.nonEmpty(`${serverSideErrors("emailType")}`),
        )

        , photoLocation: v.pipe(
            v.string(`${serverSideErrors("emailType")}`),
            v.nonEmpty(`${serverSideErrors("emailType")}`),
        )

        , photoPurpose: v.pipe(
            v.string(`${serverSideErrors("emailType")}`),
            v.nonEmpty(`${serverSideErrors("emailType")}`),
        )
    })
    const dataEntry = await prisma.form.create({
        data: {
            fullName: data.get("fullName") as unknown as string,
            email: data.get("email") as unknown as string,
            age: Number(data.get("age")) as unknown as number,
            phoneNumber: Number(data.get("phoneNumber")) as unknown as number,
            imageUrl: data.get("imageUrl"),
            photoTitle: data.get("photoTitle") as unknown as string,
            comment: data.get("comments") as unknown as unknown as string,
            photoLocation: data.get("photoLocation") as unknown as string,
            photoPurpose: data.get("photoPurpose") as unknown as string,
        }
    })

    return NextResponse.json({success: true, msg: "Successfully uploaded"})
}