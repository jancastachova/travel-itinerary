import "dotenv/config"
// import { PrismaClient } from '../../../app/generated/prisma/client'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { scoreDestinations } from "../../../src/lib/scoring"
import { NextResponse } from "next/server"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function POST(request: Request){
    try{
        const body = await request.json()
        const destinations = await prisma.destination.findMany({
            include: { tags: true }
        })
        const winner = scoreDestinations(body, destinations)
        return NextResponse.json({ destination: winner })
    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        )
    }
}