import { createServerSupabase } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";

async function signUpAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/polls");
}

export default function RegisterPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signUpAction} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>
            {searchParams?.error ? (
              <p className="text-sm text-red-600">{searchParams.error}</p>
            ) : null}
            <SubmitButton type="submit">Create account</SubmitButton>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account? <Link className="underline" href="/login">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}


