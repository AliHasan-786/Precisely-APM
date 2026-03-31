"""FastAPI application — Precisely PM-Intel Agent backend."""

from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from models import (
    AnalyzeRequest,
    AnalyzeResponse,
    DraftRequirementRequest,
    DraftRequirementResponse,
    HealthResponse,
)
from database import get_competitors, get_briefs, save_brief
from scraper import scrape_competitor
from analyzer import analyze_competitor, draft_requirement
from scheduler import start_scheduler, stop_scheduler, get_scheduler_status

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# App lifecycle
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting PM-Intel Agent backend...")
    start_scheduler()
    yield
    logger.info("Shutting down...")
    stop_scheduler()


app = FastAPI(
    title="Precisely PM-Intel Agent",
    description="Competitive intelligence API for Precisely Product Managers",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow Next.js dev server and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Health check endpoint."""
    from database import get_client
    from analyzer import _anthropic_available, ANTHROPIC_API_KEY

    db_status = "connected" if get_client() else "mock (no Supabase configured)"
    ai_status = "configured" if (_anthropic_available and ANTHROPIC_API_KEY) else "mock (no API key)"

    return HealthResponse(
        status="ok",
        version="1.0.0",
        database=db_status,
        ai=ai_status,
    )


@app.get("/api/competitors", tags=["Competitors"])
async def list_competitors():
    """List all tracked competitors with their latest brief summary."""
    try:
        competitors = get_competitors()
        briefs = get_briefs()

        # Attach brief count and latest brief to each competitor
        for comp in competitors:
            comp_briefs = [b for b in briefs if b.get("competitor_id") == comp["id"]
                          or b.get("competitor_name") == comp["name"]]
            comp["brief_count"] = len(comp_briefs)
            if comp_briefs:
                # Sort by created_at desc, get latest
                sorted_briefs = sorted(
                    comp_briefs,
                    key=lambda b: b.get("created_at", ""),
                    reverse=True,
                )
                comp["latest_brief"] = sorted_briefs[0].get("feature_name", "")
            else:
                comp["latest_brief"] = None

        return {"competitors": competitors, "total": len(competitors)}
    except Exception as exc:
        logger.error("Error fetching competitors: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/briefs", tags=["Briefs"])
async def list_briefs(
    competitor: str = Query(None, description="Filter by competitor name"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """Get all weekly briefs, optionally filtered by competitor."""
    try:
        briefs = get_briefs(competitor_name=competitor)
        total = len(briefs)
        paginated = briefs[offset : offset + limit]
        return {"briefs": paginated, "total": total, "limit": limit, "offset": offset}
    except Exception as exc:
        logger.error("Error fetching briefs: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/analyze", tags=["Analysis"])
async def trigger_analysis(request: AnalyzeRequest):
    """
    Trigger manual analysis for a competitor.
    Scrapes latest articles and runs AI analysis, saving results to DB.
    """
    competitor = request.competitor
    logger.info("Manual analysis triggered for %s", competitor)

    try:
        articles = scrape_competitor(competitor)
        if not articles:
            return {"competitor": competitor, "briefs": [], "message": "No articles found"}

        analysis_results = analyze_competitor(competitor, articles)
        saved_briefs = []
        for result in analysis_results:
            from uuid import uuid4
            record = {
                "id": str(uuid4()),
                "competitor_id": f"comp-{competitor.lower()}",
                "competitor_name": competitor,
                "feature_name": result.get("feature_name", ""),
                "description": result.get("description", ""),
                "gap_analysis": result.get("gap_analysis", ""),
                "priority": result.get("priority", "Medium"),
                "source_url": result.get("source_url", ""),
                "created_at": datetime.utcnow().isoformat(),
            }
            save_brief(record)
            saved_briefs.append(record)

        return {
            "competitor": competitor,
            "articles_scraped": len(articles),
            "briefs_generated": len(saved_briefs),
            "briefs": saved_briefs,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        logger.error("Analysis error for %s: %s", competitor, exc)
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/draft-requirement", response_model=DraftRequirementResponse, tags=["Requirements"])
async def create_draft_requirement(request: DraftRequirementRequest):
    """
    Generate a PRD counter-requirement for a given competitive feature gap.
    """
    logger.info("Drafting requirement for feature: %s", request.feature_name)
    try:
        result = draft_requirement(
            feature_name=request.feature_name,
            description=request.description,
            gap_analysis=request.gap_analysis or "",
            competitor=request.competitor or "",
        )

        # Optionally persist
        if request.brief_id:
            from uuid import uuid4
            from database import save_requirement
            save_requirement({
                "id": str(uuid4()),
                "brief_id": request.brief_id,
                "title": result["title"],
                "user_story": result["user_story"],
                "acceptance_criteria": result["acceptance_criteria"],
                "technical_notes": result["technical_notes"],
                "priority": result["priority"],
                "created_at": datetime.utcnow().isoformat(),
            })

        return DraftRequirementResponse(**result)
    except Exception as exc:
        logger.error("Requirement draft error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/scheduler/status", tags=["System"])
async def scheduler_status():
    """Return scheduler status."""
    return get_scheduler_status()
