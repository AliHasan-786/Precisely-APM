import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------------------------------------------------------------------------
// Mock PRD generator (used when backend is unavailable)
// ---------------------------------------------------------------------------

function generateMockPRD(featureName: string, competitor: string) {
  const templates = [
    {
      title: `Add AI-assisted ${featureName.substring(0, 45).trim()}`,
      user_story: `As a data steward at an enterprise Precisely customer, I want an AI-powered ${featureName.toLowerCase().substring(0, 60)} capability so that I can work more efficiently and we remain competitive against ${competitor || "market leaders"} in customer evaluations.`,
      acceptance_criteria: [
        `Feature is accessible from the main Precisely product navigation without additional plugins or configuration`,
        `Core functionality is on par with or exceeds what ${competitor || "competitors"} offer, with documented benchmark results`,
        `Performance meets a defined SLA — specify latency and throughput targets in the technical specification`,
        `Feature is available to all existing enterprise customers with no migration or re-onboarding required`,
        `In-app documentation, tooltips, and a getting-started guide are available at launch`,
        `Feature telemetry is instrumented so usage can be tracked in the product analytics dashboard`,
      ],
      technical_notes: `Leverage Precisely's existing DQ rules engine and Connect2 connector framework as the foundation. Evaluate whether to build natively or through a technology partnership. Recommend a 6-week prototype sprint followed by a full GA release within the quarter.`,
      priority: "P1",
    },
  ];

  return templates[0];
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

    // Try backend first
    try {
      const response = await fetch(`${API_URL}/api/draft-requirement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Backend returned ${response.status}`);

      const data = await response.json();
      return NextResponse.json(data);
    } catch {
      // Backend down — generate deterministic mock PRD
      const prd = generateMockPRD(body.feature_name, body.competitor || "");
      return NextResponse.json({ ...prd, _source: "mock" });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
