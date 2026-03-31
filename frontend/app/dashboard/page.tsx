"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Settings, RefreshCw, Sparkles } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import WeeklyBrief from "@/components/WeeklyBrief";
import DraftRequirementModal from "@/components/DraftRequirementModal";
import Navbar from "@/components/Navbar";

interface Competitor {
  id: string;
  name: string;
  url: string;
  logo_url: string | null;
  last_scraped_at: string | null;
  brief_count: number;
  latest_brief: string | null;
}

interface Brief {
  id: string;
  competitor_id: string;
  competitor_name: string;
  feature_name: string;
  description: string;
  gap_analysis: string;
  priority: "High" | "Medium" | "Low";
  source_url: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [loadingCompetitors, setLoadingCompetitors] = useState(true);
  const [loadingBriefs, setLoadingBriefs] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [liveAnalysisCount, setLiveAnalysisCount] = useState(0);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchCompetitors = useCallback(async () => {
    try {
      const res = await fetch("/api/competitors");
      const data = await res.json() as { competitors: Competitor[]; _source?: string };
      setCompetitors(data.competitors || []);
    } catch {
      setCompetitors([]);
    } finally {
      setLoadingCompetitors(false);
    }
  }, []);

  const fetchBriefs = useCallback(
    async (competitorFilter?: string | null) => {
      setLoadingBriefs(true);
      try {
        const url = competitorFilter
          ? `/api/briefs?competitor=${encodeURIComponent(competitorFilter)}`
          : "/api/briefs";
        const res = await fetch(url);
        const data = await res.json() as { briefs: Brief[]; _source?: string };
        setBriefs(data.briefs || []);
        setLastUpdated(new Date());
      } catch {
        setBriefs([]);
      } finally {
        setLoadingBriefs(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    void fetchCompetitors();
    void fetchBriefs(null);
  }, [fetchCompetitors, fetchBriefs]);

  // Re-fetch briefs when competitor filter changes
  useEffect(() => {
    void fetchBriefs(selectedCompetitor);
  }, [selectedCompetitor, fetchBriefs]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const handleTriggerAnalysis = async (competitorName: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitor: competitorName }),
      });
      const data = await res.json() as { briefs?: Brief[]; error?: string };
      if (data.briefs && data.briefs.length > 0) {
        setBriefs((prev) => [...data.briefs!, ...prev]);
        setLiveAnalysisCount((n) => n + data.briefs!.length);
        setLastUpdated(new Date());
      }
    } catch {
      // Silently fail — existing data remains
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const competitorNames = competitors.map((c) => c.name);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F9FA]">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          competitors={competitors}
          selectedCompetitor={selectedCompetitor}
          onSelectCompetitor={setSelectedCompetitor}
          onTriggerAnalysis={handleTriggerAnalysis}
          isAnalyzing={isAnalyzing}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top header */}
          <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Precisely wordmark */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded precisely-gradient flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="font-semibold text-gray-900 text-sm">Precisely</span>
                <span className="text-gray-300">/</span>
                <span className="precisely-gradient-text font-bold text-sm">PM-Intel Agent</span>
              </div>

              {/* AI-Powered badge */}
              <span className="flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2 py-1 rounded-full">
                <Sparkles size={11} />
                AI-Powered
              </span>
              {liveAnalysisCount > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                  +{liveAnalysisCount} live
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Last updated */}
              {lastUpdated && (
                <p className="text-xs text-gray-400 hidden sm:block">
                  Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}

              {/* Refresh button */}
              <button
                onClick={() => {
                  void fetchCompetitors();
                  void fetchBriefs(selectedCompetitor);
                }}
                disabled={loadingBriefs}
                title="Refresh data"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={15} className={loadingBriefs ? "animate-spin" : ""} />
              </button>

              <button
                title="Notifications (coming soon)"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Bell size={15} />
              </button>

              <button
                title="Settings (coming soon)"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Settings size={15} />
              </button>

              {/* User avatar placeholder */}
              <div className="w-8 h-8 rounded-full precisely-gradient flex items-center justify-center text-white text-xs font-bold ml-1">
                PM
              </div>
            </div>
          </header>

          {/* Page body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {loadingCompetitors && loadingBriefs ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full precisely-gradient flex items-center justify-center animate-pulse">
                    <RefreshCw size={18} className="text-white animate-spin" />
                  </div>
                  <p className="text-sm text-gray-500">Loading intelligence feed...</p>
                </div>
              </div>
            ) : (
              <WeeklyBrief
                briefs={briefs}
                loading={loadingBriefs}
                selectedCompetitor={selectedCompetitor}
                competitors={competitorNames}
                onDraftRequirement={setSelectedBrief}
              />
            )}
          </div>
        </main>
      </div>

      {/* Draft Requirement Modal */}
      <DraftRequirementModal
        brief={selectedBrief}
        onClose={() => setSelectedBrief(null)}
      />
    </div>
  );
}
