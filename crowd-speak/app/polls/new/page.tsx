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

  // Parse and validate input early
  const rawQuestion = formData.get("question");
  const question = typeof rawQuestion === "string" ? rawQuestion.trim() : "";

  // Build unique, non-empty options while preserving order
  const seen = new Set<string>();
  const uniqueOptions: string[] = [];
  for (const value of formData.getAll("options[]")) {
    const option = String(value).trim();
    if (option.length === 0) continue;
    if (seen.has(option)) continue;
    seen.add(option);
    uniqueOptions.push(option);
  }

  if (!question || uniqueOptions.length < 2) {
    const msg = encodeURIComponent("Enter a question and at least two options.");
    redirect(`/polls/new?error=${msg}`);
  }

  // Auth and DB actions
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
    const msg = encodeURIComponent(pollError?.message || "Could not create poll.");
    redirect(`/polls/new?error=${msg}`);
  }

  const optionsPayload = uniqueOptions.map((label) => ({ poll_id: poll.id, label }));
  const { error: optionsError } = await supabase.from("poll_options").insert(optionsPayload);
  if (optionsError) {
    const msg = encodeURIComponent(optionsError.message);
    redirect(`/polls/new?error=${msg}`);
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


