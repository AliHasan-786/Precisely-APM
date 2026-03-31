"""APScheduler weekly job for competitive intelligence gathering."""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime
from uuid import uuid4

logger = logging.getLogger(__name__)

try:
    from apscheduler.schedulers.background import BackgroundScheduler
    from apscheduler.triggers.cron import CronTrigger
    _scheduler_available = True
except ImportError:
    _scheduler_available = False
    logger.warning("APScheduler not installed — scheduled jobs will not run")

try:
    import httpx
    _httpx_available = True
except ImportError:
    _httpx_available = False

SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "")


# ---------------------------------------------------------------------------
# Core job
# ---------------------------------------------------------------------------

def run_weekly_intelligence_job() -> dict:
    """
    Main intelligence gathering job:
    1. Scrape all competitors
    2. Analyse each update with AI
    3. Persist briefs to database
    4. Send Slack notification if configured
    Returns summary dict.
    """
    from scraper import scrape_all
    from analyzer import analyze_competitor
    from database import save_brief

    logger.info("[Scheduler] Starting weekly intelligence job at %s", datetime.utcnow().isoformat())
    summary = {"started_at": datetime.utcnow().isoformat(), "competitors": {}, "total_briefs": 0}

    # 1. Scrape
    scraped = scrape_all()

    # 2. Analyse + persist
    for competitor_name, articles in scraped.items():
        logger.info("[Scheduler] Analysing %s (%d articles)", competitor_name, len(articles))
        try:
            briefs = analyze_competitor(competitor_name, articles)
            saved = 0
            for brief in briefs:
                record = {
                    "id": str(uuid4()),
                    "competitor_id": f"comp-{competitor_name.lower()}",
                    "competitor_name": competitor_name,
                    "feature_name": brief.get("feature_name", ""),
                    "description": brief.get("description", ""),
                    "gap_analysis": brief.get("gap_analysis", ""),
                    "priority": brief.get("priority", "Medium"),
                    "source_url": brief.get("source_url", ""),
                    "created_at": datetime.utcnow().isoformat(),
                }
                save_brief(record)
                saved += 1
            summary["competitors"][competitor_name] = {"articles": len(articles), "briefs_saved": saved}
            summary["total_briefs"] += saved
        except Exception as exc:
            logger.error("[Scheduler] Failed for %s: %s", competitor_name, exc)
            summary["competitors"][competitor_name] = {"error": str(exc)}

    summary["completed_at"] = datetime.utcnow().isoformat()
    logger.info("[Scheduler] Job complete. Total briefs saved: %d", summary["total_briefs"])

    # 3. Slack notification
    if SLACK_WEBHOOK_URL:
        _send_slack_notification(summary)

    return summary


def _send_slack_notification(summary: dict) -> None:
    """Post weekly brief summary to Slack."""
    if not _httpx_available:
        logger.warning("httpx not available — cannot send Slack notification")
        return

    total = summary.get("total_briefs", 0)
    competitors = summary.get("competitors", {})
    comp_lines = "\n".join(
        f"  • *{name}*: {info.get('briefs_saved', 0)} new briefs"
        if "briefs_saved" in info
        else f"  • *{name}*: error — {info.get('error', 'unknown')}"
        for name, info in competitors.items()
    )

    payload = {
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Precisely PM-Intel: Weekly Competitive Brief",
                    "emoji": True,
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": (
                        f"*{total} new competitive intelligence items* have been processed "
                        f"and are ready for review.\n\n{comp_lines}"
                    ),
                },
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "View Dashboard"},
                        "url": os.getenv("DASHBOARD_URL", "http://localhost:3000"),
                        "style": "primary",
                    }
                ],
            },
        ]
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.post(SLACK_WEBHOOK_URL, json=payload)
            resp.raise_for_status()
            logger.info("[Scheduler] Slack notification sent successfully")
    except Exception as exc:
        logger.error("[Scheduler] Failed to send Slack notification: %s", exc)


# ---------------------------------------------------------------------------
# Scheduler setup
# ---------------------------------------------------------------------------

_scheduler = None


def start_scheduler() -> None:
    """Initialise and start the background scheduler."""
    global _scheduler

    if not _scheduler_available:
        logger.warning("APScheduler unavailable — scheduler not started")
        return

    _scheduler = BackgroundScheduler(timezone="UTC")

    # Every Monday at 08:00 UTC
    _scheduler.add_job(
        run_weekly_intelligence_job,
        trigger=CronTrigger(day_of_week="mon", hour=8, minute=0),
        id="weekly_intelligence",
        name="Weekly Competitive Intelligence",
        replace_existing=True,
        misfire_grace_time=3600,  # allow up to 1 hour late start
    )

    _scheduler.start()
    logger.info(
        "[Scheduler] Background scheduler started — weekly job runs every Monday at 08:00 UTC"
    )


def stop_scheduler() -> None:
    """Gracefully stop the scheduler."""
    global _scheduler
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("[Scheduler] Scheduler stopped")


def get_scheduler_status() -> dict:
    """Return scheduler status for health checks."""
    if not _scheduler_available:
        return {"available": False, "running": False}
    if not _scheduler:
        return {"available": True, "running": False}
    jobs = []
    for job in _scheduler.get_jobs():
        jobs.append(
            {
                "id": job.id,
                "name": job.name,
                "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
            }
        )
    return {"available": True, "running": _scheduler.running, "jobs": jobs}
