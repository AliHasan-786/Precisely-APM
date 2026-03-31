import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// OpenRouter LLM call
// ---------------------------------------------------------------------------

async function generateLLMPRD(
  featureName: string,
  description: string,
  gapAnalysis: string,
  competitor: string
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("No API key");

  const prompt = `You are a senior Product Manager at Precisely, a data integrity company. A competitor (${competitor || "a competitor"}) just launched the following feature:

Feature: ${featureName}
Description: ${description}
Gap Analysis: ${gapAnalysis || "This feature does not currently exist in Precisely's platform."}

Write a concise product requirement ticket for Precisely to counter this move. Return ONLY valid JSON in this exact shape:
{
  "title": "short action-oriented title (max 10 words)",
  "user_story": "As a [persona], I want [capability] so that [benefit]",
  "acceptance_criteria": ["criterion 1", "criterion 2", "criterion 3", "criterion 4"],
  "technical_notes": "2-3 sentences on implementation approach using Precisely's existing platform (data quality engine, Connect2 connectors, address validation, location intelligence)",
  "priority": "P1"
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://precisely-apm.vercel.app",
      "X-Title": "Precisely PM-Intel Agent",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  if (!data.choices?.length) throw new Error("OpenRouter returned no choices");
  const content = data.choices[0].message.content.trim();

  // Strip markdown code fences if present
  const jsonStr = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  try {
    return JSON.parse(jsonStr);
  } catch {
    throw new Error("LLM returned non-JSON output");
  }
}

// ---------------------------------------------------------------------------
// Mock fallback
// ---------------------------------------------------------------------------

function generateMockPRD(featureName: string, competitor: string) {
  return {
    title: `Add AI-assisted ${featureName.substring(0, 45).trim()}`,
    user_story: `As a data steward at an enterprise Precisely customer, I want an AI-powered ${featureName.toLowerCase().substring(0, 60)} capability so that I can work more efficiently and remain competitive against ${competitor || "market leaders"}.`,
    acceptance_criteria: [
      `Feature is accessible from the main Precisely product navigation without additional configuration`,
      `Core functionality is on par with or exceeds what ${competitor || "competitors"} offer, with documented benchmark results`,
      `Performance meets a defined SLA — latency and throughput targets specified in the technical spec`,
      `Feature telemetry is instrumented so usage can be tracked in the product analytics dashboard`,
    ],
    technical_notes: `Leverage Precisely's existing DQ rules engine and Connect2 connector framework as the foundation. Recommend a 6-week prototype sprint followed by full GA within the quarter.`,
    priority: "P1",
    _source: "mock",
  };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      brief_id?: string;
      feature_name: string;
      description: string;
      gap_analysis?: string;
      competitor?: string;
    };

    if (!body.feature_name || !body.description) {
      return NextResponse.json(
        { error: "feature_name and description are required" },
        { status: 400 }
      );
    }

    // Truncate inputs to safe lengths before passing to LLM
    const truncate = (s: string, n: number) => s.length > n ? s.slice(0, n) + "..." : s;
    const safeFeature = truncate(body.feature_name, 200);
    const safeDesc = truncate(body.description, 500);
    const safeGap = truncate(body.gap_analysis || "", 500);
    const safeCompetitor = truncate(body.competitor || "", 100);

    // Try real LLM first, fall back to mock
    try {
      const prd = await generateLLMPRD(
        safeFeature,
        safeDesc,
        safeGap,
        safeCompetitor
      );
      return NextResponse.json({ ...prd, _source: "llm" });
    } catch {
      const prd = generateMockPRD(safeFeature, safeCompetitor);
      return NextResponse.json(prd);
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
