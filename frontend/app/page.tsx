import Link from "next/link";
import {
  ArrowRight,
  Database,
  Clock,
  Zap,
  FileText,
  Search,
  Brain,
  BarChart3,
  PenLine,
  AlertTriangle,
  Users,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";

// ---------------------------------------------------------------------------
// Static sections — no client-side JS needed
// ---------------------------------------------------------------------------

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background gradient orb */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#4A154B]/8 to-[#E20074]/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#E20074]/6 to-[#4A154B]/6 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-sm font-medium text-[#4A154B] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E20074] animate-pulse" />
            Built for Precisely Software — AI PM Internship Portfolio
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08] mb-6">
            Competitive Intelligence,{" "}
            <span className="bg-gradient-to-r from-[#4A154B] to-[#E20074] bg-clip-text text-transparent">
              on Autopilot
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            PM-Intel monitors Informatica, Talend, Collibra, and more — then uses AI to tell you
            what it means for Precisely&apos;s roadmap.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#4A154B] to-[#E20074] hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/20"
            >
              Launch Demo
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/case-study"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Read Case Study
            </Link>
          </div>

          {/* Stat pills */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {[
              { icon: Clock, text: "5 hrs → 15 min weekly research" },
              { icon: Users, text: "5 competitors tracked" },
              { icon: FileText, text: "1-click PRD generation" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600"
              >
                <Icon size={15} className="text-[#E20074]" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PROBLEM                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E20074] mb-3">
              The Challenge
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              The Problem{" "}
              <span className="bg-gradient-to-r from-[#4A154B] to-[#E20074] bg-clip-text text-transparent">
                Every PM Knows
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Staying ahead of competitors in data integrity is a full-time job — on top of your
              actual full-time job.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: Database,
                title: "Fragmented Intel",
                desc: "Competitor updates live across 20+ blogs, release notes, and docs. No single feed. No structure.",
              },
              {
                icon: Clock,
                title: "Delayed Reactions",
                desc: "By the time a PM synthesizes a competitor launch, the roadmap meeting already happened.",
              },
              {
                icon: AlertTriangle,
                title: "High Cognitive Load",
                desc: "Translating raw feature drops into internal requirements takes hours of context-switching.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4A154B]/10 to-[#E20074]/10 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-[#4A154B]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Quote callout */}
          <div className="bg-white rounded-2xl border border-purple-100 p-8 text-center">
            <p className="text-xl font-medium text-gray-800 italic max-w-2xl mx-auto">
              &ldquo;PMs spend an estimated 5&ndash;10 hours per week on manual competitive
              research.&rdquo;
            </p>
            <p className="text-sm text-gray-400 mt-3 font-medium">— Precisely Product Team</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* HOW IT WORKS                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E20074] mb-3">
              How It Works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              From Raw Signal to{" "}
              <span className="bg-gradient-to-r from-[#4A154B] to-[#E20074] bg-clip-text text-transparent">
                Roadmap Action
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            {[
              {
                icon: Search,
                emoji: "🔍",
                step: "01",
                title: "Scrape",
                desc: "Weekly cron job pulls competitor blogs, release notes, and RSS feeds automatically.",
              },
              {
                icon: Brain,
                emoji: "🧠",
                step: "02",
                title: "Analyze",
                desc: "Claude claude-sonnet-4-6 extracts features and compares against Precisely's platform capabilities.",
              },
              {
                icon: BarChart3,
                emoji: "📊",
                step: "03",
                title: "Brief",
                desc: "Gap analysis surfaces in a clean dashboard, ranked by strategic priority.",
              },
              {
                icon: PenLine,
                emoji: "✍️",
                step: "04",
                title: "Act",
                desc: "One-click generates a full PRD counter-requirement ticket ready for Jira.",
              },
            ].map(({ emoji, step, title, desc }, i) => (
              <div key={title} className="relative">
                {/* Arrow connector */}
                {i < 3 && (
                  <div className="hidden sm:block absolute top-8 -right-2 z-10 text-gray-300 text-xl">
                    →
                  </div>
                )}
                <div className="bg-[#F8F9FA] rounded-2xl border border-gray-100 p-6 h-full">
                  <div className="text-3xl mb-4">{emoji}</div>
                  <p className="text-[11px] font-bold text-[#E20074] tracking-widest uppercase mb-1">
                    Step {step}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* DASHBOARD PREVIEW                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E20074] mb-3">
              The Product
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              See It{" "}
              <span className="bg-gradient-to-r from-[#4A154B] to-[#E20074] bg-clip-text text-transparent">
                In Action
              </span>
            </h2>
            <p className="text-gray-500 text-lg">
              A live dashboard that surfaces competitive intelligence as fast as PMs can act on it.
            </p>
          </div>

          {/* Mockup frame */}
          <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-purple-900/10 overflow-hidden bg-white">
            {/* Browser chrome */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200 max-w-xs mx-auto text-center">
                  pm-intel.vercel.app/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard mockup body */}
            <div className="flex h-64 sm:h-80">
              {/* Sidebar mock */}
              <div className="w-44 sm:w-52 bg-gradient-to-b from-[#4A154B] to-[#6B1F6C] border-r border-purple-900/20 flex flex-col p-3 flex-shrink-0">
                <div className="mb-4">
                  <p className="text-white font-bold text-sm">PM-Intel</p>
                  <p className="text-white/50 text-[10px]">Competitive Intelligence</p>
                </div>
                <p className="text-white/40 text-[9px] uppercase tracking-wider font-semibold mb-2">
                  Tracked Competitors
                </p>
                {["Informatica", "Talend", "Collibra", "Ataccama", "Experian"].map(
                  (name, i) => (
                    <div
                      key={name}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 text-xs ${
                        i === 0
                          ? "bg-white/15 text-white"
                          : "text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 ${
                          ["bg-blue-500", "bg-green-500", "bg-orange-500", "bg-purple-500", "bg-red-500"][i]
                        }`}
                      >
                        {name[0]}
                      </div>
                      <span className="truncate">{name}</span>
                      <span className="ml-auto text-[9px] text-white/40">
                        {[4, 3, 3, 2, 2][i]}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Main content mock */}
              <div className="flex-1 bg-[#F8F9FA] p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">This Week&apos;s Intelligence</p>
                    <p className="text-gray-400 text-[10px]">Monitoring 5 competitors</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-md bg-white border border-gray-100 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-[#4A154B] animate-none" />
                    </div>
                  </div>
                </div>

                {/* Stat row */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: "Signals", val: "14", color: "text-gray-900" },
                    { label: "High", val: "5", color: "text-red-600" },
                    { label: "Medium", val: "6", color: "text-amber-600" },
                    { label: "Co.", val: "5", color: "text-gray-700" },
                  ].map(({ label, val, color }) => (
                    <div
                      key={label}
                      className="bg-white rounded-lg border border-gray-100 p-2 text-center"
                    >
                      <p className={`font-bold text-sm ${color}`}>{val}</p>
                      <p className="text-[9px] text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {[
                    { comp: "Informatica", priority: "High", title: "AI-powered data cataloging" },
                    { comp: "Collibra", priority: "High", title: "Policy automation workflow" },
                    { comp: "Talend", priority: "Medium", title: "Cloud-native ETL pipeline" },
                  ].map(({ comp, priority, title }) => (
                    <div
                      key={title}
                      className="bg-white rounded-lg border border-gray-100 p-2.5 flex items-center gap-2"
                    >
                      <div
                        className={`w-1 h-8 rounded-full flex-shrink-0 ${
                          priority === "High" ? "bg-red-400" : "bg-amber-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full">
                            {comp}
                          </span>
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                              priority === "High"
                                ? "text-red-700 bg-red-50"
                                : "text-amber-700 bg-amber-50"
                            }`}
                          >
                            {priority}
                          </span>
                        </div>
                        <p className="text-[10px] font-medium text-gray-800 truncate">{title}</p>
                      </div>
                      <div className="text-[8px] font-semibold text-white bg-gradient-to-r from-[#4A154B] to-[#E20074] px-2 py-0.5 rounded flex-shrink-0">
                        Draft
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#4A154B] to-[#E20074] hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/20"
            >
              Launch the live demo to explore all 5 competitors
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ROI                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#4A154B] to-[#E20074] p-12 text-white text-center shadow-2xl shadow-purple-900/30">
            <p className="text-sm font-semibold tracking-widest uppercase text-white/60 mb-3">
              The Business Case
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Built to Save Time at Scale</h2>
            <p className="text-white/70 text-lg mb-12 max-w-xl mx-auto">
              The math is simple. The value compounds with every PM on the team.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {[
                {
                  metric: "5 hrs → 15 min",
                  label: "per PM per week",
                  sub: "97% reduction in manual research time",
                },
                {
                  metric: "95%",
                  label: "pipeline success rate",
                  sub: "Scraper job reliability target",
                },
                {
                  metric: "$212,500",
                  label: "annual savings",
                  sub: "For a team of 10 PMs at $85/hr avg rate",
                },
              ].map(({ metric, label, sub }) => (
                <div
                  key={metric}
                  className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm"
                >
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{metric}</p>
                  <p className="text-white/80 font-medium text-sm mb-1">{label}</p>
                  <p className="text-white/50 text-xs">{sub}</p>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-[#4A154B] bg-white hover:bg-gray-50 transition-colors shadow-lg"
            >
              Explore the Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                              */}
      {/* ------------------------------------------------------------------ */}
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
