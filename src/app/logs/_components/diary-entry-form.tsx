"use client";

import { useState } from "react";

const ROLE_OPTIONS = ["Strategist", "Architect", "Implementer", "Synthesizer", "Project Manager"] as const;
const TOOL_OPTIONS = ["GPT", "Claude", "Copilot", "Gemini", "Other"] as const;

const inputClass =
  "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background " +
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent " +
  "placeholder:text-muted transition-shadow";

type EntryFormData = {
  project?: string;
  work_summary: string;
  decisions?: string;
  blockers?: string;
  next_steps?: string;
  ai_roles?: string[];
  ai_tools?: string[];
  time_spent?: string;
};

type DiaryEntryFormProps = {
  initialValues?: {
    project?: string;
    work_summary: string;
    decisions?: string;
    blockers?: string;
    next_steps?: string;
    time_spent?: string;
    ai_roles?: string[];
    ai_tools?: string[];
  };
  onSubmit: (data: EntryFormData) => Promise<{ ok: boolean }>;
  submitLabel?: string;
  successMessage?: string;
};

export function DiaryEntryForm({
  initialValues,
  onSubmit,
  submitLabel = "Save entry",
  successMessage = "Saved.",
}: DiaryEntryFormProps) {
  const [project, setProject] = useState(initialValues?.project ?? "");
  const [workSummary, setWorkSummary] = useState(initialValues?.work_summary ?? "");
  const [decisions, setDecisions] = useState(initialValues?.decisions ?? "");
  const [blockers, setBlockers] = useState(initialValues?.blockers ?? "");
  const [nextSteps, setNextSteps] = useState(initialValues?.next_steps ?? "");
  const [timeSpent, setTimeSpent] = useState(initialValues?.time_spent ?? "");
  const [aiRoles, setAiRoles] = useState<string[]>(initialValues?.ai_roles ?? []);
  const [aiTools, setAiTools] = useState<string[]>(initialValues?.ai_tools ?? []);
  const [status, setStatus] = useState<string | null>(null);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving...");

    try {
      await onSubmit({
        project: project.trim() || undefined,
        work_summary: workSummary,
        decisions: decisions.trim() || undefined,
        blockers: blockers.trim() || undefined,
        next_steps: nextSteps.trim() || undefined,
        ai_roles: aiRoles,
        ai_tools: aiTools,
        time_spent: timeSpent.trim() || undefined,
      });

      // Only reset fields for new entries (no initialValues)
      if (!initialValues) {
        setProject("");
        setWorkSummary("");
        setDecisions("");
        setBlockers("");
        setNextSteps("");
        setTimeSpent("");
        setAiRoles([]);
        setAiTools([]);
      }
      setStatus(successMessage);
    } catch (err: any) {
      setStatus(err?.message ?? "Error saving.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Project */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          Project / Module{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          className={inputClass}
          placeholder="e.g. intent-layer-ops, whisperpad, semantic-click"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <p className="text-xs text-muted">
          Tag this entry to a project so summaries can be filtered by scope.
        </p>
      </div>

      {/* What I did */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          What I did
        </label>
        <textarea
          className={`${inputClass} min-h-[140px] resize-y`}
          placeholder={"- Built the export API endpoint\n- Refactored auth middleware\n- Fixed date parsing bug"}
          value={workSummary}
          onChange={(e) => setWorkSummary(e.target.value)}
          required
        />
        <p className="text-xs text-muted">
          Use bullet points. Include concrete outputs — files created, PRs merged, systems changed.
        </p>
      </div>

      {/* Decisions */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          Decisions{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          className={`${inputClass} min-h-[90px] resize-y`}
          placeholder={"- Chose Supabase RLS over custom middleware\n- Deferred auth until MVP ships"}
          value={decisions}
          onChange={(e) => setDecisions(e.target.value)}
        />
        <p className="text-xs text-muted">
          Record architectural choices or trade-offs made today. Even small decisions compound over time.
        </p>
      </div>

      {/* Blockers */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          Blockers / risks{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          className={`${inputClass} min-h-[90px] resize-y`}
          placeholder={"- Waiting on Clerk webhook fix\n- Risk: DB schema not validated against prod yet"}
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
        />
        <p className="text-xs text-muted">
          Anything slowing you down or creating future risk. This surfaces in your AI checkpoint prompts.
        </p>
      </div>

      {/* Next steps */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          Next steps{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          className={`${inputClass} min-h-[90px] resize-y`}
          placeholder={"- Wire up summary storage to Supabase\n- Add entry detail view\n- Write export tests"}
          value={nextSteps}
          onChange={(e) => setNextSteps(e.target.value)}
        />
        <p className="text-xs text-muted">
          What's immediately next? These become your starting context in tomorrow's entry.
        </p>
      </div>

      {/* Time spent */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          Time spent{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          className={`${inputClass} max-w-[160px]`}
          placeholder="e.g. 2h or 90m"
          value={timeSpent}
          onChange={(e) => setTimeSpent(e.target.value)}
        />
        <p className="text-xs text-muted">
          Rough estimate is fine. Used to calculate weekly effort in summaries.
        </p>
      </div>

      {/* AI roles */}
      <div className="space-y-2">
        <div className="space-y-0.5">
          <div className="text-sm font-medium text-foreground">
            AI roles used{" "}
            <span className="text-muted font-normal">(optional)</span>
          </div>
          <p className="text-xs text-muted">
            How did AI assist? Select all that applied to today's session.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((r) => (
            <label
              key={r}
              className={`cursor-pointer select-none text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                aiRoles.includes(r)
                  ? "bg-accent text-white border-accent"
                  : "border-border text-muted hover:border-accent hover:text-foreground"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={aiRoles.includes(r)}
                onChange={() => toggle(aiRoles, r, setAiRoles)}
              />
              {r}
            </label>
          ))}
        </div>
      </div>

      {/* AI tools */}
      <div className="space-y-2">
        <div className="space-y-0.5">
          <div className="text-sm font-medium text-foreground">
            AI tools used{" "}
            <span className="text-muted font-normal">(optional)</span>
          </div>
          <p className="text-xs text-muted">
            Which tools were active during this work session?
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TOOL_OPTIONS.map((t) => (
            <label
              key={t}
              className={`cursor-pointer select-none text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                aiTools.includes(t)
                  ? "bg-accent text-white border-accent"
                  : "border-border text-muted hover:border-accent hover:text-foreground"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={aiTools.includes(t)}
                onChange={() => toggle(aiTools, t, setAiTools)}
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          className="bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          {submitLabel}
        </button>
        {status && (
          <p className={`text-sm font-medium ${
            status === successMessage ? "text-success" : "text-muted"
          }`}>
            {status}
          </p>
        )}
      </div>

    </form>
  );
}
