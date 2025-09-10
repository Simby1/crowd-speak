import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!params?.id || typeof params.id !== "string" || params.id.trim() === "") {
    return NextResponse.json({ error: "Missing or invalid poll id." }, { status: 400 });
  }
  try {
    const supabase = await createServerSupabase();
    const { data: votes, error, status } = await supabase
      .from("votes")
      .select("option_id")
      .eq("poll_id", params.id);
    if (error || status !== 200) {
      console.error("Supabase error:", error?.message || error);
      return NextResponse.json(
        { error: error?.message ? `Database error: ${error.message}` : "Failed to fetch poll votes." },
        { status: 500 }
      );
    }
    const counts: Record<string, number> = {};
    (votes || []).forEach((v) => {
      counts[v.option_id] = (counts[v.option_id] || 0) + 1;
    });
    return NextResponse.json(counts, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error:", err?.message || err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
