"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Activity, Database } from "lucide-react";

interface Competitor {
  id: string;
  name: string;
  url: string;
  logo_url: string | null;
  last_scraped_at: string | null;
  brief_count: number;
  latest_brief: string | null;
}

interface SidebarProps {
  competitors: Competitor[];
  selectedCompetitor: string | null;
  onSelectCompetitor: (name: string | null) => void;
  onTriggerAnalysis: (name: string) => void;
  isAnalyzing: boolean;
}

function getStatusColor(lastScrapedAt: string | null): {
  dot: string;
  label: string;
  description: string;
} {
  if (!lastScrapedAt) {
    return { dot: "bg-gray-300", label: "Never", description: "Not yet scraped" };
  }
  const hours = (Date.now() - new Date(lastScrapedAt).getTime()) / (1000 * 60 * 60);
  if (hours < 24) {
    return { dot: "bg-emerald-500", label: "Fresh", description: "Updated today" };
  }
  if (hours < 72) {
    return { dot: "bg-amber-400", label: "Recent", description: "Updated this week" };
  }
  return { dot: "bg-red-400", label: "Stale", description: "Over 3 days old" };
}

function CompetitorInitial({ name }: { name: string }) {
  const colors: Record<string, string> = {
    Informatica: "from-blue-500 to-blue-700",
    Talend: "from-green-500 to-green-700",
    Collibra: "from-orange-500 to-orange-700",
    Ataccama: "from-purple-500 to-purple-700",
    Experian: "from-red-500 to-red-700",
  };
  const gradient = colors[name] || "from-gray-500 to-gray-700";
  return (
    <div
      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
    >
      {name[0]}
    </div>
  );
}

export default function Sidebar({
  competitors,
  selectedCompetitor,
  onSelectCompetitor,
  onTriggerAnalysis,
  isAnalyzing,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState<string | null>(null);

  const handleTriggerAnalysis = async (name: string) => {
    setAnalyzingCompetitor(name);
    await onTriggerAnalysis(name);
    setAnalyzingCompetitor(null);
  };

  if (collapsed) {
    return (
      <aside className="w-16 bg-white border-r border-gray-100 sidebar-shadow flex flex-col items-center py-4 gap-4 flex-shrink-0 transition-all duration-300">
        {/* Expand button */}
        <button
          onClick={() => setCollapsed(false)}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>

        {/* Precisely logo mark */}
        <div className="w-8 h-8 rounded-lg precisely-gradient flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>

        <div className="w-full border-t border-gray-100 my-1" />

        {/* Collapsed competitor dots */}
        {competitors.map((comp) => {
          const status = getStatusColor(comp.last_scraped_at);
          const isSelected = selectedCompetitor === comp.name;
          return (
            <button
              key={comp.id}
              onClick={() => onSelectCompetitor(isSelected ? null : comp.name)}
              title={comp.name}
              className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isSelected ? "ring-2 ring-[#4A154B] ring-offset-1" : ""
              }`}
            >
              <CompetitorInitial name={comp.name} />
              <span
                className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${status.dot}`}
              />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 sidebar-shadow flex flex-col flex-shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="precisely-gradient p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Database size={16} className="text-white/80" />
            <span className="text-white text-xs font-medium tracking-widest uppercase opacity-80">
              Precisely
            </span>
          </div>
          <h1 className="text-white font-bold text-lg leading-tight mt-0.5">PM-Intel</h1>
          <p className="text-white/60 text-xs mt-0.5">Competitive Intelligence</p>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Status legend */}
      <div className="px-4 py-3 border-b border-gray-50">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Tracked Competitors
        </p>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Fresh
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Recent
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            Stale
          </span>
        </div>
      </div>

      {/* Competitor list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {/* All filter */}
        <button
          onClick={() => onSelectCompetitor(null)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            selectedCompetitor === null
              ? "bg-purple-50 text-[#4A154B] font-semibold border-r-2 border-[#4A154B]"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Activity
            size={15}
            className={selectedCompetitor === null ? "text-[#4A154B]" : "text-gray-400"}
          />
          <span>All Competitors</span>
          <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
            {competitors.reduce((sum, c) => sum + c.brief_count, 0)}
          </span>
        </button>

        <div className="my-1 mx-4 border-t border-gray-50" />

        {competitors.map((comp) => {
          const status = getStatusColor(comp.last_scraped_at);
          const isSelected = selectedCompetitor === comp.name;
          const analyzing = analyzingCompetitor === comp.name;

          return (
            <div key={comp.id} className="group relative">
              <button
                onClick={() => onSelectCompetitor(isSelected ? null : comp.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isSelected
                    ? "bg-purple-50 text-[#4A154B] border-r-2 border-[#4A154B]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <CompetitorInitial name={comp.name} />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${isSelected ? "text-[#4A154B]" : ""}`}>
                      {comp.name}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`}
                      title={status.description}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">{status.description}</p>
                </div>
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 flex-shrink-0 ${
                    isSelected
                      ? "bg-[#4A154B]/10 text-[#4A154B]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {comp.brief_count}
                </span>
              </button>

              {/* Trigger analysis button — visible on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTriggerAnalysis(comp.name);
                }}
                disabled={analyzing || isAnalyzing}
                title={`Run analysis for ${comp.name}`}
                className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-[#E20074] hover:bg-pink-50 disabled:opacity-30"
              >
                <RefreshCw
                  size={12}
                  className={analyzing ? "animate-spin text-[#E20074]" : ""}
                />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Footer — Trigger all analysis */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 mb-2">
          Weekly auto-refresh: <span className="font-medium">Mon 8 AM UTC</span>
        </p>
        <button
          onClick={() => {
            competitors.forEach((c) => handleTriggerAnalysis(c.name));
          }}
          disabled={isAnalyzing}
          className="w-full py-2 px-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#4A154B] to-[#E20074] hover:opacity-90 active:opacity-80 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} className={isAnalyzing ? "animate-spin" : ""} />
          {isAnalyzing ? "Analysing..." : "Trigger Analysis"}
        </button>
      </div>
    </aside>
  );
}
