# Precisely PM-Intel Agent

> AI-powered competitive intelligence for Precisely Product Managers. Automatically scrapes competitor blogs, extracts product signals with Claude AI, and lets PMs draft counter-requirements in one click.
>
> Check out the live demo here: https://precisely-apm.vercel.app/

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser / PM                           │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│              Next.js 14  (App Router)                       │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Sidebar  │  │ WeeklyBrief  │  │ DraftRequirement      │  │
│  │          │  │              │  │ Modal                 │  │
│  └──────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  /api/briefs  /api/competitors  /api/draft-requirement │ │
│  │          (proxy routes → Python backend)               │ │
│  └──────────────────────────┬───────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────┘
                              │  HTTP (localhost:8000)
┌─────────────────────────────▼───────────────────────────────┐
│                    Python FastAPI                            │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  │
│  │scraper.py│  │analyzer  │  │scheduler   │  │database  │  │
│  │httpx+BS4 │  │.py       │  │.py         │  │.py       │  │
│  │          │  │Claude AI │  │APScheduler │  │Supabase  │  │
│  └────┬─────┘  └────┬─────┘  └─────┬──────┘  └────┬─────┘  │
└───────┼─────────────┼──────────────┼───────────────┼────────┘
        │             │              │               │
        ▼             ▼              ▼               ▼
  Competitor     Anthropic      Slack          Supabase
  Blogs          Claude API     Webhook        PostgreSQL
  (5 sources)    claude-        (optional)     (optional)
                 sonnet-4-6
```

---

## Features

- **Automated Scraping** — monitors Informatica, Talend, Collibra, Ataccama, and Experian blogs weekly
- **AI Gap Analysis** — Claude compares each competitor update against Precisely's capabilities
- **Priority Scoring** — High / Medium / Low triage so PMs focus on what matters
- **One-Click PRD Draft** — generates a full user story + acceptance criteria for any competitive gap
- **Demo Mode** — runs entirely with realistic mock data, no credentials required

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- (Optional) Anthropic API key, Supabase project, Slack webhook

### 1. Clone & configure
```bash
cp .env.example .env
# Edit .env with your keys (all optional for demo mode)
```

### 2. Start the Python backend
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### 3. Start the Next.js frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 4. Demo without backend
The frontend works standalone — if the backend is unreachable, all API routes return rich mock data automatically.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | No* | Enables live AI analysis. Without it, mock analysis is returned. |
| `SUPABASE_URL` | No | Supabase project URL. Without it, uses in-memory storage. |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key for DB writes. |
| `SLACK_WEBHOOK_URL` | No | Posts weekly brief to a Slack channel. |
| `NEXT_PUBLIC_API_URL` | No | Python backend URL. Default: `http://localhost:8000`. |

*Required for production use. Demo mode works without it.

---

## Database Schema (Supabase)

Run these in the Supabase SQL editor to create the tables:

```sql
create table competitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  logo_url text,
  last_scraped_at timestamptz
);

create table briefs (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid references competitors(id),
  feature_name text not null,
  description text,
  gap_analysis text,
  priority text check (priority in ('High', 'Medium', 'Low')),
  source_url text,
  created_at timestamptz default now()
);

create table requirements (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references briefs(id),
  title text,
  user_story text,
  acceptance_criteria jsonb,
  technical_notes text,
  priority text,
  created_at timestamptz default now()
);
```

---

## API Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/competitors` | List all tracked competitors |
| `GET` | `/api/briefs` | All briefs (query: `?competitor=Informatica`) |
| `POST` | `/api/analyze` | Trigger manual analysis `{"competitor": "Talend"}` |
| `POST` | `/api/draft-requirement` | Generate PRD `{"brief_id": "...", "feature_name": "...", "description": "..."}` |

---

## Success Metrics

| Metric | Target | How Measured |
|---|---|---|
| **Time Saved** | 3+ hrs/week per PM | Before/after survey on competitive research time |
| **Actionability** | >70% of briefs rated "useful" | In-app thumbs up/down (future feature) |
| **Coverage** | 5 competitors, weekly cadence | Scheduler success rate in logs |
| **System Reliability** | 99% uptime during business hours | Health check monitoring |
| **PRD Adoption** | >40% of drafted requirements used | Jira/Linear ticket tracking |

---

## Screenshots

_Add screenshots here after first run._

| View | Description |
|---|---|
| Dashboard | Main feed with competitor filter tabs |
| Sidebar | Competitor status indicators |
| Brief Card | Gap analysis with priority badge |
| Draft Modal | AI-generated PRD ticket |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | Python 3.11, FastAPI, httpx, BeautifulSoup4 |
| AI | Anthropic Claude claude-sonnet-4-6 |
| Database | Supabase (PostgreSQL) |
| Scheduling | APScheduler |
| Deployment | Vercel (frontend) + Railway/Fly.io (backend) |

---

Built for the Precisely PM team — turning competitive noise into actionable product decisions.
