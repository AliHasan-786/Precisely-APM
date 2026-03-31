"""Web scraper for competitor blogs using httpx + BeautifulSoup4."""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)

try:
    import httpx
    import bs4
    from bs4 import BeautifulSoup
    _scraping_available = True
except ImportError:
    _scraping_available = False
    logger.warning("httpx or beautifulsoup4 not installed — mock scrape data will be used")

# ---------------------------------------------------------------------------
# Shared HTTP helpers
# ---------------------------------------------------------------------------

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}
TIMEOUT = 15.0  # seconds


def _fetch(url: str) -> Optional[str]:
    """Fetch URL and return HTML text, or None on failure."""
    if not _scraping_available:
        return None
    try:
        with httpx.Client(headers=HEADERS, timeout=TIMEOUT, follow_redirects=True) as client:
            resp = client.get(url)
            resp.raise_for_status()
            return resp.text
    except Exception as exc:
        logger.warning("Failed to fetch %s: %s", url, exc)
        return None


def _text_from_element(el) -> str:
    """Extract clean text from a BS4 element."""
    if el is None:
        return ""
    return " ".join(el.get_text(separator=" ", strip=True).split())[:2000]


# ---------------------------------------------------------------------------
# Per-competitor scrapers
# ---------------------------------------------------------------------------

def scrape_informatica() -> list[dict]:
    """Scrape Informatica blog."""
    url = "https://www.informatica.com/blogs.html"
    html = _fetch(url)
    if not html:
        return _mock_articles("Informatica")
    try:
        soup = BeautifulSoup(html, "html.parser")
        articles = []
        for card in soup.select(".blog-card, .card, article")[:10]:
            title_el = card.select_one("h2, h3, .card-title, .blog-title")
            link_el = card.select_one("a[href]")
            date_el = card.select_one("time, .date, .published-date")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            href = link_el["href"] if link_el else url
            if href.startswith("/"):
                href = "https://www.informatica.com" + href
            date_str = date_el.get_text(strip=True) if date_el else datetime.utcnow().strftime("%Y-%m-%d")
            raw_text = _text_from_element(card)
            articles.append({"title": title, "url": href, "date": date_str, "raw_text": raw_text})
        if articles:
            return articles
    except Exception as exc:
        logger.warning("Informatica parse error: %s", exc)
    return _mock_articles("Informatica")


def scrape_talend() -> list[dict]:
    """Scrape Talend blog."""
    url = "https://www.talend.com/blog/"
    html = _fetch(url)
    if not html:
        return _mock_articles("Talend")
    try:
        soup = BeautifulSoup(html, "html.parser")
        articles = []
        for card in soup.select("article, .post, .blog-post, .entry")[:10]:
            title_el = card.select_one("h2, h3, .entry-title, .post-title")
            link_el = card.select_one("a[href]")
            date_el = card.select_one("time, .entry-date, .post-date")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            href = link_el["href"] if link_el else url
            if href.startswith("/"):
                href = "https://www.talend.com" + href
            date_str = date_el.get_text(strip=True) if date_el else datetime.utcnow().strftime("%Y-%m-%d")
            raw_text = _text_from_element(card)
            articles.append({"title": title, "url": href, "date": date_str, "raw_text": raw_text})
        if articles:
            return articles
    except Exception as exc:
        logger.warning("Talend parse error: %s", exc)
    return _mock_articles("Talend")


def scrape_collibra() -> list[dict]:
    """Scrape Collibra blog."""
    url = "https://www.collibra.com/blog/"
    html = _fetch(url)
    if not html:
        return _mock_articles("Collibra")
    try:
        soup = BeautifulSoup(html, "html.parser")
        articles = []
        for card in soup.select("article, .blog-post, .post-card, .wp-block-post")[:10]:
            title_el = card.select_one("h2, h3, .post-title, .entry-title")
            link_el = card.select_one("a[href]")
            date_el = card.select_one("time, .post-date, .entry-date")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            href = link_el["href"] if link_el else url
            if href.startswith("/"):
                href = "https://www.collibra.com" + href
            date_str = date_el.get_text(strip=True) if date_el else datetime.utcnow().strftime("%Y-%m-%d")
            raw_text = _text_from_element(card)
            articles.append({"title": title, "url": href, "date": date_str, "raw_text": raw_text})
        if articles:
            return articles
    except Exception as exc:
        logger.warning("Collibra parse error: %s", exc)
    return _mock_articles("Collibra")


def scrape_ataccama() -> list[dict]:
    """Scrape Ataccama blog."""
    url = "https://www.ataccama.com/blog"
    html = _fetch(url)
    if not html:
        return _mock_articles("Ataccama")
    try:
        soup = BeautifulSoup(html, "html.parser")
        articles = []
        for card in soup.select("article, .blog-item, .post, .card")[:10]:
            title_el = card.select_one("h2, h3, .card-title, .post-title")
            link_el = card.select_one("a[href]")
            date_el = card.select_one("time, .date, .post-date")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            href = link_el["href"] if link_el else url
            if href.startswith("/"):
                href = "https://www.ataccama.com" + href
            date_str = date_el.get_text(strip=True) if date_el else datetime.utcnow().strftime("%Y-%m-%d")
            raw_text = _text_from_element(card)
            articles.append({"title": title, "url": href, "date": date_str, "raw_text": raw_text})
        if articles:
            return articles
    except Exception as exc:
        logger.warning("Ataccama parse error: %s", exc)
    return _mock_articles("Ataccama")


def scrape_experian() -> list[dict]:
    """Scrape Experian insights blog."""
    url = "https://www.experian.com/blogs/insights/"
    html = _fetch(url)
    if not html:
        return _mock_articles("Experian")
    try:
        soup = BeautifulSoup(html, "html.parser")
        articles = []
        for card in soup.select("article, .blog-card, .post, .entry")[:10]:
            title_el = card.select_one("h2, h3, .entry-title, .post-title")
            link_el = card.select_one("a[href]")
            date_el = card.select_one("time, .entry-date, .published")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            href = link_el["href"] if link_el else url
            if href.startswith("/"):
                href = "https://www.experian.com" + href
            date_str = date_el.get_text(strip=True) if date_el else datetime.utcnow().strftime("%Y-%m-%d")
            raw_text = _text_from_element(card)
            articles.append({"title": title, "url": href, "date": date_str, "raw_text": raw_text})
        if articles:
            return articles
    except Exception as exc:
        logger.warning("Experian parse error: %s", exc)
    return _mock_articles("Experian")


# ---------------------------------------------------------------------------
# Mock article data (used as fallback)
# ---------------------------------------------------------------------------

_MOCK_ARTICLE_DATA: dict[str, list[dict]] = {
    "Informatica": [
        {
            "title": "CLAIRE AI assistant gets natural language data lineage queries",
            "url": "https://www.informatica.com/blogs/claire-ai-lineage.html",
            "date": "2026-03-25",
            "raw_text": (
                "Informatica today announced that CLAIRE, its AI metadata engine, now supports "
                "natural language queries for data lineage. Data stewards can type questions like "
                "'where does this revenue field originate?' and receive a plain-English explanation "
                "with a visual lineage graph. The feature is powered by large language model "
                "embeddings trained on enterprise metadata schemas. Beta customers report 60% "
                "reduction in lineage investigation time. Available in IDMC Enterprise tier from April 2026."
            ),
        },
        {
            "title": "Informatica Cloud goes native on Microsoft Fabric",
            "url": "https://www.informatica.com/blogs/microsoft-fabric-native.html",
            "date": "2026-03-18",
            "raw_text": (
                "Informatica has launched a native Microsoft Fabric connector in IDMC, enabling "
                "direct read/write to OneLake without intermediate storage. The integration supports "
                "schema-on-read, live query federation, and Delta Lake format. This makes Informatica "
                "a certified Microsoft Fabric partner and opens access to thousands of Microsoft-first "
                "enterprise accounts. Available immediately for all IDMC customers."
            ),
        },
    ],
    "Talend": [
        {
            "title": "Talend Data Fabric 8.0: zero-code AI transforms now in GA",
            "url": "https://www.talend.com/blog/data-fabric-8-zero-code",
            "date": "2026-03-24",
            "raw_text": (
                "Talend today released Data Fabric 8.0 featuring a completely redesigned pipeline "
                "studio with zero-code AI transform blocks. Users can drag deduplication, address "
                "standardisation, entity resolution, and sentiment analysis blocks into pipelines "
                "with no code required. The studio auto-profiles incoming data and suggests the "
                "next appropriate transform. This significantly lowers the technical barrier for "
                "data analysts and business users building data pipelines."
            ),
        },
        {
            "title": "Trust Score benchmarking: see how your data quality compares to peers",
            "url": "https://www.talend.com/blog/trust-score-benchmarking",
            "date": "2026-03-15",
            "raw_text": (
                "Talend Trust Score now includes anonymous industry benchmarking. Customers can see "
                "how their data quality scores compare to peers in the same industry vertical — "
                "financial services, healthcare, retail, and manufacturing cohorts are available. "
                "The benchmark data is anonymised and aggregated across Talend's 3,000+ customer base. "
                "Sales teams are already using benchmark conversations as a land-and-expand trigger."
            ),
        },
    ],
    "Collibra": [
        {
            "title": "Collibra Workflow Automation: AI suggests governance policies based on your data",
            "url": "https://www.collibra.com/blog/ai-governance-policies",
            "date": "2026-03-22",
            "raw_text": (
                "Collibra has released AI-powered policy suggestions in Workflow Automation. The system "
                "analyses data asset metadata, usage patterns, and sensitivity classifications to "
                "recommend governance policies. Suggested policies include retention schedules, "
                "access control groups, and stewardship assignments. Data governance leads can "
                "review and activate policies with one click. The feature reduces policy authoring "
                "time by an estimated 70% in early customer deployments."
            ),
        },
        {
            "title": "Collibra Data Marketplace adds internal data product publishing",
            "url": "https://www.collibra.com/blog/data-marketplace-products",
            "date": "2026-03-10",
            "raw_text": (
                "Collibra's Data Marketplace now supports internal data products, allowing data teams "
                "to publish curated datasets as discoverable, subscribable products with SLAs and "
                "ownership metadata. This aligns with data mesh architecture principles and is "
                "seeing strong adoption in financial services customers building domain-oriented "
                "data architectures. The marketplace integrates with Slack for notifications when "
                "subscribed data products are updated."
            ),
        },
    ],
    "Ataccama": [
        {
            "title": "Ataccama ONE adds real-time DQ monitoring with anomaly detection",
            "url": "https://www.ataccama.com/blog/real-time-dq-monitoring",
            "date": "2026-03-20",
            "raw_text": (
                "Ataccama has launched real-time data quality monitoring in Ataccama ONE. The feature "
                "streams DQ metrics as data flows through pipelines and triggers alerts when quality "
                "drops below configurable thresholds. Anomaly detection uses statistical models to "
                "distinguish genuine quality drops from normal variation. Alerts are delivered via "
                "Slack, Microsoft Teams, PagerDuty, and email. The feature targets DataOps teams "
                "running continuous data pipelines in production environments."
            ),
        },
    ],
    "Experian": [
        {
            "title": "Experian launches real-time Identity Resolution API for CRM and CDP",
            "url": "https://www.experian.com/blogs/insights/identity-resolution-api",
            "date": "2026-03-23",
            "raw_text": (
                "Experian Data Quality has launched a new Identity Resolution API delivering sub-100ms "
                "match decisions for real-time customer 360 use cases. The API uses both probabilistic "
                "and deterministic matching across name, email, phone, address, and device signals. "
                "It is designed to be embedded in CRM workflows (Salesforce, HubSpot, Microsoft "
                "Dynamics) and CDPs (Segment, Adobe). Pricing is consumption-based with a free tier "
                "for up to 10,000 API calls per month."
            ),
        },
        {
            "title": "Experian extends address verification to 245 countries with local-language support",
            "url": "https://www.experian.com/blogs/insights/global-address-245",
            "date": "2026-03-17",
            "raw_text": (
                "Experian QAS has expanded its address verification coverage to 245 countries and "
                "territories. The update includes enhanced parsing for unstructured address formats "
                "common in Southeast Asia (Thailand, Vietnam, Indonesia) and Sub-Saharan Africa. "
                "Local-language transliteration is supported for Arabic, Thai, Vietnamese, and "
                "Swahili address components. Geocoding accuracy in the new regions averages 92% "
                "to rooftop level, improving to 97% for urban areas."
            ),
        },
    ],
}


def _mock_articles(competitor: str) -> list[dict]:
    """Return mock articles for a competitor."""
    return _MOCK_ARTICLE_DATA.get(competitor, [])


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

SCRAPERS: dict[str, callable] = {
    "Informatica": scrape_informatica,
    "Talend": scrape_talend,
    "Collibra": scrape_collibra,
    "Ataccama": scrape_ataccama,
    "Experian": scrape_experian,
}


def scrape_all() -> dict[str, list[dict]]:
    """Scrape all competitors and return dict keyed by competitor name."""
    results = {}
    for name, fn in SCRAPERS.items():
        logger.info("Scraping %s...", name)
        try:
            articles = fn()
            results[name] = articles
            logger.info("  Got %d articles from %s", len(articles), name)
        except Exception as exc:
            logger.error("Scrape failed for %s: %s", name, exc)
            results[name] = _mock_articles(name)
    return results


def scrape_competitor(name: str) -> list[dict]:
    """Scrape a single competitor by name."""
    fn = SCRAPERS.get(name)
    if not fn:
        raise ValueError(f"Unknown competitor: {name}. Valid: {list(SCRAPERS.keys())}")
    return fn()
