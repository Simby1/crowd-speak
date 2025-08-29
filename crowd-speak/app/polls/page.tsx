import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Notice from "@/components/ui/notice";

async function deletePollAction(formData: FormData) {
  "use server";
  const pollId = String(formData.get("poll_id"));
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  await supabase.from("polls").delete().eq("id", pollId).eq("author_id", user.id);
  redirect("/polls");
}

export default async function PollsListPage({ searchParams }: { searchParams?: { success?: string } }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: polls } = await supabase
    .from("polls")
    .select("id, question, created_at, author_id")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Polls</h1>
      {searchParams?.success === "created" && <Notice message="Poll created successfully." />}
      <div className="grid gap-4">
        {(polls || []).map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-base">{p.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Link className="underline text-sm" href={`/polls/${p.id}`}>View</Link>
                {user?.id === p.author_id && (
                  <>
                    <Link className="underline text-sm" href={`/polls/${p.id}/edit`}>Edit</Link>
                    <form action={deletePollAction}>
                      <input type="hidden" name="poll_id" value={p.id} />
                      <button className="text-sm underline text-red-600" type="submit">Delete</button>
                    </form>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {(!polls || polls.length === 0) && (
          <p className="text-sm text-muted-foreground">No polls yet.</p>
        )}
      </div>
    </main>
  );
}


