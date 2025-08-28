import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold">CrowdSpeak</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/polls">Polls</Link>
          <Link href="/polls/new">New Poll</Link>
          <Link href="/auth/sign-in">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}

export default Nav;


