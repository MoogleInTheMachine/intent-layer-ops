import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditEntryClient } from "@/app/logs/_components/edit-entry-client";

export default async function EditEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", user.id)
    .single();

  if (!profile) return notFound();

  const { data: entry } = await supabaseAdmin
    .from("diary_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", profile.id)
    .single();

  if (!entry) return notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-1">
        <Link
          href={`/logs/${entry.id}`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Back to entry
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit entry</h1>
        <p className="text-sm text-muted">
          Update this entry. Changes are saved when you click Update.
        </p>
      </div>
      <EditEntryClient entry={entry} />
    </main>
  );
}
