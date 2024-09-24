import {NextRequest, NextResponse} from "next/server";
import * as v from "valibot";
import {prisma} from "@/prisma/prisma";

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.formData()


    const paramsSchema = v.object({
        email: v.pipe(v.string(), v.email(), v.nonEmpty()),
        phoneNumber: v.pipe(v.string(), v.maxLength(10), v.minLength(10), v.nonEmpty())
    })


    try {
        const paramsData = v.parse(
            paramsSchema,
            {
                email: data.get("email"),
                phoneNumber: data.get("number"),
            }
        )

        const email = await prisma.request.count({
            where: {email: paramsData.email},
        })


        const number = await prisma.request.count({
            where: {phoneNumber: paramsData.phoneNumber},
        })

        if (email == 0 && number == 0) {
            return NextResponse.json({message: "user is new"})
        } else {
            return NextResponse.json({error: "used error"}, {status: 500});
        }


    } catch (e) {
        // @ts-ignore

        return NextResponse.json({err: e}, {status: 500});

    }


}