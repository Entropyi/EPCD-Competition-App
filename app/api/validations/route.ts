import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from '@prisma/client'
import * as v from "valibot";


export async function GET(req: NextRequest, res: NextResponse) {
    const reqUrl = new URL(req.url);

    const paramsSchema = v.object({
        email: v.pipe(v.string(), v.email(), v.nonEmpty()),
        phoneNumber: v.pipe(v.string(), v.maxLength(10), v.minLength(10), v.nonEmpty())
    })

    try{
        const paramsDara = v.parse(
            paramsSchema,
            {
                email: reqUrl.searchParams.get("email"),
                phoneNumber: reqUrl.searchParams.get("number"),
            }
        )

        return NextResponse.json({success: true, email: paramsDara.email});

    } catch (e){
        return NextResponse.json({success: false, err:e.[0].kind} , {status:500});

    }


}