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
    <main className="p-6 space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Entries</h1>
        <Link className="text-sm underline" href="/logs/new">
          New entry
        </Link>
      </div>

      <div className="space-y-3">
        {(entries ?? []).map((e) => (
          <div key={e.id} className="border rounded p-3">
            <div className="text-sm text-gray-600">
              {new Date(e.created_at).toLocaleString()}
              {e.project ? ` • ${e.project}` : ""}
            </div>
            <pre className="whitespace-pre-wrap text-sm mt-2">{e.work_summary}</pre>
          </div>
        ))}
        {(!entries || entries.length === 0) && (
          <p className="text-sm text-gray-600">No entries yet.</p>
        )}
      </div>
    </main>
  );
}