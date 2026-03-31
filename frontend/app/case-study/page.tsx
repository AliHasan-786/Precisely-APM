"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

// ---------------------------------------------------------------------------
// TOC config
// ---------------------------------------------------------------------------

const TOC_SECTIONS = [
  { id: "summary", label: "Executive Summary" },
  { id: "problem", label: "The Problem" },
  { id: "personas", label: "Target Users" },
  { id: "solution", label: "The Solution" },
  { id: "flywheel", label: "The AI Flywheel" },
  { id: "metrics", label: "Success Metrics" },
  { id: "roi", label: "ROI Analysis" },
  { id: "architecture", label: "Architecture" },
  { id: "roadmap", label: "Roadmap" },
  { id: "reflections", label: "Reflections" },
];

// ---------------------------------------------------------------------------
// Sticky TOC component
// ---------------------------------------------------------------------------

function TableOfContents({ activeSection }: { activeSection: string }) {
  return (
    <nav className="sticky top-24 space-y-0.5">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">
        Contents
      </p>
      {TOC_SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
            activeSection === id
              ? "text-[#4A154B] font-semibold bg-purple-50"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4A154B] to-[#E20074] bg-clip-text text-transparent mb-4">
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function CaseStudyPage() {
  const [activeSection, setActiveSection] = useState("summary");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sectionEls = TOC_SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the topmost visible section
          const topmost = visible.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          setActiveSection(topmost.target.id);
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    sectionEls.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ---------------------------------------------------------------- */}
        {/* HERO / TITLE                                                      */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Overview
          </Link>

          <div className="flex flex-wrap gap-2 mb-5">
            {["Product Strategy", "AI/LLM Integration", "Enterprise SaaS"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold text-[#4A154B] bg-purple-50 border border-purple-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5 max-w-4xl">
            PM-Intel Agent: Automating Competitive Intelligence for Data Integrity PMs
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl leading-relaxed mb-8">
            A case study in agentic workflow design, LLM product integration, and enterprise PM
            tooling
          </p>

          {/* Metadata row */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 border-t border-b border-gray-100 py-5">
            {[
              { label: "Role", value: "AI Product Manager Intern" },
              { label: "Company", value: "Precisely Software" },
              { label: "Timeline", value: "10 weeks" },
            ].map(({ label, value }) => (
              <div key={label}>
                <span className="font-medium text-gray-700">{label}:</span> {value}
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* TWO-COLUMN LAYOUT                                                 */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex gap-12">
          {/* Left: TOC (desktop only) */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <TableOfContents activeSection={activeSection} />
          </aside>

          {/* Right: Reading column */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-20">
            {/* -------------------------------------------------------------- */}
            {/* EXECUTIVE SUMMARY                                               */}
            {/* -------------------------------------------------------------- */}
            <section id="summary">
              <SectionHeading>Executive Summary</SectionHeading>
              <p className="text-gray-600 text-lg leading-relaxed">
                PMs at Precisely spend 5&ndash;10 hours per week on manual competitive research —
                reading blogs, scanning release notes, and synthesizing findings before roadmap
                discussions. PM-Intel is an agentic system that automates this workflow end-to-end:
                from scraping competitor releases to generating PRD counter-requirements using
                Claude Sonnet. The result is 15-minute weekly competitive reviews instead of
                5-hour manual sessions, while ensuring every PM on the team works from the same
                shared intelligence picture.
              </p>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* THE PROBLEM                                                     */}
            {/* -------------------------------------------------------------- */}
            <section id="problem">
              <SectionHeading>The Problem</SectionHeading>
              <p className="text-gray-600 leading-relaxed mb-6">
                Precisely competes in the data integrity market against Informatica, Talend,
                Collibra, Ataccama, and Experian. Each of these companies ships features frequently
                — new releases, blog posts, and documentation updates arrive weekly. Keeping up
                with all of them is a structural problem, not a willpower problem.
              </p>

              <div className="space-y-6">
                {[
                  {
                    num: "01",
                    title: "Information Fragmentation",
                    desc: "There is no single feed. PMs monitor 20+ sources manually — competitor blogs, release notes, LinkedIn announcements, G2 review changes, and partner press releases. Each source has a different cadence and format, making aggregation difficult without dedicated tooling.",
                  },
                  {
                    num: "02",
                    title: "Speed-to-Insight Gap",
                    desc: "Competitor feature launches often go unnoticed for weeks. By the time a relevant update surfaces in a roadmap discussion, it's too late to react in the current quarter. The window between a competitor shipping and Precisely responding is consistently too wide.",
                  },
                  {
                    num: "03",
                    title: "Translation Tax",
                    desc: "Even when PMs find a relevant update, converting it into an actionable internal requirement — \"we should build X because competitor Y launched Z\" — requires significant context-switching. This step alone consumes 1–2 hours per finding, discouraging thorough competitive tracking.",
                  },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A154B]/10 to-[#E20074]/10 flex items-center justify-center text-sm font-bold text-[#4A154B] flex-shrink-0 mt-0.5">
                      {num}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
                      <p className="text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* PERSONAS                                                        */}
            {/* -------------------------------------------------------------- */}
            <section id="personas">
              <SectionHeading>Target Users &amp; Personas</SectionHeading>
              <p className="text-gray-600 leading-relaxed mb-8">
                PM-Intel was designed around two primary user archetypes observed across
                enterprise product teams at software companies of Precisely&apos;s size.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    name: "Alex Chen",
                    role: "Senior Product Manager, Data Quality",
                    goal: "Stay ahead of Informatica's roadmap moves so he can position Precisely's data quality suite competitively",
                    pain: "Spends every Sunday evening reading Informatica's release notes before Monday's product sync",
                    quote:
                      "I need a way to know what competitors shipped this week without spending my whole Sunday on it.",
                    initials: "AC",
                  },
                  {
                    name: "Priya Patel",
                    role: "VP of Product Management",
                    goal: "Ensure the entire PM team is aligned on competitive landscape without scheduling weekly sync meetings",
                    pain: "Competitive intel is siloed — each PM tracks different competitors with no shared format",
                    quote:
                      "I want one place where the whole team sees the same competitive picture.",
                    initials: "PP",
                  },
                ].map(({ name, role, goal, pain, quote, initials }) => (
                  <div
                    key={name}
                    className="bg-[#F8F9FA] rounded-2xl border border-gray-100 p-7"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A154B] to-[#E20074] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{name}</p>
                        <p className="text-sm text-gray-500">{role}</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-5 text-sm text-gray-600">
                      <p>
                        <span className="font-semibold text-gray-800">Goal:</span>{" "}
                        <span>{goal}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">Pain:</span>{" "}
                        <span>{pain}</span>
                      </p>
                    </div>
                    <blockquote className="border-l-4 border-[#E20074] pl-4 italic text-gray-700 text-sm">
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  </div>
                ))}
              </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* SOLUTION                                                        */}
            {/* -------------------------------------------------------------- */}
            <section id="solution">
              <SectionHeading>The Solution</SectionHeading>
              <p className="text-gray-600 leading-relaxed mb-10">
                PM-Intel is built around three epics that map directly to the three sub-problems
                identified above.
              </p>

              <div className="space-y-10">
                {/* Epic 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-[#4A154B] bg-purple-50 border border-purple-100">
                      Epic 1
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">Autonomous Data Ingestion</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-[#E20074] font-bold mt-0.5">→</span>
                      Weekly cron job scrapes RSS feeds and blog pages of 5 competitors using
                      APScheduler + httpx + BeautifulSoup
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#E20074] font-bold mt-0.5">→</span>
                      Noise reduction pipeline strips marketing fluff before passing content to
                      the LLM layer
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#E20074] font-bold mt-0.5">→</span>
                      <span>
                        <strong className="text-gray-800">Design decision:</strong> Chose scraping
                        over third-party APIs to avoid per-seat licensing costs at scale
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-100" />

                {/* Epic 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-[#4A154B] bg-purple-50 border border-purple-100">
                      Epic 2
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      AI Synthesis — The Brain
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm leading-relaxed mb-5">
                    <li className="flex gap-2">
                      <span className="text-[#E20074] font-bold mt-0.5">→</span>
                      Claude Sonnet with structured JSON output for feature extraction and gap
                      analysis
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#E20074] font-bold mt-0.5">→</span>
                      Prompt engineering instructs the model to compare extracted features against
                      Precisely&apos;s known capabilities: data quality, address validation,
                      location intelligence, geocoding, data enrichment, governance
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#E20074] font-bold mt-0.5">→</span>
                      &ldquo;Draft Counter-Requirement&rdquo; flow: one-click generates a full PRD
                      ticket (user story + acceptance criteria + tech notes)
                    </li>
                  </ul>
                  <div className="bg-gray-900 rounded-xl p-5 font-mono text-sm text-gray-300 overflow-x-auto">
                    <p className="text-gray-500 mb-2">// Output schema</p>
                    <p className="text-green-400">
                      {`{`}
                    </p>
                    <p className="pl-4 text-yellow-300">{`  competitor: string,`}</p>
                    <p className="pl-4 text-yellow-300">{`  feature_name: string,`}</p>
                    <p className="pl-4 text-yellow-300">{`  description: string,`}</p>
                    <p className="pl-4 text-yellow-300">{`  gap_analysis: string,`}</p>
                    <p className="pl-4 text-yellow-300">{`  priority: "High" | "Medium" | "Low",`}</p>
                    <p className="pl-4 text-yellow-300">{`  confidence: number`}</p>
                    <p className="text-green-400">{`}`}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Epic 3 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-[#4A154B] bg-purple-50 border border-purple-100">
                      Epic 3
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">The Dashboard</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-[#E20074] font-bold mt-0.5">→</span>
                      Weekly brief view: top market movements, ranked by strategic priority
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#E20074] font-bold mt-0.5">→</span>
                      Competitor filter: view intel by company with a collapsible sidebar
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#E20074] font-bold mt-0.5">→</span>
                      History: all past briefs persisted in Supabase (PostgreSQL) with mock
                      fallback for demo mode
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* AI FLYWHEEL                                                     */}
            {/* -------------------------------------------------------------- */}
            <section id="flywheel">
              <SectionHeading>The AI Flywheel</SectionHeading>
              <p className="text-gray-600 leading-relaxed mb-8">
                The system&apos;s key insight is that the output of competitive analysis — a
                counter-requirement — feeds directly back into product planning. This closes the
                loop from raw market signal to internal product action, automatically.
              </p>

              {/* Flywheel visual */}
              <div className="bg-[#F8F9FA] rounded-2xl border border-gray-100 p-8 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 flex-wrap">
                  {[
                    { step: "Scrape", color: "from-blue-500 to-blue-600" },
                    { step: "Extract Features", color: "from-purple-500 to-[#4A154B]" },
                    { step: "Gap Analysis", color: "from-[#4A154B] to-[#E20074]" },
                    { step: "Brief Dashboard", color: "from-[#E20074] to-pink-600" },
                    { step: "PM Reviews", color: "from-orange-500 to-orange-600" },
                    { step: "Draft Requirement", color: "from-green-500 to-green-600" },
                    { step: "Product Roadmap", color: "from-teal-500 to-teal-600" },
                  ].map(({ step, color }, i, arr) => (
                    <div key={step} className="flex items-center gap-1 sm:gap-2">
                      <div
                        className={`px-3 py-2 rounded-xl text-white text-xs font-bold text-center bg-gradient-to-r ${color} shadow-sm`}
                      >
                        {step}
                      </div>
                      {i < arr.length - 1 ? (
                        <span className="text-gray-300 font-bold text-lg hidden sm:block">→</span>
                      ) : (
                        <span className="text-gray-300 font-bold text-lg hidden sm:block">↺</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                  The loop closes: better requirements → better product → stronger competitive position
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed">
                Instead of competitive intelligence being a one-time report that gets forgotten
                in a Confluence page, PM-Intel makes it a continuous input to the product
                process. Every Monday morning, the team starts with a shared baseline — and
                every brief card links directly to a one-click PRD generator.
              </p>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* SUCCESS METRICS                                                 */}
            {/* -------------------------------------------------------------- */}
            <section id="metrics">
              <SectionHeading>Success Metrics</SectionHeading>
              <p className="text-gray-600 leading-relaxed mb-8">
                Three metrics define success at launch. These were chosen to be measurable without
                instrumentation complexity during the prototype phase.
              </p>

              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F9FA] border-b border-gray-100">
                      <th className="text-left px-6 py-4 font-semibold text-gray-700">Metric</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700">Baseline</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700">Target</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        How Measured
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {[
                      {
                        metric: "Weekly research time per PM",
                        baseline: "5 hours",
                        target: "15 minutes",
                        how: "Self-reported time tracking",
                      },
                      {
                        metric: "Counter-requirement clicks",
                        baseline: "0",
                        target: "10+ / week",
                        how: "Click event on \"Draft Counter-Requirement\"",
                      },
                      {
                        metric: "Pipeline success rate",
                        baseline: "N/A",
                        target: "95%",
                        how: "Scraper job success/failure logs",
                      },
                    ].map(({ metric, baseline, target, how }) => (
                      <tr key={metric} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium text-gray-900">{metric}</td>
                        <td className="px-6 py-4 text-gray-500">{baseline}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-[#4A154B]">{target}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{how}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* ROI ANALYSIS                                                    */}
            {/* -------------------------------------------------------------- */}
            <section id="roi">
              <SectionHeading>ROI Analysis</SectionHeading>

              <div className="rounded-2xl bg-gradient-to-br from-[#4A154B] to-[#E20074] p-8 text-white mb-8">
                <h3 className="text-xl font-bold mb-6">The Calculation</h3>
                <div className="space-y-3 text-sm font-mono">
                  {[
                    "10 PMs on Precisely's product team",
                    "4.75 hrs saved / week × 10 PMs = 47.5 hrs / week",
                    "47.5 hrs × 50 weeks = 2,375 hrs / year",
                    "2,375 hrs × $85/hr (blended PM rate) = $201,875",
                  ].map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-white/40 w-5 flex-shrink-0">{i + 1}.</span>
                      <span className="text-white/90">{line}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-4xl font-bold">$201,875</p>
                  <p className="text-white/70 text-sm mt-1">
                    in recovered productivity annually, for a team of 10 PMs
                  </p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                This is a conservative estimate — it excludes additional value from faster
                competitive reaction (better roadmap prioritization), reduced meeting overhead
                (no weekly competitive sync needed), and the compounding benefit of having a
                shared competitive baseline that prevents duplicated research across the team.
                The directional signal is that the ROI justifies a full-time PM tooling
                investment, not just a prototype.
              </p>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* ARCHITECTURE                                                    */}
            {/* -------------------------------------------------------------- */}
            <section id="architecture">
              <SectionHeading>Technical Architecture</SectionHeading>

              <div className="bg-gray-900 rounded-2xl p-6 font-mono text-xs text-gray-300 overflow-x-auto mb-8">
                <pre>{`┌─────────────────────────────────────────────────────────────┐
│                     PM-Intel Agent                          │
├──────────────┬──────────────────────┬───────────────────────┤
│  Scraping    │    AI Analysis       │   Frontend            │
│  Layer       │    Layer             │   Layer               │
│              │                      │                       │
│  APScheduler │  Claude Sonnet   │  Next.js 14 App Router│
│  httpx       │  Structured JSON     │  Tailwind CSS         │
│  BeautifulSoup│  Feature Extraction │  Shadcn UI            │
│              │  Gap Analysis        │  React                │
│              │  PRD Generation      │                       │
├──────────────┴──────────────────────┴───────────────────────┤
│                    Data Layer                               │
│         Supabase (PostgreSQL) + In-Memory Mock              │
└─────────────────────────────────────────────────────────────┘`}</pre>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 flex gap-3">
                <span className="text-blue-500 text-lg flex-shrink-0">ℹ</span>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Prototype Scope</p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    The live demo uses curated sample data to showcase the analysis and PRD generation
                    workflows end-to-end. The <strong>AI Analysis Layer</strong> and{" "}
                    <strong>Draft Counter-Requirement</strong> features make real Claude API calls on
                    every interaction. In a production deployment, the Python scraping backend would
                    replace the sample data by pulling live content from competitor RSS feeds and
                    blog pages on a weekly schedule — the architecture for this layer is fully
                    implemented in the repo.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  {
                    title: "Scraping Layer",
                    items: [
                      "APScheduler triggers weekly cron",
                      "httpx for async HTTP requests",
                      "BeautifulSoup for HTML parsing",
                      "Noise reduction before LLM call",
                    ],
                  },
                  {
                    title: "AI Analysis Layer",
                    items: [
                      "Claude Sonnet (Anthropic)",
                      "Structured JSON output schema",
                      "Feature extraction + gap analysis",
                      "PRD counter-requirement generation",
                    ],
                  },
                  {
                    title: "Frontend Layer",
                    items: [
                      "Next.js 14 App Router",
                      "Tailwind CSS + Shadcn UI",
                      "React with TypeScript",
                      "Mock data fallback for demos",
                    ],
                  },
                ].map(({ title, items }) => (
                  <div
                    key={title}
                    className="bg-[#F8F9FA] rounded-2xl border border-gray-100 p-6"
                  >
                    <h4 className="font-bold text-gray-900 mb-3">{title}</h4>
                    <ul className="space-y-1.5">
                      {items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-gray-600">
                          <span className="text-[#E20074] mt-0.5 flex-shrink-0">·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* ROADMAP                                                         */}
            {/* -------------------------------------------------------------- */}
            <section id="roadmap">
              <SectionHeading>Roadmap</SectionHeading>

              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    phase: "P1 — MVP (Built)",
                    color: "border-[#4A154B] bg-purple-50/50",
                    badge: "bg-[#4A154B] text-white",
                    items: [
                      "Weekly automated scraper for 5 competitors",
                      "Claude-powered feature extraction + gap analysis",
                      "Priority-ranked weekly brief dashboard",
                      "One-click PRD counter-requirement generator",
                    ],
                  },
                  {
                    phase: "P2 — Next Quarter",
                    color: "border-gray-200 bg-white",
                    badge: "bg-gray-100 text-gray-700",
                    items: [
                      "Competitor sentiment scoring",
                      "Slack webhook for Monday morning delivery",
                      "Email digest with HTML formatting",
                      "Historical trend charts",
                      "Saved search + alerting",
                      "Jira/Linear backlog integration",
                    ],
                  },
                  {
                    phase: "P3 — Future Vision",
                    color: "border-gray-100 bg-white",
                    badge: "bg-gray-50 text-gray-500",
                    items: [
                      "Win/loss analysis integration",
                      "Multi-language monitoring",
                      "Team annotations on briefs",
                      "CRM deal outcome correlation",
                      "Automated competitive battlecards",
                    ],
                  },
                ].map(({ phase, color, badge, items }) => (
                  <div key={phase} className={`rounded-2xl border-2 ${color} p-6`}>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-5 ${badge}`}
                    >
                      {phase}
                    </span>
                    <ul className="space-y-2.5">
                      {items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-[#E20074] mt-0.5 flex-shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* REFLECTIONS                                                     */}
            {/* -------------------------------------------------------------- */}
            <section id="reflections" className="pb-10">
              <SectionHeading>Reflections</SectionHeading>

              <div className="space-y-6">
                {[
                  {
                    title: "Hardest part: prompt engineering the gap analysis",
                    body: "The hardest part wasn't the scraping — it was prompt engineering the gap analysis to be opinionated without being wrong. Early versions would hallucinate Precisely capabilities that didn't exist, producing confident but inaccurate gap assessments. Adding a grounded context block about Precisely's actual platform (data quality, address validation, location intelligence, geocoding, data enrichment, governance) significantly improved accuracy and reduced hallucination.",
                  },
                  {
                    title: "Highest product leverage: Draft Counter-Requirement",
                    body: "The \"Draft Counter-Requirement\" feature had the highest product leverage of anything built. A PM could go from seeing a competitor's feature to having a ready-to-paste Jira ticket in under 30 seconds. This collapsed a multi-hour workflow into a single button click — the kind of step-function improvement that users immediately notice.",
                  },
                  {
                    title: "If I continued: close the feedback loop",
                    body: "If I were to continue this project, the highest-ROI next step would be building a feedback loop: tracking which generated requirements actually make it into the roadmap, and using that signal to improve the prompt. Right now the system outputs intelligence but doesn't learn from what gets acted on. Closing that loop would make PM-Intel a genuinely adaptive system over time.",
                  },
                ].map(({ title, body }) => (
                  <div
                    key={title}
                    className="bg-[#F8F9FA] rounded-2xl border border-gray-100 p-7"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{body}</p>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 pt-10 border-t border-gray-100 text-center">
                <p className="text-gray-500 mb-6">
                  Ready to explore the live product?
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#4A154B] to-[#E20074] hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/20"
                >
                  Launch the Dashboard
                  <span className="text-white/80">→</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F8F9FA] border-t border-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-gray-900">
              PM-Intel Agent{" "}
              <span className="text-gray-400 font-normal">· Built for Precisely Software</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Built with Next.js, Tailwind, and Anthropic Claude
            </p>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Overview
            </Link>
            <Link href="/dashboard" className="hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link href="/case-study" className="hover:text-gray-900 transition-colors">
              Case Study
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
