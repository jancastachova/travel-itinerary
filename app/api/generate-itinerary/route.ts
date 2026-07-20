import "dotenv/config";
// import { PrismaClient } from '../../../app/generated/prisma/client'
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { scoreDestinations } from "../../../src/lib/scoring";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_AI_KEY,
});

const itinerarySchema = {
  type: "object",
  properties: {
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          dayNumber: { type: "integer" },
          activities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                time: { type: "string" },
                description: { type: "string" },
              },
              required: ["time", "description"],
            },
          },
        },
        required: ["dayNumber", "activities"],
      },
    },
  },
  required: ["days"],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const destinations = await prisma.destination.findMany({
      include: { tags: true },
    });
    const winner = scoreDestinations(body, destinations);

    if (!winner) return NextResponse.json({ error: "No destionation was found" },{ status: 404 });

    const prompt = `
            Create a detailed and nice itinerary for this destionation: ${winner.name}. Number of days: ${body.days}
                        Style of vacation:
                        Budget: ${body.budget}, Interests: ${body.preferredTags.join(', ')}
                        Be specific and not general, put tips for some things etc
                        Also, please always start the trip with arrival and end with departure
        `;

    // const aiResponse = await ai.models.generateContent({
    //   model: "gemini-3.5-flash",
    //   contents: prompt,
    //   config: {
    //     systemInstruction:
    //       "Youre elite travel guide and generate perfect itineraries based on user preferences",
    //     responseMimeType: "application/json",
    //     responseSchema: itinerarySchema,
    //   },
    // });

    // const aiItinerary = JSON.parse(aiResponse.text || "{}");

    const aiItinerary = {
      days: [
        {
          dayNumber: 1,
          activities: [
            {
              time: "09:00",
              description: "Přílet na letiště, přesun na hotel a check-in.",
            },
            {
              time: "14:00",
              description: "Prohlídka historického centra a hlavní katedrály.",
            },
            {
              time: "19:00",
              description:
                "Welcome večeře v lokální restauraci s ochutnávkou specialit.",
            },
          ],
        },
        {
          dayNumber: 2,
          activities: [
            {
              time: "10:00",
              description:
                "Návštěva slavného muzea a procházka v přilehlých zahradách.",
            },
            {
              time: "15:00",
              description:
                "Hidden gem: Tajná vyhlídka na město bez turistů (doporučujeme kávu s sebou).",
            },
            {
              time: "20:00",
              description:
                "Večerní plavba nebo procházka kolem osvětlených památek.",
            },
          ],
        },
      ],
    };

    return NextResponse.json({ destination: winner, aiDays: aiItinerary.days });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
