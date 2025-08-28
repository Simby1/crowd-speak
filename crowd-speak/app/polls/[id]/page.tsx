import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PollPageProps = { params: { id: string } };

export default function PollDetailPage({ params }: PollPageProps) {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Poll {params.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This is a placeholder for the poll details.</p>
        </CardContent>
      </Card>
    </main>
  );
}


