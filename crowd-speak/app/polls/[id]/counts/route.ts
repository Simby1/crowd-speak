import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabase();
  const { data: votes } = await supabase.from("votes").select("option_id").eq("poll_id", params.id);
  const counts: Record<string, number> = {};
  (votes || []).forEach((v) => {
    counts[v.option_id] = (counts[v.option_id] || 0) + 1;
  });
  return NextResponse.json(counts);
}
