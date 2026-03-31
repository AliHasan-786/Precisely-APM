import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------------------------------------------------------------------------
// Mock data (used when backend is unavailable)
// ---------------------------------------------------------------------------

const MOCK_COMPETITORS = [
  {
    id: "comp-1",
    name: "Informatica",
    url: "https://www.informatica.com/blogs.html",
    logo_url: null,
    last_scraped_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    brief_count: 3,
    latest_brief: "CLAIRE AI assistant gets natural language data lineage queries",
  },
  {
    id: "comp-2",
    name: "Talend",
    url: "https://www.talend.com/blog/",
    logo_url: null,
    last_scraped_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    brief_count: 2,
    latest_brief: "Talend adds zero-code pipeline builder with drag-and-drop AI transforms",
  },
  {
    id: "comp-3",
    name: "Collibra",
    url: "https://www.collibra.com/blog/",
    logo_url: null,
    last_scraped_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    brief_count: 2,
    latest_brief: "Collibra releases automated data governance workflows with AI policy suggestions",
  },
  {
    id: "comp-4",
    name: "Ataccama",
    url: "https://www.ataccama.com/blog",
    logo_url: null,
    last_scraped_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    brief_count: 1,
    latest_brief: "Ataccama ONE introduces real-time data quality monitoring with anomaly alerts",
  },
  {
    id: "comp-5",
    name: "Experian",
    url: "https://www.experian.com/blogs/insights/",
    logo_url: null,
    last_scraped_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    brief_count: 2,
    latest_brief: "Experian launches identity resolution API for real-time customer 360",
  },
];

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/competitors`, {
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!response.ok) throw new Error(`Backend returned ${response.status}`);

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    // Backend is down — return mock data so the frontend works standalone
    return NextResponse.json({
      competitors: MOCK_COMPETITORS,
      total: MOCK_COMPETITORS.length,
      _source: "mock",
    });
  }
}
