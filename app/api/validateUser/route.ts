import {prisma} from "@/prisma/prisma"
import {NextRequest, NextResponse} from "next/server";
import * as v from "valibot";
import { cookies } from 'next/headers'

export async function GET(req: NextRequest, res: NextResponse) {
    return NextResponse.json({success: true, msg: "GET works"})
}

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.formData()

    const emailSchema = v.object({
        email: v.pipe(
            v.string(),
            v.email(),
            v.nonEmpty(),
        ),
    });

    try {
        const email = v.parse(
            emailSchema,
            {
                email: data.get("email"),
            }
        )

        const usersEmailCount = await prisma.user.count({
            where: {email: email.email},
        })

        const FormEntriesCount = await prisma.form.count({
            where: {email: email.email},
        })

        if (usersEmailCount === 0) {
            await prisma.user.create({
                data: {
                    email: email.email,
                }
            })
        } else if (FormEntriesCount === 0) {
            cookies().set('newUser', 'true')
            return NextResponse.json({newUser: true});
        }

        return NextResponse.json({success: true, msg: usersEmailCount});

    } catch (e) {
        return NextResponse.json({success: true, msg: "Error Validating Emails"})
    }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
    const deleteUsers = await prisma.user.deleteMany({})
    return NextResponse.json({success: true, msg: deleteUsers})
}
