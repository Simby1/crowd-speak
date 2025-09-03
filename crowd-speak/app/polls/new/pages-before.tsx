import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import NewPollOptions from "@/components/polls/NewPollOptions";

async function createPollAction(formData: FormData) {
  "use server";
  const question = String(formData.get("question") || "").trim();
  const optionValues = formData.getAll("options[]").map((v) => String(v).trim()).filter((v) => v.length > 0);
  const uniqueOptions = Array.from(new Set(optionValues));
  if (!question || uniqueOptions.length < 2) {
    redirect(`/polls/new?error=${encodeURIComponent("Enter a question and at least two options.")}`);
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert({ question, author_id: user.id })
    .select("id")
    .single();

  if (pollError || !poll) {
    redirect(`/polls/new?error=${encodeURIComponent(pollError?.message || "Could not create poll.")}`);
  }

  const optionsPayload = uniqueOptions.map((label) => ({ poll_id: poll.id, label }));
  const { error: optionsError } = await supabase.from("poll_options").insert(optionsPayload);
  if (optionsError) {
    redirect(`/polls/new?error=${encodeURIComponent(optionsError.message)}`);
  }

  revalidatePath("/polls");
  redirect(`/polls?success=created`);
}

export default async function NewPollPage({ searchParams }: { searchParams?: { error?: string } }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create a new poll</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPollAction} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Input id="question" name="question" placeholder="What should we decide?" required />
            </div>
            <div className="grid gap-2">
              <Label>Options</Label>
              <NewPollOptions />
            </div>
            {searchParams?.error ? (
              <p className="text-sm text-red-600">{searchParams.error}</p>
            ) : null}
            <SubmitButton type="submit">Create</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}


