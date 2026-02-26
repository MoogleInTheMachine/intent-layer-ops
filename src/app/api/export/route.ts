import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const user = await currentUser();
  if (!user) return new NextResponse("Not authenticated", { status: 401 });

  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", user.id)
    .single();

  if (profileErr || !profile) return new NextResponse("Profile not found", { status: 404 });

  const { data: entries, error } = await supabaseAdmin
    .from("diary_entries")
    .select("created_at, project, work_summary, decisions, blockers, next_steps, ai_tools, ai_roles, time_spent")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: true });

  if (error) return new NextResponse("DB error", { status: 500 });

  const md = `# Checkpoint Pack

## Diary Extract (${entries?.length ?? 0} entries)

${(entries ?? [])
  .map(
    (e) => `### ${new Date(e.created_at).toLocaleString()}${e.project ? ` • ${e.project}` : ""}

**Work summary**
${e.work_summary}

${e.decisions ? `**Decisions**\n${e.decisions}\n` : ""}${e.blockers ? `**Blockers**\n${e.blockers}\n` : ""}${e.next_steps ? `**Next steps**\n${e.next_steps}\n` : ""}${(e.ai_roles?.length || e.ai_tools?.length || e.time_spent)
        ? `**Meta**\n- Roles: ${(e.ai_roles ?? []).join(", ") || "—"}\n- Tools: ${(e.ai_tools ?? []).join(", ") || "—"}\n- Time: ${e.time_spent ?? "—"}\n`
        : ""}
`
  )
  .join("\n---\n\n")}

---

## AI Instructions (paste the diary extract + this)

1. Propose a slide outline (6–10 slides).
2. Draft slide titles + bullets.
3. Identify key decisions.
4. Identify blockers/risks.
5. Suggest evidence to include (screenshots, links, metrics).
6. Call out gaps/questions to verify.

Constraints:
- Be concise.
- Use only the diary extract.
- Do not invent details.
`;

  return new NextResponse(md, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}