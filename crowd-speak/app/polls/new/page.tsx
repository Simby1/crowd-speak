import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function NewPollPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create a new poll</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Input id="question" placeholder="What should we decide?" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="options">Options</Label>
              <textarea id="options" className="border rounded px-3 py-2" placeholder="One option per line" rows={5} />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}


