"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type CreateEntryInput = {
  project?: string;
  work_summary: string;
  decisions?: string;
  blockers?: string;
  next_steps?: string;
  ai_tools?: string[];
  ai_roles?: string[];
  time_spent?: string;
};

export async function createEntry(input: CreateEntryInput) {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  // Ensure profile exists
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .upsert(
      { clerk_user_id: user.id, email: user.emailAddresses[0]?.emailAddress },
      { onConflict: "clerk_user_id" }
    )
    .select("id")
    .single();

  if (profileErr) throw profileErr;

  const { error } = await supabaseAdmin.from("diary_entries").insert({
    user_id: profile.id,
    project: input.project ?? null,
    work_summary: input.work_summary,
    decisions: input.decisions ?? null,
    blockers: input.blockers ?? null,
    next_steps: input.next_steps ?? null,
    ai_tools: input.ai_tools ?? [],
    ai_roles: input.ai_roles ?? [],
    time_spent: input.time_spent ?? null,
  });

  if (error) throw error;

  return { ok: true };
}