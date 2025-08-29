import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Notice from "@/components/ui/notice";

type PollPageProps = { params: { id: string } };

async function voteAction(formData: FormData) {
  "use server";
  const pollId = String(formData.get("poll_id"));
  const optionId = String(formData.get("option_id"));
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=/polls/${pollId}`);
  }
  // Replace any existing vote (delete old, insert new)
  await supabase.from("votes").delete().eq("poll_id", pollId).eq("voter_id", user.id);
  await supabase.from("votes").insert({ poll_id: pollId, option_id: optionId, voter_id: user.id });
  redirect(`/polls/${pollId}?voted=1`);
}

export default async function PollDetailPage({ params, searchParams }: PollPageProps & { searchParams?: { voted?: string } }) {
  const supabase = await createServerSupabase();
  const { data: poll } = await supabase
    .from("polls")
    .select("id, question, poll_options(id,label), votes:votes(id, option_id)")
    .eq("id", params.id)
    .single();

  if (!poll) {
    redirect("/polls");
  }

  const counts = new Map<string, number>();
  (poll.votes || []).forEach((v: any) => {
    counts.set(v.option_id, (counts.get(v.option_id) || 0) + 1);
  });

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
        </CardHeader>
        <CardContent>
          {searchParams?.voted && <Notice message="Thank you for voting." />}
          <form action={voteAction} className="space-y-4">
            <input type="hidden" name="poll_id" value={poll.id} />
            <div className="grid gap-2">
              {(poll.poll_options || []).map((opt: any) => (
                <label key={opt.id} className="flex items-center gap-3">
                  <input type="radio" name="option_id" value={opt.id} required />
                  <span className="flex-1">{opt.label}</span>
                  <span className="text-xs text-muted-foreground">{counts.get(opt.id) || 0} votes</span>
                </label>
              ))}
            </div>
            <SubmitButton type="submit">Vote</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}


