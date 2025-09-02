import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Notice from "@/components/ui/notice";
import DeletePollButton from "@/components/polls/DeletePollButton";

export async function deletePollAction(formData: FormData) {
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
    <main className="container mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Polls</h1>
        <p className="text-gray-400">Create and manage your polls</p>
      </div>
      {searchParams?.success === "created" && <Notice message="Poll created successfully." />}
      <div className="grid gap-6">
        {(polls || []).map((p) => (
          <Card key={p.id} className="group hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg group-hover:text-cyan-400 transition-colors duration-300">
                {p.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Link 
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200" 
                  href={`/polls/${p.id}`}
                >
                  View
                </Link>
                {user?.id === p.author_id && (
                  <>
                    <Link 
                      className="text-gray-400 hover:text-gray-300 font-medium transition-colors duration-200" 
                      href={`/polls/${p.id}/edit`}
                    >
                      Edit
                    </Link>
                    <DeletePollButton pollId={p.id} deletePollAction={deletePollAction} />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {(!polls || polls.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No polls yet.</p>
            <p className="text-gray-500 text-sm mt-2">Create your first poll to get started.</p>
          </div>
        )}
      </div>
    </main>
  );
}


