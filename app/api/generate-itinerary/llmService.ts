import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateItinerary(winner: any, body: any) {
  const prompt = `
    Create a structured travel itinerary in raw JSON format.

        PARAMETERS:
        - Destination: ${winner.name}
        - Days: ${body.days}
        - Budget: ${body.budget}
        - Interests: ${body.preferredTags?.join(", ") || "general"}

        RULES:
        1. Pace: 2 to 5 activities per day(does not have to be same number of activities every day) based on tags (fewer if relaxed type of vacation was chosen). 
        2. Boundaries: Start Day 1 with arrival/transfer and end the last day with departure.
        3. Logistics: Group geographically close locations together on the same day.
        4. Specificity: Recommend specific spots/restaurants. Do not be too basic with the itinerary. Keep descriptions short (10-15 words max).
        5. Map Coordinates: Output accurate "lat" and "lng" as numbers. If locations overlap, add a minor coordinate offset (+/- 0.001) so markers remain distinct.

        STRICT JSON ONLY (no markdown code blocks, no intro text):
        {
        "days": [
            {
            "dayNumber": 1,
            "activities": [
                { "time": "09:00", "description": "Arrival at airport and private transfer to hotel.", "lat": 31.6189, "lng": -8.0363 }
            ]
            }
        ]
        }`;

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
            max_tokens: 4096,
        });
        
        const content = chatCompletion.choices[0]?.message?.content || "{}";
        return JSON.parse(content);
}
