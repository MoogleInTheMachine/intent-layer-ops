import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";

export default async function LogsPage() {
  const user = await currentUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", user.id)
    .single();

  const profileId = profile?.id;

  const { data: entries } = profileId
    ? await supabaseAdmin
        .from("diary_entries")
        .select("id, created_at, project, work_summary")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: [] as any[] };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

      {/* Page header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Work log</h1>
          <Link
            href="/logs/new"
            className="text-sm font-medium border border-border rounded-lg px-4 py-2 hover:bg-surface transition-colors"
          >
            + New entry
          </Link>
        </div>
        <p className="text-sm text-muted">
          Your 50 most recent entries, newest first.
        </p>
      </div>

      {/* Entry list */}
      <div className="space-y-3">
        {(entries ?? []).map((e) => (
          <Link
            key={e.id}
            href={`/logs/${e.id}`}
            className="block border border-border rounded-xl p-5 bg-background hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-2 text-xs text-muted mb-3">
              <span>
                {new Date(e.created_at).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {e.project && (
                <>
                  <span>·</span>
                  <span className="bg-accent-light text-accent font-medium px-2 py-0.5 rounded-full">
                    {e.project}
                  </span>
                </>
              )}
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground line-clamp-4">
              {e.work_summary}
            </pre>
          </Link>
        ))}

        {(!entries || entries.length === 0) && (
          <div className="text-center py-16 space-y-3">
            <p className="text-sm text-muted">No entries yet.</p>
            <Link
              href="/logs/new"
              className="inline-block text-sm font-medium text-accent hover:underline"
            >
              Log your first work entry
            </Link>
          </div>
        )}
      </div>

    </main>
  );
}
