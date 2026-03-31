"""AI analyzer using Anthropic Claude for feature extraction and PRD generation."""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)

try:
    import anthropic
    _anthropic_available = True
except ImportError:
    _anthropic_available = False
    logger.warning("anthropic SDK not installed — mock analysis will be used")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
MODEL = "claude-sonnet-4-6"

# ---------------------------------------------------------------------------
# Precisely capability summary (hardcoded domain knowledge)
# ---------------------------------------------------------------------------

PRECISELY_CAPABILITIES = """
Precisely is a data integrity company. Core capabilities:
- **Data Quality**: Rules-based DQ engine with 200+ built-in rules, anomaly detection, profiling, and DQ scoring. Batch and near-real-time processing.
- **Address Validation**: Industry-leading address verification and standardisation for 240+ countries. CASS-certified for USPS. Sub-second API responses. 99.7% deliverability accuracy.
- **Geocoding & Location Intelligence**: Rooftop-level geocoding, reverse geocoding, drive-time analysis, territory management, spatial analytics.
- **Data Enrichment**: Append demographics, firmographics, location attributes, and third-party data to customer records. 300+ enrichment attributes.
- **Entity Resolution**: Probabilistic and deterministic record linkage, deduplication, and golden record creation.
- **Data Governance**: Data360 Govern — data cataloging, lineage, business glossary, policy management, stewardship workflows.
- **Data Integration**: Connect2 — ETL/ELT pipelines, 150+ connectors, real-time streaming.
- **Spatial Data Management**: MapInfo — industry-leading GIS and spatial analytics platform.

Known gaps vs competitors (as of 2026):
- No AI-powered natural language interface for DQ or governance tasks
- Lineage is manual-mapping based; no auto-discovery
- No Microsoft Fabric native connector
- No real-time streaming DQ monitoring
- No data product marketplace or data mesh support
- Zero-code pipeline experience is less mature than Talend
"""


# ---------------------------------------------------------------------------
# Core analysis function
# ---------------------------------------------------------------------------

def analyze_competitor(
    competitor: str,
    articles: list[dict],
) -> list[dict]:
    """
    Analyse scraped articles and return a list of feature briefs.
    Each brief: {competitor, feature_name, description, gap_analysis, priority, date, source_url}
    """
    if not articles:
        logger.warning("No articles to analyse for %s", competitor)
        return []

    if not _anthropic_available or not ANTHROPIC_API_KEY:
        logger.info("Anthropic not configured — returning mock analysis for %s", competitor)
        return _mock_analysis(competitor, articles)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    results = []

    for article in articles[:5]:  # cap to avoid large token costs
        try:
            brief = _analyze_single_article(client, competitor, article)
            if brief:
                results.append(brief)
        except Exception as exc:
            logger.error("Analysis failed for article '%s': %s", article.get("title"), exc)

    return results


def _analyze_single_article(
    client,
    competitor: str,
    article: dict,
) -> Optional[dict]:
    """Analyse a single article and return a structured brief."""
    prompt = f"""You are a product intelligence analyst at Precisely, a data integrity company.

Analyse the following competitor blog article and extract the key product feature or announcement.
Then compare it to Precisely's capabilities and provide a strategic gap analysis.

<competitor>{competitor}</competitor>
<article_title>{article.get('title', '')}</article_title>
<article_text>{article.get('raw_text', '')[:3000]}</article_text>

<precisely_capabilities>
{PRECISELY_CAPABILITIES}
</precisely_capabilities>

Respond with a JSON object in exactly this structure:
{{
  "feature_name": "Short, punchy title for the competitive intelligence item (max 80 chars)",
  "description": "2-3 sentence factual description of what the competitor released or announced",
  "gap_analysis": "Markdown-formatted strategic analysis of: (1) the gap or overlap with Precisely, (2) a Precisely strength to leverage, and (3) a specific recommended action. Use **bold** for key terms. 150-200 words.",
  "priority": "High | Medium | Low",
  "date": "{article.get('date', datetime.utcnow().strftime('%Y-%m-%d'))}"
}}

Priority guidance:
- High: Direct threat to Precisely core revenue (address validation, DQ, entity resolution) or fast-moving trend
- Medium: Adjacent capability gap or emerging threat in 12-18 months
- Low: Tangential, unlikely to impact Precisely's market position

Return only the JSON object, no other text."""

    message = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    content = message.content[0].text.strip()
    # Strip markdown code fences if present
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()

    data = json.loads(content)
    return {
        "competitor": competitor,
        "feature_name": data.get("feature_name", article.get("title", "")),
        "description": data.get("description", ""),
        "gap_analysis": data.get("gap_analysis", ""),
        "priority": data.get("priority", "Medium"),
        "date": data.get("date", datetime.utcnow().strftime("%Y-%m-%d")),
        "source_url": article.get("url", ""),
    }


# ---------------------------------------------------------------------------
# PRD requirement drafting
# ---------------------------------------------------------------------------

def draft_requirement(
    feature_name: str,
    description: str,
    gap_analysis: str = "",
    competitor: str = "",
) -> dict:
    """
    Generate a PRD counter-requirement for a competitive gap.
    Returns: {title, user_story, acceptance_criteria, technical_notes, priority}
    """
    if not _anthropic_available or not ANTHROPIC_API_KEY:
        logger.info("Anthropic not configured — returning mock PRD")
        return _mock_prd(feature_name, competitor)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    prompt = f"""You are a senior Product Manager at Precisely, a data integrity company.

A competitor ({competitor or 'a competitor'}) has released a feature that represents a competitive gap for Precisely.
Your task is to draft a counter-requirement — a PRD ticket that Precisely's engineering team could implement to close this gap.

<feature_name>{feature_name}</feature_name>
<description>{description}</description>
<gap_analysis>{gap_analysis}</gap_analysis>

<precisely_capabilities>
{PRECISELY_CAPABILITIES}
</precisely_capabilities>

Draft a PRD ticket as a JSON object in exactly this structure:
{{
  "title": "Short, action-oriented ticket title starting with a verb (max 60 chars)",
  "user_story": "As a [specific persona], I want to [capability], so that [business outcome]. 2-3 sentences max.",
  "acceptance_criteria": [
    "Criterion 1 — specific and testable",
    "Criterion 2 — specific and testable",
    "Criterion 3 — specific and testable",
    "Criterion 4 — specific and testable",
    "Criterion 5 — specific and testable"
  ],
  "technical_notes": "2-3 sentences on implementation approach, relevant Precisely components to leverage, and any external integrations needed.",
  "priority": "P0 | P1 | P2"
}}

Priority:
- P0: Must-have to defend core business; ship within quarter
- P1: Important differentiator; ship within 2 quarters
- P2: Roadmap investment; ship within year

Return only the JSON object, no other text."""

    message = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    content = message.content[0].text.strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()

    data = json.loads(content)
    return {
        "title": data.get("title", f"Respond to: {feature_name}"),
        "user_story": data.get("user_story", ""),
        "acceptance_criteria": data.get("acceptance_criteria", []),
        "technical_notes": data.get("technical_notes", ""),
        "priority": data.get("priority", "P1"),
    }


# ---------------------------------------------------------------------------
# Mock fallbacks
# ---------------------------------------------------------------------------

def _mock_analysis(competitor: str, articles: list[dict]) -> list[dict]:
    """Return plausible mock analysis when AI is unavailable."""
    from database import MOCK_BRIEFS
    return [b for b in MOCK_BRIEFS if b["competitor_name"] == competitor][:2]


def _mock_prd(feature_name: str, competitor: str) -> dict:
    """Return a mock PRD when AI is unavailable."""
    return {
        "title": f"Add AI-powered {feature_name[:40]} capability",
        "user_story": (
            f"As a data steward at a Precisely enterprise customer, I want a native capability "
            f"that matches or exceeds what {competitor or 'competitors'} offer in '{feature_name}', "
            f"so that our team can retain this customer and win competitive evaluations in this category."
        ),
        "acceptance_criteria": [
            f"Feature is accessible from the main Precisely product navigation without additional plugins",
            f"Core functionality matches the competitive baseline established by {competitor or 'market leaders'}",
            f"Performance meets or exceeds competitor benchmarks (document specific metrics in technical spec)",
            f"Feature works for both new and existing Precisely customers with no migration required",
            f"Documentation and in-app guidance are available at launch",
        ],
        "technical_notes": (
            f"Leverage Precisely's existing DQ rules engine and Connect2 connector framework as the "
            f"foundation. Evaluate whether to build natively or through a technology partnership. "
            f"Prototype in 6 weeks; full GA in one quarter."
        ),
        "priority": "P1",
    }
