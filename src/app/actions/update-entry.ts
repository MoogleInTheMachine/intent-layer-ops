"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type UpdateEntryInput = {
  id: string;
  project?: string;
  work_summary: string;
  decisions?: string;
  blockers?: string;
  next_steps?: string;
  ai_tools?: string[];
  ai_roles?: string[];
  time_spent?: string;
};

export async function updateEntry(input: UpdateEntryInput) {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", user.id)
    .single();

  if (profileErr || !profile) throw new Error("Profile not found");

  const { error } = await supabaseAdmin
    .from("diary_entries")
    .update({
      project: input.project ?? null,
      work_summary: input.work_summary,
      decisions: input.decisions ?? null,
      blockers: input.blockers ?? null,
      next_steps: input.next_steps ?? null,
      ai_tools: input.ai_tools ?? [],
      ai_roles: input.ai_roles ?? [],
      time_spent: input.time_spent ?? null,
    })
    .eq("id", input.id)
    .eq("user_id", profile.id);

  if (error) throw error;

  return { ok: true };
}
