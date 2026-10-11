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
      Create a tailored, high-quality travel itinerary based on the following parameters:
      - Destination: ${winner.name}
      - Duration: ${body.days} days
      - Budget Level: ${body.budget}
      - Interests / Tags: ${body.preferredTags?.join(", ") || "general"}

      CRITICAL ITINERARY RULES:
      1. NON-BASIC & SPECIFIC: Avoid generic descriptions like "visit local market" or "eat dinner." Name specific local spots, recommended restaurants, secret/hidden gems, and distinct places to relax or explore based on the user's tags.
      2. TAG-BASED PACING & ACTIVITY COUNTS:
        - Base the entire vibe of the trip on the provided tags.
        - Keep daily activity counts between 2 to 6 items per day:
          * If tags include "RELAXED", limit to 2–4 activities/day with ample leisure time and relaxed spot recommendations.STRICT REQUIREMENT!!!! 
          * If tags include "ADVENTURE" or "SIGHTSEEING", range between 3–6 activities/day. STRICT REQUIREMENT!!!! 
      3. TRIP BOUNDARIES: Always start Day 1 with arrival/hotel transfer and end the final day with departure.
      4. SMART LOGISTICS: Group activities geographically each day so travel is logical, manageable, and nearby. Avoid excessive or erratic back-and-forth travel across the destination.
      5. MAP MARKERS & COORDINATES (CRITICAL):
        - Provide accurate latitude ('lat') and longitude ('lng') for EVERY place/activity generated.
        - All points will be plotted on a map. EVEN IF TWO PLACES SHARE THE EXACT SAME LOCATION (e.g., hotel check-in, hotel dining, or nearby venues), NEVER output identical lat and lng coordinates. Apply a micro-offset (e.g., ±0.0005 to ±0.0015) so every single marker remains distinct and visible on the map.

      STRICT OUTPUT FORMAT RULES:
      - Return ONLY a raw, valid JSON object.
      - Do NOT wrap the JSON in markdown code blocks (no \`\`\`json or \`\`\`).
      - Do NOT include intro, outro, or conversational text.

      JSON STRUCTURE:
      {
        "days": [
          {
            "dayNumber": 1,
            "activities": [
              {
                "time": "09:00",
                "description": "Arrival at airport, pick up pocket Wi-Fi, and transfer to hotel via prepaid taxi.",
                "lat": -8.7481,
                "lng": 115.1671
              }
            ]
          }
        ]
      }
      `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an elite travel guide. You respond ONLY with valid JSON formatted file",
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
      { status: 500 },
    );
  }
}
