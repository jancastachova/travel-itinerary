import "dotenv/config"
// import { PrismaClient } from '../../../app/generated/prisma/client'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { scoreDestinations } from "../../../src/lib/scoring"
import { NextResponse } from "next/server"
import { GoogleGenAI, Type } from "@google/genai"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_AI_KEY
})

const itinerarySchema = {
    type: Type.OBJECT,
    properties: {
        days: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    dayNumber: { type: Type.INTEGER },
                    time: { type: Type.STRING },
                    activity: { type: Type.STRING }
                },
                required: ["dayNumber","time","activity"]
            }
        }
    },
    required: ["days"],
};

export async function POST(request: Request){
    try{
        const body = await request.json()
        const destinations = await prisma.destination.findMany({
            include: { tags: true }
        })
        const winner = scoreDestinations(body, destinations)

        if(!winner) return NextResponse.json({ error:'No destionation was found'}, {status: 404});

        const aiResponse = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: `Create a detailed and nice itinerary for this destionation: ${winner.name}. Number of days: ${body.days}
                        Style of vacation:
                        Budget: ${body.budget}, Interests: ${body.preferredTags.join(', ')}
                        Be specific and not general, put tips for some things etc
                        Also, please always start the trip with arrival and end with departure`,
            config: {
                systemInstruction: "Youre elite travel guide and generate perfect itineraries based on user preferences",
                responseMimeType: "application/json",
                responseSchema: itinerarySchema
            }
        });
        
        const aiItinerary = JSON.parse(aiResponse.text || "{}")

        return NextResponse.json({ destination: winner,
                                    aiDays: aiItinerary.days
         });
    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        )
    }
}