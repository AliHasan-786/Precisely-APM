"use client";

import { useState } from "react";
import { ExternalLink, Sparkles, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

interface CompetitorCardProps {
  brief: Brief;
  onDraftRequirement: (brief: Brief) => void;
}

const COMPETITOR_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
  Informatica: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    gradient: "from-blue-500 to-blue-700",
  },
  Talend: {
    bg: "bg-green-50",
    text: "text-green-700",
    gradient: "from-green-500 to-green-700",
  },
  Collibra: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    gradient: "from-orange-500 to-orange-700",
  },
  Ataccama: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    gradient: "from-purple-500 to-purple-700",
  },
  Experian: {
    bg: "bg-red-50",
    text: "text-red-700",
    gradient: "from-red-500 to-red-700",
  },
};

const PRIORITY_CONFIG: Record<
  string,
  { bg: string; text: string; border: string; dot: string; label: string }
> = {
  High: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "High Priority",
  },
  Medium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    label: "Medium Priority",
  },
  Low: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: "Low Priority",
  },
};

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days === 0) return hours <= 1 ? "Just now" : `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CompetitorCard({ brief, onDraftRequirement }: CompetitorCardProps) {
  const [expanded, setExpanded] = useState(false);

  const compColors = COMPETITOR_COLORS[brief.competitor_name] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    gradient: "from-gray-500 to-gray-700",
  };
  const priorityConf = PRIORITY_CONFIG[brief.priority] || PRIORITY_CONFIG.Medium;

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm card-hover overflow-hidden">
      {/* Top accent bar — color coded by priority */}
      <div
        className={`h-1 w-full ${
          brief.priority === "High"
            ? "bg-gradient-to-r from-red-400 to-red-600"
            : brief.priority === "Medium"
            ? "bg-gradient-to-r from-amber-400 to-amber-500"
            : "bg-gradient-to-r from-emerald-400 to-emerald-500"
        }`}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Competitor badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${compColors.bg} ${compColors.text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${compColors.gradient}`}
              />
              {brief.competitor_name}
            </span>

            {/* Priority badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityConf.bg} ${priorityConf.text} ${priorityConf.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityConf.dot}`} />
              {priorityConf.label}
            </span>
          </div>

          {/* Timestamp + source link */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {formatRelativeTime(brief.created_at)}
            </span>
            {brief.source_url && (
              <a
                href={brief.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="View source"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Feature title */}
        <h3 className="text-gray-900 font-semibold text-base leading-snug mb-2">
          {brief.feature_name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{brief.description}</p>

        {/* Gap analysis — collapsible */}
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              AI Gap Analysis
            </span>
            <span className="text-xs text-gray-400">{expanded ? "Hide" : "Show"}</span>
          </button>

          {expanded && (
            <div className="px-4 py-3 bg-white">
              <div className="markdown-content text-sm text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.gap_analysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {expanded ? "Collapse analysis" : "Expand analysis"}
          </button>

          <button
            onClick={() => onDraftRequirement(brief)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#4A154B] to-[#E20074] hover:opacity-90 active:opacity-80 transition-opacity shadow-sm"
          >
            <Sparkles size={14} />
            Draft Counter-Requirement
          </button>
        </div>
      </div>
    </article>
  );
}
