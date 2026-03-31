"""Pydantic models for all data types in PM-Intel Agent."""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Core domain models
# ---------------------------------------------------------------------------

class Competitor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    url: str
    logo_url: Optional[str] = None
    last_scraped_at: Optional[datetime] = None


class Brief(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    competitor_id: str
    competitor_name: str  # denormalised for convenience
    feature_name: str
    description: str
    gap_analysis: str
    priority: str  # "High" | "Medium" | "Low"
    source_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Requirement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    brief_id: str
    title: str
    user_story: str
    acceptance_criteria: list[str]
    technical_notes: str
    priority: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# Scraper output
# ---------------------------------------------------------------------------

class ScrapedArticle(BaseModel):
    title: str
    url: str
    date: Optional[str] = None
    raw_text: str


# ---------------------------------------------------------------------------
# API request/response models
# ---------------------------------------------------------------------------

class AnalyzeRequest(BaseModel):
    competitor: str


class DraftRequirementRequest(BaseModel):
    brief_id: Optional[str] = None
    feature_name: str
    description: str
    gap_analysis: Optional[str] = None
    competitor: Optional[str] = None


class DraftRequirementResponse(BaseModel):
    title: str
    user_story: str
    acceptance_criteria: list[str]
    technical_notes: str
    priority: str


class AnalyzeResponse(BaseModel):
    competitor: str
    feature_name: str
    description: str
    gap_analysis: str
    priority: str
    date: str
    source_url: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    ai: str
