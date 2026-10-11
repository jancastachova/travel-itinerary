import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { scoreDestinations } from "../../../src/lib/scoring";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const destinations = await prisma.destination.findMany({
      include: { tags: true },
    });
    const winner = scoreDestinations(body, destinations);

    if (!winner)
      return NextResponse.json(
        { error: "No destination was found" },
        { status: 404 },
      );

    const prompt = `
      Create a detailed and nice itinerary for destination: ${winner.name}. Number of days: ${body.days}
      Style of vacation: Budget: ${body.budget}, Interests: ${body.preferredTags?.join(", ") || "general"}
      Be specific,not general and put tips for things etc, but also do not make it so detailed, KEEP IT BRIEF(MAX 5 TIMES A DAY)
      Make sure it has a good logistics.. that each day makes sence and places are close to each other.
      Always start the trip with arrival and end with departure.
      The tags are VERY important, it there is RELAXED tag, make sure you do not put so many markers etc.
      Additionally, to all places you're about to generate please add their correct latitude and longitude (please keep in mind that i will show the points on the map so do not overload the same places with the exaclty same lat and long)

      RETURN ONLY A VALID JSON OBJECT formatted like this(no extra commentary, no markdown text):
      {
        "days": [
          {
            "dayNumber": 1,
            "activities": [
              { "time": "09:00", "description": "Arrival at airport and hotel check-in", "lat": -8.7481, "lng": 115.1671 }
            ]
          }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an elite travel guide. You respond ONLY with valid JSON formatted file",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const aiItinerary = JSON.parse(content);

    return NextResponse.json({ destination: winner, aiDays: aiItinerary.days });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}