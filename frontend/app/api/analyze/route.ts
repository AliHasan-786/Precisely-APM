import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRECISELY_CONTEXT = `Precisely's core capabilities:
- Address validation and verification (99.7% accuracy, 245+ countries)
- Geocoding and location intelligence
- Data quality rules engine (batch and near-real-time)
- Data enrichment (demographics, firmographics, property data)
- Entity resolution and Master Data Management (MDM)
- Data governance via the Data360 platform`;

async function generateAnalysis(competitor: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("No API key configured");

  const prompt = `You are a competitive intelligence analyst at Precisely, a data integrity company.

${PRECISELY_CONTEXT}

Generate exactly 2 realistic, specific competitive intelligence briefs about recent product developments from ${competitor} in the data management and data integrity space. These should represent plausible features that compete with Precisely's capabilities.

Return ONLY a valid JSON array with no markdown:
[
  {
    "feature_name": "concise title of the feature or announcement (max 15 words)",
    "description": "2-3 sentences explaining what ${competitor} launched, what it does, and why enterprise customers care about it",
    "gap_analysis": "Start with **Gap identified:** then explain the competitive risk to Precisely. Then on a new line start with **Precisely advantage:** and describe where Precisely has an edge. Then on a new line start with **Recommended action:** with a specific, actionable suggestion.",
    "priority": "High"
  },
  {
    "feature_name": "...",
    "description": "...",
    "gap_analysis": "...",
    "priority": "Medium"
  }
]`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://precisely-apm.vercel.app",
      "X-Title": "Precisely PM-Intel Agent",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0].message.content.trim();
  const jsonStr = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(jsonStr) as Array<{
    feature_name: string;
    description: string;
    gap_analysis: string;
    priority: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { competitor?: string };
    const competitor = body.competitor || "Informatica";

    const raw = await generateAnalysis(competitor);

    const briefs = raw.map((b, i) => ({
      id: `live-${Date.now()}-${i}`,
      competitor_id: `live-${competitor.toLowerCase().replace(/\s+/g, "-")}`,
      competitor_name: competitor,
      feature_name: b.feature_name,
      description: b.description,
      gap_analysis: b.gap_analysis,
      priority: b.priority as "High" | "Medium" | "Low",
      source_url: null,
      created_at: new Date().toISOString(),
      _live: true,
    }));

    return NextResponse.json({ briefs, _source: "llm" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Analysis failed: ${message}`, briefs: [] },
      { status: 500 }
    );
  }
}
