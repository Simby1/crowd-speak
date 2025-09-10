import PollRealtime from "@/components/polls/PollRealtime";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type PollPageProps = { params: { id: string } };

export default async function PollDetailPage({
  params,
  searchParams,
}: PollPageProps & { searchParams?: { voted?: string } }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: poll } = await supabase
    .from("polls")
    .select("id, question, poll_options(id,label)")
    .eq("id", params.id)
    .single();

  if (!poll) {
    redirect("/polls");
  }

  const { data: votes } = await supabase.from("votes").select("option_id").eq("poll_id", poll.id);

  const counts: Record<string, number> = {};
  (votes || []).forEach((v) => {
    counts[v.option_id] = (counts[v.option_id] || 0) + 1;
  });

  const hasVoted = user
    ? (await supabase.from("votes").select("id").eq("poll_id", poll.id).eq("voter_id", user.id).single()).data != null
    : false;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <PollRealtime poll={poll} initialCounts={counts} hasVoted={hasVoted || !!searchParams?.voted} />
    </main>
  );
}


