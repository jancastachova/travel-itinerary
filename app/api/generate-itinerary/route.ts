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

    if (!winner)
      return NextResponse.json(
        { error: "No destionation was found" },
        { status: 404 },
      );

    const prompt = `
            Create a detailed and nice itinerary for this destionation: ${winner.name}. Number of days: ${body.days}
                        Style of vacation:
                        Budget: ${body.budget}, Interests: ${body.preferredTags.join(", ")}
                        Be specific and not general, put tips for some things etc
                        Also, please always start the trip with arrival and end with departure
        `;

    // const aiResponse = await ai.models.generateContent({
    //   model: "gemini-3.5-flash-pro",
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
        {
          dayNumber: 3,
          activities: [
            {
              time: "09:30",
              description:
                "Výlet na místní tržnici, ochutnávka pouličního jídla a nákup lokálních surovin.",
            },
            {
              time: "13:00",
              description:
                "Odpolední siesta v parku spojená s lehkým piknikem.",
            },
            {
              time: "16:00",
              description:
                "Prohlídka moderní čtvrti s architektonickými skvosty a street artem.",
            },
          ],
        },
        {
          dayNumber: 4,
          activities: [
            {
              time: "08:00",
              description:
                "Celodenní výlet do blízkého okolí (přírodní rezervace nebo historické městečko).",
            },
            {
              time: "12:30",
              description: "Tradiční oběd v rodinné hospůdce na venkově.",
            },
            {
              time: "17:00",
              description: "Návrat zpět do města a zasloužený odpočinek.",
            },
          ],
        },
        {
          dayNumber: 5,
          activities: [
            {
              time: "10:00",
              description: "Kulinářský kurz vaření s místním šéfkuchařem.",
            },
            {
              time: "15:00",
              description:
                "Nákupy suvenýrů a volné odpoledne pro vlastní objevování.",
            },
            {
              time: "21:00",
              description:
                "Návštěva vyhlášeného jazzového klubu nebo střešního baru s koktejly.",
            },
          ],
        },
        {
          dayNumber: 6,
          activities: [
            {
              time: "09:00",
              description: "Poslední ranní káva a snídaně v oblíbené kavárně.",
            },
            {
              time: "11:00",
              description: "Balení věcí na hotelu a závěrečný check-out.",
            },
            {
              time: "14:00",
              description: "Přesun na letiště a odlet domů.",
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
