import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PollsListPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Polls</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Example Poll</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">A placeholder poll item</p>
            <Link className="underline text-sm" href="/polls/1">View</Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


