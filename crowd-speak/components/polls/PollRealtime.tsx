"use client";

import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SubmitButton } from "../ui/submit-button";
import Notice from "../ui/notice";

type Poll = {
  id: string;
  question: string;
  poll_options: { id: string; label: string }[];
};

type PollRealtimeProps = {
  poll: Poll;
  initialCounts: Record<string, number>;
  hasVoted: boolean;
};

export default function PollRealtime({ poll, initialCounts, hasVoted }: PollRealtimeProps) {
  const [counts, setCounts] = useState(initialCounts);
  const [voted, setVoted] = useState(hasVoted);
  const channelRef = useRef<RealtimeChannel>();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`poll_${poll.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `poll_id=eq.${poll.id}`,
        },
        (payload) => {
          // This is a simple refetch, could be optimized to increment/decrement
          // based on payload.old and payload.new
          fetch(`/polls/${poll.id}/counts`)
            .then((res) => res.json())
            .then((data) => setCounts(data));
        }
      )
      .subscribe();
    channelRef.current = channel;
    return () => {
      channel.unsubscribe();
    };
  }, [poll.id]);

  async function voteAction(formData: FormData) {
    const optionId = String(formData.get("option_id"));
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      // This should be handled by page-level protection, but as a fallback:
      return;
    }
    // Delete existing vote
    await supabase.from("votes").delete().eq("poll_id", poll.id).eq("voter_id", user.id);
    // Insert new vote
    await supabase.from("votes").insert({ poll_id: poll.id, option_id: optionId, voter_id: user.id });
    setVoted(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
      </CardHeader>
      <CardContent>
        {voted && <Notice message="Thank you for voting." />}
        <form action={voteAction} className="space-y-4">
          <input type="hidden" name="poll_id" value={poll.id} />
          <div className="grid gap-2">
            {(poll.poll_options || []).map((opt) => (
              <label key={opt.id} className="flex items-center gap-3">
                <input type="radio" name="option_id" value={opt.id} required />
                <span className="flex-1">{opt.label}</span>
                <span className="text-xs text-muted-foreground">{counts[opt.id] || 0} votes</span>
              </label>
            ))}
          </div>
          <SubmitButton type="submit">Vote</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
