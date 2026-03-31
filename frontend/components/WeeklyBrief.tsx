"use client";

import { useState } from "react";
import { Zap, TrendingUp, AlertTriangle, ChevronDown } from "lucide-react";
import CompetitorCard from "./CompetitorCard";

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

interface WeeklyBriefProps {
  briefs: Brief[];
  loading: boolean;
  selectedCompetitor: string | null;
  competitors: string[];
  onDraftRequirement: (brief: Brief) => void;
}

const ALL_FILTER = "All";
const COMPETITORS_FILTER = "Competitors";

function StatsRow({ briefs }: { briefs: Brief[] }) {
  const highCount = briefs.filter((b) => b.priority === "High").length;
  const medCount = briefs.filter((b) => b.priority === "Medium").length;
  const lowCount = briefs.filter((b) => b.priority === "Low").length;
  const uniqueCompetitors = new Set(briefs.map((b) => b.competitor_name)).size;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <TrendingUp size={16} className="text-gray-600" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{briefs.length}</p>
          <p className="text-xs text-gray-500">Total Signals</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-red-100 p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
          <AlertTriangle size={16} className="text-red-500" />
        </div>
        <div>
          <p className="text-xl font-bold text-red-600">{highCount}</p>
          <p className="text-xs text-gray-500">High Priority</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-amber-100 p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Zap size={16} className="text-amber-500" />
        </div>
        <div>
          <p className="text-xl font-bold text-amber-600">{medCount}</p>
          <p className="text-xs text-gray-500">Medium Priority</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-500">{uniqueCompetitors}</span>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-700">{uniqueCompetitors}</p>
          <p className="text-xs text-gray-500">Competitors</p>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-gray-100" />
      <div className="p-5 space-y-3 animate-pulse">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full shimmer-bg" />
          <div className="h-5 w-24 rounded-full shimmer-bg" />
        </div>
        <div className="h-5 w-3/4 rounded shimmer-bg" />
        <div className="space-y-2">
          <div className="h-3 rounded shimmer-bg" />
          <div className="h-3 w-5/6 rounded shimmer-bg" />
          <div className="h-3 w-2/3 rounded shimmer-bg" />
        </div>
        <div className="flex justify-end">
          <div className="h-9 w-44 rounded-lg shimmer-bg" />
        </div>
      </div>
    </div>
  );
}

type SortOption = "priority" | "date" | "competitor";

const SORT_PRIORITY: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

export default function WeeklyBrief({
  briefs,
  loading,
  selectedCompetitor,
  competitors,
  onDraftRequirement,
}: WeeklyBriefProps) {
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter by priority
  const filteredBriefs = briefs.filter((b) => {
    if (priorityFilter !== "All" && b.priority !== priorityFilter) return false;
    return true;
  });

  // Sort
  const sortedBriefs = [...filteredBriefs].sort((a, b) => {
    if (sortBy === "priority") {
      return (SORT_PRIORITY[a.priority] ?? 3) - (SORT_PRIORITY[b.priority] ?? 3);
    }
    if (sortBy === "date") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "competitor") {
      return a.competitor_name.localeCompare(b.competitor_name);
    }
    return 0;
  });

  const heading = selectedCompetitor
    ? `${selectedCompetitor} Intelligence`
    : "This Week's Intelligence";

  const subheading = selectedCompetitor
    ? `Competitive signals for ${selectedCompetitor}`
    : `Monitoring ${competitors.length} competitors across the data integrity landscape`;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Section header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{heading}</h2>
          <p className="text-sm text-gray-500 mt-1">{subheading}</p>
        </div>

        {/* Sort control */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Sort:{" "}
            <span className="font-medium capitalize">{sortBy}</span>
            <ChevronDown size={14} />
          </button>
          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                {(["priority", "date", "competitor"] as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm capitalize hover:bg-gray-50 transition-colors ${
                      sortBy === opt ? "text-[#4A154B] font-semibold bg-purple-50" : "text-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats row */}
      {!loading && <StatsRow briefs={briefs} />}

      {/* Priority filter tabs */}
      <div className="flex items-center gap-1 mb-5 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {(["All", "High", "Medium", "Low"] as const).map((p) => {
          const count =
            p === "All"
              ? briefs.length
              : briefs.filter((b) => b.priority === p).length;
          return (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                priorityFilter === p
                  ? "bg-gradient-to-r from-[#4A154B] to-[#E20074] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {p}
              <span
                className={`ml-1.5 text-xs ${
                  priorityFilter === p ? "text-white/70" : "text-gray-400"
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Brief cards */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-6">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && sortedBriefs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <TrendingUp size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No intelligence signals found</p>
            <p className="text-gray-400 text-sm mt-1">
              {selectedCompetitor
                ? `No ${priorityFilter === "All" ? "" : priorityFilter.toLowerCase() + " priority "}signals for ${selectedCompetitor}`
                : "Try changing the priority filter or triggering a new analysis"}
            </p>
          </div>
        )}

        {!loading &&
          sortedBriefs.map((brief) => (
            <CompetitorCard
              key={brief.id}
              brief={brief}
              onDraftRequirement={onDraftRequirement}
            />
          ))}
      </div>
    </div>
  );
}
