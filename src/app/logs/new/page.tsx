"use client";

import { useState } from "react";
import { createEntry } from "@/app/actions/create-entry";

const ROLE_OPTIONS = ["Strategist", "Architect", "Implementer", "Synthesizer", "Project Manager"] as const;
const TOOL_OPTIONS = ["GPT", "Claude", "Copilot", "Gemini", "Other"] as const;

export default function NewLogPage() {
  const [project, setProject] = useState("");
  const [workSummary, setWorkSummary] = useState("");
  const [decisions, setDecisions] = useState("");
  const [blockers, setBlockers] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [timeSpent, setTimeSpent] = useState<string>("");
  const [aiRoles, setAiRoles] = useState<string[]>([]);
  const [aiTools, setAiTools] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving...");

    try {
      await createEntry({
        project: project.trim() || undefined,
        work_summary: workSummary,
        decisions: decisions.trim() || undefined,
        blockers: blockers.trim() || undefined,
        next_steps: nextSteps.trim() || undefined,
        ai_roles: aiRoles,
        ai_tools: aiTools,
        time_spent: timeSpent.trim() || undefined,
      });

      setProject("");
      setWorkSummary("");
      setDecisions("");
      setBlockers("");
      setNextSteps("");
      setTimeSpent("");
      setAiRoles([]);
      setAiTools([]);
      setStatus("Saved.");
    } catch (err: any) {
      setStatus(err?.message ?? "Error saving.");
    }
  }

  return (
    <main className="p-6 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">New diary entry</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          Project / Module (optional)
          <input
            className="mt-1 w-full border rounded p-2"
            placeholder="intent layer / ops tool / whisperpad / semantic click"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium">
          What I did (required, bullets)
          <textarea
            className="mt-1 w-full border rounded p-2 min-h-[140px]"
            placeholder="- Bullet 1&#10;- Bullet 2"
            value={workSummary}
            onChange={(e) => setWorkSummary(e.target.value)}
            required
          />
        </label>

        <label className="block text-sm font-medium">
          Decisions (optional)
          <textarea
            className="mt-1 w-full border rounded p-2 min-h-[90px]"
            placeholder="- Decision 1&#10;- Decision 2"
            value={decisions}
            onChange={(e) => setDecisions(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium">
          Blockers / risks (optional)
          <textarea
            className="mt-1 w-full border rounded p-2 min-h-[90px]"
            placeholder="- Blocker 1&#10;- Risk 2"
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium">
          Next steps (optional)
          <textarea
            className="mt-1 w-full border rounded p-2 min-h-[90px]"
            placeholder="- Next step 1&#10;- Next step 2"
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium">
          Time spent (optional)
          <input
            className="mt-1 w-full border rounded p-2"
            placeholder="e.g. 1.5h or 90m"
            value={timeSpent}
            onChange={(e) => setTimeSpent(e.target.value)}
          />
        </label>

        <div className="space-y-2">
          <div className="text-sm font-medium">AI roles used (optional)</div>
          <div className="flex flex-wrap gap-3">
            {ROLE_OPTIONS.map((r) => (
              <label key={r} className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aiRoles.includes(r)}
                  onChange={() => toggle(aiRoles, r, setAiRoles)}
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">AI tools used (optional)</div>
          <div className="flex flex-wrap gap-3">
            {TOOL_OPTIONS.map((t) => (
              <label key={t} className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={aiTools.includes(t)}
                  onChange={() => toggle(aiTools, t, setAiTools)}
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <button className="border rounded px-3 py-2 text-sm" type="submit">
          Save entry
        </button>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </main>
  );
}