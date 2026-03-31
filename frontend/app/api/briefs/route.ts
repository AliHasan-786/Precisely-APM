import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------------------------------------------------------------------------
// Mock briefs (used when backend is unavailable)
// ---------------------------------------------------------------------------

const MOCK_BRIEFS = [
  // Informatica
  {
    id: "brief-1",
    competitor_id: "comp-1",
    competitor_name: "Informatica",
    feature_name: "Informatica launches AI-powered data lineage tracing",
    description:
      "Informatica announced CLAIRE-driven end-to-end data lineage that automatically maps data flows across cloud warehouses, ETL pipelines, and BI dashboards. The feature uses LLM embeddings to surface impact analysis in natural language, reducing lineage investigation time by up to 60% according to their beta customers.",
    gap_analysis:
      "**Gap identified:** Precisely's current data lineage offering is limited to manual mapping within its Data360 Govern module. There is no AI-assisted auto-discovery or natural language impact query.\n\n**Precisely strength to leverage:** Our address validation and geocoding accuracy (99.7%) is market-leading and could be embedded in lineage nodes to flag data quality degradation at the source — a differentiated angle Informatica does not offer.\n\n**Recommended action:** Accelerate the AI lineage roadmap item and consider a 'quality-aware lineage' differentiator that surfaces DQ scores inline.",
    priority: "High",
    source_url: "https://www.informatica.com/blogs.html",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "brief-2",
    competitor_id: "comp-1",
    competitor_name: "Informatica",
    feature_name: "Informatica Cloud integrates with Microsoft Fabric natively",
    description:
      "Informatica released a native connector for Microsoft Fabric, allowing IDMC pipelines to read/write directly to OneLake. The integration supports schema-on-read and live query federation, making it a strong play for Microsoft-heavy enterprise accounts.",
    gap_analysis:
      "**Gap identified:** Precisely does not yet have a certified Microsoft Fabric connector. Customers using Azure-centric stacks must use generic ODBC adapters.\n\n**Risk level:** Medium-High. Microsoft Fabric is the fastest-growing data platform in the enterprise segment. Accounts standardising on Fabric may evaluate Informatica over Precisely.\n\n**Recommended action:** Prioritise Fabric-native connector in H1 roadmap. Co-marketing with Microsoft would accelerate reach.",
    priority: "High",
    source_url: "https://www.informatica.com/blogs.html",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "brief-3",
    competitor_id: "comp-1",
    competitor_name: "Informatica",
    feature_name: "CLAIRE GPT chat interface for data stewards goes GA",
    description:
      "Informatica's CLAIRE GPT assistant — which allows data stewards to ask natural language questions about data quality issues, trigger remediation workflows, and get plain-English summaries — has graduated from beta to general availability.",
    gap_analysis:
      "**Gap identified:** Precisely lacks a conversational AI layer for data stewards. Our governance workflows require navigating multiple UI screens.\n\n**Precisely strength:** Our DQ rule engine is more configurable than CLAIRE's, but the chat abstraction lowers the barrier to entry for non-technical users significantly.\n\n**Recommended action:** Evaluate adding an LLM-powered 'Ask Precisely' assistant as a thin UX layer over existing APIs. This could be a 6-week prototype.",
    priority: "Medium",
    source_url: "https://www.informatica.com/blogs.html",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Talend
  {
    id: "brief-4",
    competitor_id: "comp-2",
    competitor_name: "Talend",
    feature_name: "Talend adds zero-code pipeline builder with drag-and-drop AI transforms",
    description:
      "Talend Data Fabric 8.0 ships a redesigned zero-code pipeline studio where users can drag AI-powered transform blocks (deduplication, address standardisation, entity resolution) into pipelines without writing any code.",
    gap_analysis:
      "**Gap identified:** Talend's zero-code approach directly competes with Precisely's target persona of data analysts who are not engineers. Our studio requires more technical knowledge to configure address validation transforms.\n\n**Precisely strength:** Our address validation accuracy is demonstrably superior to Talend's bundled standardisation — we should lean into this in competitive deals.\n\n**Recommended action:** Improve the no-code configuration experience for address validation. Create a competitive battle card highlighting accuracy benchmarks.",
    priority: "High",
    source_url: "https://www.talend.com/blog/",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "brief-5",
    competitor_id: "comp-2",
    competitor_name: "Talend",
    feature_name: "Talend Trust Score now benchmarks against industry peers",
    description:
      "Talend Trust Score now allows customers to benchmark their scores anonymously against industry peers in the same vertical. This turns a vanity metric into a competitive insight tool used in sales conversations as a land-and-expand trigger.",
    gap_analysis:
      "**Gap identified:** Precisely has no equivalent benchmarking or community trust score feature.\n\n**Opportunity:** Precisely processes billions of address and entity records — we have the data to power a credible industry benchmark product.\n\n**Recommended action:** Explore a 'Precisely Data Health Index' product concept. Could begin as a report/whitepaper before becoming a product feature.",
    priority: "Medium",
    source_url: "https://www.talend.com/blog/",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Collibra
  {
    id: "brief-6",
    competitor_id: "comp-3",
    competitor_name: "Collibra",
    feature_name: "Collibra releases automated data governance workflows with AI policy suggestions",
    description:
      "Collibra Workflow Automation now includes an AI policy advisor that analyses existing data assets and suggests governance policies (retention, access controls, stewardship assignments). Policies can be approved and activated in one click.",
    gap_analysis:
      "**Gap identified:** Precisely Data360 Govern requires manual policy authoring. There is no AI-assisted policy suggestion capability today.\n\n**Collibra's weakness:** Their automation is strong but they lack the data quality enforcement layer — policies are defined but not operationalised at the data level.\n\n**Recommended action:** Position Precisely as 'governance that enforces itself' — pair AI policy suggestions with our existing DQ rules engine to create a uniquely actionable governance story.",
    priority: "High",
    source_url: "https://www.collibra.com/blog/",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "brief-7",
    competitor_id: "comp-3",
    competitor_name: "Collibra",
    feature_name: "Collibra expands data marketplace to support internal data products",
    description:
      "Collibra Data Marketplace now supports an internal data product catalog where teams can publish, discover, and subscribe to curated datasets as products. Strong adoption in FSI customers with data mesh architectures.",
    gap_analysis:
      "**Gap identified:** Precisely does not offer a data product marketplace or catalog layer. Customers with data mesh strategies may see Collibra as a more modern fit.\n\n**Precisely angle:** Our data enrichment capabilities are prime candidates to be published as data products.\n\n**Recommended action:** Evaluate a Collibra marketplace integration to list Precisely enrichment datasets. Reduces competitive threat and opens a new distribution channel.",
    priority: "Medium",
    source_url: "https://www.collibra.com/blog/",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Ataccama
  {
    id: "brief-8",
    competitor_id: "comp-4",
    competitor_name: "Ataccama",
    feature_name: "Ataccama ONE introduces real-time data quality monitoring with anomaly alerts",
    description:
      "Ataccama ONE now streams DQ metrics to a real-time monitoring dashboard with configurable anomaly detection thresholds. Alerts are sent to Slack, Teams, or PagerDuty when quality drops below threshold.",
    gap_analysis:
      "**Gap identified:** Precisely's DQ monitoring is primarily batch-oriented. Real-time streaming DQ is an emerging requirement in the DataOps segment that we are not currently addressing.\n\n**Precisely strength:** Our data quality rules are more mature and configurable; we need to add the real-time delivery mechanism.\n\n**Recommended action:** Evaluate a real-time DQ streaming feature using Kafka/Kinesis integration. This is a natural extension of our existing rules engine.",
    priority: "Medium",
    source_url: "https://www.ataccama.com/blog",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Experian
  {
    id: "brief-9",
    competitor_id: "comp-5",
    competitor_name: "Experian",
    feature_name: "Experian launches identity resolution API for real-time customer 360",
    description:
      "Experian has launched an Identity Resolution API delivering sub-100ms match decisions for real-time customer 360 use cases using probabilistic and deterministic matching. Designed for CRM and CDP embedding.",
    gap_analysis:
      "**Direct competitive overlap:** Precisely offers entity resolution capabilities, but Experian's real-time API with sub-100ms SLA targets the same CRM/CDP integration use case.\n\n**Precisely differentiation:** Our address validation layer adds a verification signal that pure identity resolution misses — a merged record with a validated address is more trustworthy.\n\n**Recommended action:** Create joint solution brief: 'Identity + Address = Verified Customer.' Develop a battle card for deals where Experian's identity API is mentioned.",
    priority: "High",
    source_url: "https://www.experian.com/blogs/insights/",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "brief-10",
    competitor_id: "comp-5",
    competitor_name: "Experian",
    feature_name: "Experian adds global address verification for 245 countries",
    description:
      "Experian QAS has extended address verification coverage to 245 countries with enhanced support for Southeast Asia and Sub-Saharan Africa, including local-language transliteration and geocoding.",
    gap_analysis:
      "**Direct threat to core Precisely business:** Address verification is Precisely's flagship capability. Experian expanding global coverage narrows our geographic differentiation advantage.\n\n**Recommended action:** Commission a third-party accuracy benchmark for Southeast Asia and Africa. If we lead, publicise it; if we lag, prioritise coverage investment in those regions.",
    priority: "High",
    source_url: "https://www.experian.com/blogs/insights/",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const competitor = searchParams.get("competitor");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const backendUrl = new URL(`${API_URL}/api/briefs`);
  if (competitor) backendUrl.searchParams.set("competitor", competitor);
  backendUrl.searchParams.set("limit", limit.toString());
  backendUrl.searchParams.set("offset", offset.toString());

  try {
    const response = await fetch(backendUrl.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) throw new Error(`Backend returned ${response.status}`);

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    // Backend is down — filter and return mock data
    let briefs = MOCK_BRIEFS;
    if (competitor) {
      briefs = briefs.filter((b) => b.competitor_name === competitor);
    }
    const total = briefs.length;
    const paginated = briefs.slice(offset, offset + limit);
    return NextResponse.json({ briefs: paginated, total, limit, offset, _source: "mock" });
  }
}
