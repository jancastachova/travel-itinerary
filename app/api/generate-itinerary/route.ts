import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { scoreDestinations } from "../../../src/lib/scoring";
import { NextResponse } from "next/server";
import { generateItinerary } from "./llmService";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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

    const aiItinerary = await generateItinerary(winner, body);

    return NextResponse.json({ destination: winner, aiDays: aiItinerary.days });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
