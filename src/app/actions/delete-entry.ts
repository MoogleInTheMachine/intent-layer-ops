"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function deleteEntry(id: string) {
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
    .delete()
    .eq("id", id)
    .eq("user_id", profile.id);

  if (error) throw error;

  return { ok: true };
}
