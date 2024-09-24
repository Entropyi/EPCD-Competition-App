import {NextRequest, NextResponse} from "next/server";
import * as v from "valibot";
import {prisma} from "@/prisma/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
    const reqUrl = new URL(req.url);

    const paramsSchema = v.object({
        email: v.pipe(v.string(), v.email(), v.nonEmpty()),
        phoneNumber: v.pipe(v.string(), v.maxLength(10), v.minLength(10), v.nonEmpty())
    })

    try {
        const paramsData = v.parse(
            paramsSchema,
            {
                email: reqUrl.searchParams.get("email"),
                phoneNumber: reqUrl.searchParams.get("number"),
            }
        )

        const email = await prisma.request.count({
            where: {email: paramsData.email},
        })


        const number = await prisma.request.count({
            where: {email: paramsData.phoneNumber},
        })


        if (email == 0 && number == 0) {
            return NextResponse.json({message: "user is new"})
        } else {
            return NextResponse.json({error: "used error"}, {status: 500});
        }


    } catch (e) {
        // @ts-ignore
        if (e.issues[0].type == "email") {
            return NextResponse.json({err: "email invalid"}, {status: 500});
            // @ts-ignore
        } else if (e.issues[0].path[0].key == "phoneNumber") {
            return NextResponse.json({err: "phoneNumber invalid"}, {status: 500});
        } else {
            return NextResponse.json({err: e}, {status: 500});
        }

    }


}