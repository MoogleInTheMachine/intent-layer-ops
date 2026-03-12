"use client";

import { useRouter } from "next/navigation";
import { deleteEntry } from "@/app/actions/delete-entry";

export function DeleteButton({ entryId }: { entryId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    await deleteEntry(entryId);
    router.push("/logs");
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm font-medium border border-border rounded-lg px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
    >
      Delete
    </button>
  );
}
