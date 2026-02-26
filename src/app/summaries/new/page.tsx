"use client";

import { useMemo, useState } from "react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewSummaryPage() {
  const [start, setStart] = useState(todayISO());
  const [end, setEnd] = useState(todayISO());
  const [prompt, setPrompt] = useState("");

  const generated = useMemo(() => {
    const p = `You are helping me prepare a checkpoint update.

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
    return p;
  }, [start, end]);

  return (
    <main className="p-6 space-y-4 max-w-3xl">
      <h1 className="text-xl font-semibold">Weekly / Monthly summary prompt</h1>

      <div className="flex gap-4">
        <label className="text-sm">
          Start
          <input className="block border rounded p-2" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="text-sm">
          End
          <input className="block border rounded p-2" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Generated prompt</h2>
          <button
            className="border rounded px-3 py-2 text-sm"
            onClick={() => {
              navigator.clipboard.writeText(generated);
            }}
          >
            Copy
          </button>
        </div>
        <pre className="border rounded p-3 text-sm whitespace-pre-wrap">{generated}</pre>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Paste AI summary here (stored later)</h2>
        <textarea
          className="w-full border rounded p-2 min-h-[160px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste the AI output here (we’ll store it in the DB next)."
        />
      </div>
    </main>
  );
}