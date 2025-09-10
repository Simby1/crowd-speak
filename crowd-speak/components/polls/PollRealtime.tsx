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
    if (!optionId) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      // This should be handled by page-level protection, but as a fallback:
      return;
    }

    // Atomic upsert (requires UNIQUE (poll_id, voter_id))
    const { error } = await supabase
      .from("votes")
      .upsert(
        { poll_id: poll.id, option_id: optionId, voter_id: user.id },
        { onConflict: "poll_id,voter_id" }
      );
    if (error) {
      console.error("Failed to record vote:", error);
      return;
    }

    setVoted(true);

    // Optional: refresh counts immediately for snappier UX
    try {
      const res = await fetch(`/polls/${poll.id}/counts`);
      setCounts(await res.json());
    } catch {}
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
      </CardHeader>
      <CardContent>
        {voted && <Notice message="Thank you for voting." />}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget as HTMLFormElement);
            await voteAction(fd);
          }}
          className="space-y-4"
        >
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
