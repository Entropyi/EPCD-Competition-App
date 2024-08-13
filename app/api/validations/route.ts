import { NextApiRequest, NextApiResponse } from 'next';
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { email, number } = req.query;
    res.status(200).json({ number: number, email: email });
}