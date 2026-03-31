"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Sparkles, AlertCircle } from "lucide-react";

interface Brief {
  id: string;
  competitor_name: string;
  feature_name: string;
  description: string;
  gap_analysis: string;
  priority: string;
}

interface PRDResult {
  title: string;
  user_story: string;
  acceptance_criteria: string[];
  technical_notes: string;
  priority: string;
}

interface DraftRequirementModalProps {
  brief: Brief | null;
  onClose: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-blue-100 text-blue-700 border-blue-200",
  P0: "bg-red-100 text-red-700 border-red-200",
  P1: "bg-amber-100 text-amber-700 border-amber-200",
  P2: "bg-blue-100 text-blue-700 border-blue-200",
};

function SkeletonLine({ width = "w-full" }: { width?: string }) {
  return (
    <div className={`h-4 rounded shimmer-bg ${width}`} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-3 w-16 rounded shimmer-bg mb-2" />
        <SkeletonLine width="w-4/5" />
      </div>
      <div>
        <div className="h-3 w-20 rounded shimmer-bg mb-2" />
        <div className="space-y-2">
          <SkeletonLine />
          <SkeletonLine width="w-11/12" />
          <SkeletonLine width="w-3/4" />
        </div>
      </div>
      <div>
        <div className="h-3 w-32 rounded shimmer-bg mb-3" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded shimmer-bg flex-shrink-0 mt-0.5" />
              <SkeletonLine />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="h-3 w-28 rounded shimmer-bg mb-2" />
        <div className="space-y-2">
          <SkeletonLine width="w-full" />
          <SkeletonLine width="w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default function DraftRequirementModal({ brief, onClose }: DraftRequirementModalProps) {
  const [prd, setPrd] = useState<PRDResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchPRD = useCallback(async () => {
    if (!brief) return;
    setLoading(true);
    setError(null);
    setPrd(null);

    try {
      const response = await fetch("/api/draft-requirement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief_id: brief.id,
          feature_name: brief.feature_name,
          description: brief.description,
          gap_analysis: brief.gap_analysis,
          competitor: brief.competitor_name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json() as PRDResult;
      setPrd(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate requirement");
    } finally {
      setLoading(false);
    }
  }, [brief]);

  useEffect(() => {
    if (brief) {
      fetchPRD();
    } else {
      setPrd(null);
      setError(null);
    }
  }, [brief, fetchPRD]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCopy = async () => {
    if (!prd) return;
    const text = formatPRDAsText(prd, brief!);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — no-op
    }
  };

  if (!brief) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Modal header */}
          <div className="precisely-gradient px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-white" />
              <div>
                <h2 id="modal-title" className="text-white font-semibold text-base">
                  Draft Counter-Requirement
                </h2>
                <p className="text-white/60 text-xs">AI-generated PRD ticket</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Context strip */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-500">
              Responding to:{" "}
              <span className="font-semibold text-gray-700">{brief.competitor_name}</span>
              {" — "}
              <span className="text-gray-600 italic">{brief.feature_name}</span>
            </p>
          </div>

          {/* Modal body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {loading && <LoadingSkeleton />}

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Generation failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                  <button
                    onClick={fetchPRD}
                    className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {prd && (
              <div className="space-y-5">
                {/* Priority + Title */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        PRIORITY_COLORS[prd.priority] || PRIORITY_COLORS.P1
                      }`}
                    >
                      {prd.priority}
                    </span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      Ticket Title
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg leading-tight">{prd.title}</h3>
                </div>

                <div className="border-t border-gray-100" />

                {/* User story */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    User Story
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed bg-blue-50 rounded-lg p-3 border border-blue-100 italic">
                    {prd.user_story}
                  </p>
                </div>

                {/* Acceptance criteria */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Acceptance Criteria
                  </h4>
                  <ul className="space-y-2">
                    {prd.acceptance_criteria.map((criterion, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5 flex items-center justify-center">
                          <span className="text-[10px] text-gray-400 font-bold">{i + 1}</span>
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical notes */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Technical Notes
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                    {prd.technical_notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal footer */}
          {(prd || error) && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-white">
              <p className="text-xs text-gray-400">
                {prd ? "AI-generated — review before using" : ""}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                {prd && (
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      copied
                        ? "bg-emerald-500 text-white"
                        : "bg-gradient-to-r from-[#4A154B] to-[#E20074] text-white hover:opacity-90"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPRDAsText(prd: PRDResult, brief: Brief): string {
  const criteria = prd.acceptance_criteria
    .map((c, i) => `  ${i + 1}. ${c}`)
    .join("\n");

  return `# ${prd.title}

Priority: ${prd.priority}
Competitive Context: ${brief.competitor_name} — ${brief.feature_name}

## User Story
${prd.user_story}

## Acceptance Criteria
${criteria}

## Technical Notes
${prd.technical_notes}

---
Generated by Precisely PM-Intel Agent
`;
}
