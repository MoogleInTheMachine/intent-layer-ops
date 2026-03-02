"use client";

import { useMemo, useState } from "react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const inputClass =
  "border border-border rounded-lg px-3 py-2 text-sm bg-background " +
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent " +
  "transition-shadow";

export default function NewSummaryPage() {
  const [start, setStart] = useState(todayISO());
  const [end, setEnd] = useState(todayISO());
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const generated = useMemo(() => {
    return `You are helping me prepare a checkpoint update.

Input: A set of diary entries between ${start} and ${end}.
Task:
1) Summarize what I accomplished (5–10 bullets).
2) Identify key decisions (bullets).
3) Identify blockers/risks (bullets).
4) Propose a slide outline (6–10 slides) with slide titles + bullets.
5) Call out evidence I should include (links, metrics, screenshots), and any gaps.

Constraints:
- Be concise.
- Use only information present in the diary extract.
- Do not invent details.
Output format:
- Section headings + bullets.
`;
  }, [start, end]);

  async function handleCopy() {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Generate summary prompt</h1>
        <p className="text-sm text-muted">
          Pick a date range, copy the generated prompt, and paste it into your AI tool
          along with your diary entries from that period.
        </p>
      </div>

      {/* Date range */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-foreground">Date range</div>
        <div className="flex items-end gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted">Start</label>
            <input
              className={inputClass}
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted">End</label>
            <input
              className={inputClass}
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Generated prompt */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-foreground">Generated prompt</h2>
            <p className="text-xs text-muted">
              Copy this and paste it into Claude, GPT, or your preferred AI tool
              along with the relevant diary entries.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              copied
                ? "border-success text-success"
                : "border-border text-muted hover:border-accent hover:text-foreground"
            }`}
          >
            {copied ? "Copied!" : "Copy prompt"}
          </button>
        </div>
        <pre className="border border-border rounded-xl p-4 text-sm whitespace-pre-wrap bg-surface leading-relaxed font-mono text-foreground">
          {generated}
        </pre>
      </div>

      {/* Paste area */}
      <div className="space-y-2">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold text-foreground">AI summary output</h2>
          <p className="text-xs text-muted">
            Paste the AI&apos;s response here. Summary storage to Supabase is coming next.
          </p>
        </div>
        <textarea
          className={`${inputClass} w-full min-h-[200px] resize-y`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste the AI's response here..."
        />
      </div>

    </main>
  );
}
