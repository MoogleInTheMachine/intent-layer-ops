"use client";

import { DiaryEntryForm } from "./diary-entry-form";
import { updateEntry } from "@/app/actions/update-entry";

type Entry = {
  id: string;
  project?: string | null;
  work_summary: string;
  decisions?: string | null;
  blockers?: string | null;
  next_steps?: string | null;
  time_spent?: string | null;
  ai_roles?: string[];
  ai_tools?: string[];
};

export function EditEntryClient({ entry }: { entry: Entry }) {
  async function handleSubmit(data: any) {
    return updateEntry({ id: entry.id, ...data });
  }

  return (
    <DiaryEntryForm
      initialValues={{
        project: entry.project ?? "",
        work_summary: entry.work_summary,
        decisions: entry.decisions ?? "",
        blockers: entry.blockers ?? "",
        next_steps: entry.next_steps ?? "",
        time_spent: entry.time_spent ?? "",
        ai_roles: entry.ai_roles ?? [],
        ai_tools: entry.ai_tools ?? [],
      }}
      onSubmit={handleSubmit}
      submitLabel="Update entry"
      successMessage="Updated."
    />
  );
}
