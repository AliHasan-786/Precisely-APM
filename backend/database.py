"""Database layer: Supabase client with in-memory mock fallback."""

from __future__ import annotations

import os
import logging
from datetime import datetime, timedelta
from typing import Optional
from uuid import uuid4

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Try to import supabase; fall back gracefully
# ---------------------------------------------------------------------------
try:
    from supabase import create_client, Client
    _supabase_available = True
except ImportError:
    _supabase_available = False
    logger.warning("supabase-py not installed — using mock data")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

_client: Optional[object] = None


def get_client():
    """Return Supabase client or None if not configured."""
    global _client
    if _client:
        return _client
    if _supabase_available and SUPABASE_URL and SUPABASE_KEY:
        try:
            _client = create_client(SUPABASE_URL, SUPABASE_KEY)
            logger.info("Connected to Supabase at %s", SUPABASE_URL)
            return _client
        except Exception as exc:
            logger.error("Failed to connect to Supabase: %s", exc)
    logger.info("Supabase not configured — mock data mode active")
    return None


# ---------------------------------------------------------------------------
# Mock data
# ---------------------------------------------------------------------------

_now = datetime.utcnow()

MOCK_COMPETITORS = [
    {
        "id": "comp-1",
        "name": "Informatica",
        "url": "https://www.informatica.com/blogs.html",
        "logo_url": None,
        "last_scraped_at": (_now - timedelta(hours=2)).isoformat(),
    },
    {
        "id": "comp-2",
        "name": "Talend",
        "url": "https://www.talend.com/blog/",
        "logo_url": None,
        "last_scraped_at": (_now - timedelta(hours=2)).isoformat(),
    },
    {
        "id": "comp-3",
        "name": "Collibra",
        "url": "https://www.collibra.com/blog/",
        "logo_url": None,
        "last_scraped_at": (_now - timedelta(days=1)).isoformat(),
    },
    {
        "id": "comp-4",
        "name": "Ataccama",
        "url": "https://www.ataccama.com/blog",
        "logo_url": None,
        "last_scraped_at": (_now - timedelta(days=2)).isoformat(),
    },
    {
        "id": "comp-5",
        "name": "Experian",
        "url": "https://www.experian.com/blogs/insights/",
        "logo_url": None,
        "last_scraped_at": (_now - timedelta(days=5)).isoformat(),
    },
]

MOCK_BRIEFS = [
    # Informatica
    {
        "id": "brief-1",
        "competitor_id": "comp-1",
        "competitor_name": "Informatica",
        "feature_name": "Informatica launches AI-powered data lineage tracing",
        "description": (
            "Informatica announced CLAIRE-driven end-to-end data lineage that automatically "
            "maps data flows across cloud warehouses, ETL pipelines, and BI dashboards. "
            "The feature uses LLM embeddings to surface impact analysis in natural language, "
            "reducing lineage investigation time by up to 60% according to their beta customers."
        ),
        "gap_analysis": (
            "**Gap identified:** Precisely's current data lineage offering is limited to manual "
            "mapping within its Data360 Govern module. There is no AI-assisted auto-discovery or "
            "natural language impact query.\n\n"
            "**Precisely strength to leverage:** Our address validation and geocoding accuracy "
            "(99.7%) is market-leading and could be embedded in lineage nodes to flag data quality "
            "degradation at the source — a differentiated angle Informatica does not offer.\n\n"
            "**Recommended action:** Accelerate the AI lineage roadmap item (Q3 2025) and consider "
            "a 'quality-aware lineage' differentiator that surfaces DQ scores inline."
        ),
        "priority": "High",
        "source_url": "https://www.informatica.com/blogs.html",
        "created_at": (_now - timedelta(days=1)).isoformat(),
    },
    {
        "id": "brief-2",
        "competitor_id": "comp-1",
        "competitor_name": "Informatica",
        "feature_name": "Informatica Cloud integrates with Microsoft Fabric natively",
        "description": (
            "Informatica released a native connector for Microsoft Fabric, allowing Intelligent Data "
            "Management Cloud (IDMC) pipelines to read/write directly to OneLake. The integration "
            "supports schema-on-read and live query federation, making it a strong play for "
            "Microsoft-heavy enterprise accounts."
        ),
        "gap_analysis": (
            "**Gap identified:** Precisely does not yet have a certified Microsoft Fabric connector. "
            "Customers using Azure-centric stacks must use generic ODBC adapters.\n\n"
            "**Risk level:** Medium-High. Microsoft Fabric is the fastest-growing data platform "
            "in the enterprise segment (Gartner, 2024). Accounts standardising on Fabric may "
            "evaluate Informatica over Precisely for this reason alone.\n\n"
            "**Recommended action:** Prioritise Fabric-native connector in H1 roadmap. "
            "Co-marketing with Microsoft would accelerate reach."
        ),
        "priority": "High",
        "source_url": "https://www.informatica.com/blogs.html",
        "created_at": (_now - timedelta(days=2)).isoformat(),
    },
    {
        "id": "brief-3",
        "competitor_id": "comp-1",
        "competitor_name": "Informatica",
        "feature_name": "CLAIRE GPT chat interface for data stewards goes GA",
        "description": (
            "Informatica's CLAIRE GPT assistant — which allows data stewards to ask natural language "
            "questions about data quality issues, trigger remediation workflows, and get plain-English "
            "summaries of data health reports — has graduated from beta to general availability. "
            "Pricing is bundled into existing IDMC enterprise tiers."
        ),
        "gap_analysis": (
            "**Gap identified:** Precisely lacks a conversational AI layer for data stewards. "
            "Our governance workflows require navigating multiple UI screens.\n\n"
            "**Precisely strength:** Our DQ rule engine is more configurable than CLAIRE's, but "
            "the chat abstraction lowers the barrier to entry for non-technical users significantly.\n\n"
            "**Recommended action:** Evaluate adding an LLM-powered 'Ask Precisely' assistant as "
            "a thin UX layer over existing APIs. This could be a 6-week prototype."
        ),
        "priority": "Medium",
        "source_url": "https://www.informatica.com/blogs.html",
        "created_at": (_now - timedelta(days=3)).isoformat(),
    },
    # Talend
    {
        "id": "brief-4",
        "competitor_id": "comp-2",
        "competitor_name": "Talend",
        "feature_name": "Talend adds zero-code pipeline builder with drag-and-drop AI transforms",
        "description": (
            "Talend Data Fabric 8.0 ships a redesigned zero-code pipeline studio where users can "
            "drag AI-powered transform blocks (deduplication, address standardisation, entity "
            "resolution) into pipelines without writing any code. The studio auto-suggests the "
            "next transform based on data profiling results."
        ),
        "gap_analysis": (
            "**Gap identified:** Talend's zero-code approach directly competes with Precisely's "
            "target persona of data analysts who are not engineers. Our studio requires more "
            "technical knowledge to configure address validation transforms.\n\n"
            "**Precisely strength:** Our address validation accuracy is demonstrably superior "
            "to Talend's bundled standardisation — we should lean into this in competitive deals.\n\n"
            "**Recommended action:** Improve the no-code configuration experience for address "
            "validation in EngageOne. Create a competitive battle card highlighting accuracy benchmarks."
        ),
        "priority": "High",
        "source_url": "https://www.talend.com/blog/",
        "created_at": (_now - timedelta(days=1)).isoformat(),
    },
    {
        "id": "brief-5",
        "competitor_id": "comp-2",
        "competitor_name": "Talend",
        "feature_name": "Talend Trust Score now benchmarks against industry peers",
        "description": (
            "Talend Trust Score, their data health metric, now allows customers to benchmark their "
            "scores anonymously against industry peers in the same vertical. This turns a vanity "
            "metric into a competitive insight tool and is being used in sales conversations as "
            "a land-and-expand trigger."
        ),
        "gap_analysis": (
            "**Gap identified:** Precisely has no equivalent benchmarking or community trust score "
            "feature. Customers cannot compare their data quality posture to peers.\n\n"
            "**Opportunity:** Precisely processes billions of address and entity records — we have "
            "the data to power a credible industry benchmark product. This could be a significant "
            "net-new value driver for enterprise renewals.\n\n"
            "**Recommended action:** Explore a 'Precisely Data Health Index' product concept. "
            "Could begin as a report/whitepaper before becoming a product feature."
        ),
        "priority": "Medium",
        "source_url": "https://www.talend.com/blog/",
        "created_at": (_now - timedelta(days=4)).isoformat(),
    },
    # Collibra
    {
        "id": "brief-6",
        "competitor_id": "comp-3",
        "competitor_name": "Collibra",
        "feature_name": "Collibra releases automated data governance workflows with AI policy suggestions",
        "description": (
            "Collibra Workflow Automation now includes an AI policy advisor that analyses your "
            "existing data assets, classifies them by sensitivity and usage pattern, and suggests "
            "governance policies (retention, access controls, stewardship assignments). Policies "
            "can be approved and activated in one click."
        ),
        "gap_analysis": (
            "**Gap identified:** Precisely Data360 Govern requires manual policy authoring. "
            "There is no AI-assisted policy suggestion capability today.\n\n"
            "**Collibra's weakness:** Their automation is strong but they lack the data quality "
            "enforcement layer — policies are defined but not operationalised at the data level. "
            "Precisely has the DQ engine to close that loop.\n\n"
            "**Recommended action:** Position Precisely as 'governance that enforces itself' — "
            "pair AI policy suggestions (roadmap) with our existing DQ rules engine to create "
            "a uniquely actionable governance story."
        ),
        "priority": "High",
        "source_url": "https://www.collibra.com/blog/",
        "created_at": (_now - timedelta(days=2)).isoformat(),
    },
    {
        "id": "brief-7",
        "competitor_id": "comp-3",
        "competitor_name": "Collibra",
        "feature_name": "Collibra expands data marketplace to support internal data products",
        "description": (
            "Collibra Data Marketplace now supports an internal data product catalog where teams "
            "can publish, discover, and subscribe to curated datasets as products. This aligns "
            "with the data mesh architecture trend and is seeing strong adoption in FSI customers."
        ),
        "gap_analysis": (
            "**Gap identified:** Precisely does not offer a data product marketplace or catalog "
            "layer. Customers with data mesh strategies may see Collibra as a more modern fit.\n\n"
            "**Precisely angle:** Our data enrichment capabilities (location intelligence, "
            "demographics, firmographics) are prime candidates to be published as data products. "
            "We could partner or integrate rather than build this ourselves.\n\n"
            "**Recommended action:** Evaluate a Collibra marketplace integration to list Precisely "
            "enrichment datasets. Reduces competitive threat and opens a new distribution channel."
        ),
        "priority": "Medium",
        "source_url": "https://www.collibra.com/blog/",
        "created_at": (_now - timedelta(days=5)).isoformat(),
    },
    # Ataccama
    {
        "id": "brief-8",
        "competitor_id": "comp-4",
        "competitor_name": "Ataccama",
        "feature_name": "Ataccama ONE introduces real-time data quality monitoring with anomaly alerts",
        "description": (
            "Ataccama ONE now streams DQ metrics to a real-time monitoring dashboard with configurable "
            "anomaly detection thresholds. When data quality drops below a threshold, automatic "
            "alerts are sent to Slack, Teams, or PagerDuty. The feature targets DataOps teams "
            "running continuous data pipelines."
        ),
        "gap_analysis": (
            "**Gap identified:** Precisely's DQ monitoring is primarily batch-oriented. Real-time "
            "streaming DQ is an emerging requirement in the DataOps segment that we are not "
            "currently addressing.\n\n"
            "**Precisely strength:** Our data quality rules are more mature and configurable; "
            "we need to add the real-time delivery mechanism.\n\n"
            "**Recommended action:** Evaluate a real-time DQ streaming feature using Kafka/Kinesis "
            "integration. This is a natural extension of our existing rules engine."
        ),
        "priority": "Medium",
        "source_url": "https://www.ataccama.com/blog",
        "created_at": (_now - timedelta(days=3)).isoformat(),
    },
    # Experian
    {
        "id": "brief-9",
        "competitor_id": "comp-5",
        "competitor_name": "Experian",
        "feature_name": "Experian launches identity resolution API for real-time customer 360",
        "description": (
            "Experian Data Quality has launched a new Identity Resolution API that merges customer "
            "records from disparate sources in real time using probabilistic and deterministic "
            "matching. The API is designed to be embedded in CRM and CDP workflows and supports "
            "sub-100ms response times for match decisions."
        ),
        "gap_analysis": (
            "**Direct competitive overlap:** Precisely offers entity resolution capabilities, but "
            "Experian's real-time API with sub-100ms SLA targets the same CRM/CDP integration use case.\n\n"
            "**Precisely differentiation:** Our address validation layer adds a verification signal "
            "that pure identity resolution misses — a merged record with a validated, deliverable "
            "address is more trustworthy than one without.\n\n"
            "**Recommended action:** Create joint solution brief: 'Identity + Address = Verified Customer.' "
            "Develop a battle card for deals where Experian's identity API is mentioned."
        ),
        "priority": "High",
        "source_url": "https://www.experian.com/blogs/insights/",
        "created_at": (_now - timedelta(days=2)).isoformat(),
    },
    {
        "id": "brief-10",
        "competitor_id": "comp-5",
        "competitor_name": "Experian",
        "feature_name": "Experian adds global address verification for 245 countries",
        "description": (
            "Experian QAS has extended its address verification coverage to 245 countries and "
            "territories, with enhanced support for unstructured address formats common in "
            "Southeast Asia and Sub-Saharan Africa. The update includes local-language "
            "transliteration and geocoding for the new regions."
        ),
        "gap_analysis": (
            "**Direct threat to core Precisely business:** Address verification is Precisely's "
            "flagship capability. Experian expanding global coverage narrows our geographic "
            "differentiation advantage.\n\n"
            "**Precisely current state:** We cover 240+ countries; Experian now claims 245. "
            "The depth of coverage and accuracy in emerging markets should be assessed.\n\n"
            "**Recommended action:** Commission a third-party accuracy benchmark for Southeast Asia "
            "and Africa address verification. If we lead, publicise it; if we lag, prioritise "
            "coverage investment in those regions."
        ),
        "priority": "High",
        "source_url": "https://www.experian.com/blogs/insights/",
        "created_at": (_now - timedelta(days=1)).isoformat(),
    },
]


# ---------------------------------------------------------------------------
# Database access functions
# ---------------------------------------------------------------------------

def get_competitors() -> list[dict]:
    """Return list of competitors from DB or mock."""
    client = get_client()
    if client:
        try:
            result = client.table("competitors").select("*").execute()
            return result.data or []
        except Exception as exc:
            logger.error("DB error fetching competitors: %s", exc)
    return MOCK_COMPETITORS


def get_briefs(competitor_name: Optional[str] = None) -> list[dict]:
    """Return briefs, optionally filtered by competitor name."""
    client = get_client()
    if client:
        try:
            query = client.table("briefs").select("*").order("created_at", desc=True)
            if competitor_name:
                # Join is complex; do a subquery via competitor_id
                comp = client.table("competitors").select("id").eq("name", competitor_name).execute()
                if comp.data:
                    query = query.eq("competitor_id", comp.data[0]["id"])
            result = query.execute()
            return result.data or []
        except Exception as exc:
            logger.error("DB error fetching briefs: %s", exc)
    # Mock fallback
    data = MOCK_BRIEFS
    if competitor_name:
        data = [b for b in data if b["competitor_name"] == competitor_name]
    return data


def save_brief(brief: dict) -> dict:
    """Persist a brief to DB or mock store."""
    client = get_client()
    if client:
        try:
            result = client.table("briefs").insert(brief).execute()
            return result.data[0] if result.data else brief
        except Exception as exc:
            logger.error("DB error saving brief: %s", exc)
    # In-memory append for demo
    MOCK_BRIEFS.append(brief)
    return brief


def save_requirement(req: dict) -> dict:
    """Persist a requirement to DB or mock store."""
    client = get_client()
    if client:
        try:
            result = client.table("requirements").insert(req).execute()
            return result.data[0] if result.data else req
        except Exception as exc:
            logger.error("DB error saving requirement: %s", exc)
    return req
