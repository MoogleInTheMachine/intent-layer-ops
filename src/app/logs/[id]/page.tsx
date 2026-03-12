import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DeleteButton } from "@/app/logs/_components/delete-button";

export default async function EntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/logs"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Back to entries
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/logs/${entry.id}/edit`}
            className="text-sm font-medium border border-border rounded-lg px-4 py-2 hover:bg-surface transition-colors"
          >
            Edit
          </Link>
          <DeleteButton entryId={entry.id} />
        </div>
      </div>

      {/* Date & project */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>
            {new Date(entry.created_at).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {entry.project && (
            <>
              <span>·</span>
              <span className="bg-accent-light text-accent font-medium px-2 py-0.5 rounded-full text-xs">
                {entry.project}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-6">

        <Section title="What I did">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
            {entry.work_summary}
          </pre>
        </Section>

        {entry.decisions && (
          <Section title="Decisions">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
              {entry.decisions}
            </pre>
          </Section>
        )}

        {entry.blockers && (
          <Section title="Blockers / risks">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
              {entry.blockers}
            </pre>
          </Section>
        )}

        {entry.next_steps && (
          <Section title="Next steps">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
              {entry.next_steps}
            </pre>
          </Section>
        )}

        {/* Meta */}
        {(entry.ai_roles?.length > 0 || entry.ai_tools?.length > 0 || entry.time_spent) && (
          <div className="border-t border-border pt-5 space-y-2">
            {entry.ai_roles?.length > 0 && (
              <MetaRow label="AI roles" value={entry.ai_roles.join(", ")} />
            )}
            {entry.ai_tools?.length > 0 && (
              <MetaRow label="AI tools" value={entry.ai_tools.join(", ")} />
            )}
            {entry.time_spent && (
              <MetaRow label="Time spent" value={entry.time_spent} />
            )}
          </div>
        )}
      </div>

    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="text-muted font-medium">{label}:</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
