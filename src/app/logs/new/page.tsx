"use client";

import { DiaryEntryForm } from "@/app/logs/_components/diary-entry-form";
import { createEntry } from "@/app/actions/create-entry";

export default function NewLogPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">New entry</h1>
        <p className="text-sm text-muted">
          Capture what you actually did. Be specific — this feeds your AI summaries
          and checkpoint exports.
        </p>
      </div>
      <DiaryEntryForm
        onSubmit={createEntry}
        submitLabel="Save entry"
        successMessage="Saved."
      />
    </main>
  );
}
