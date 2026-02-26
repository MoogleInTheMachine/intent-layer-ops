import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <main className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Intent Diary</h1>
            <UserButton />
          </div>

          <ul className="list-disc pl-6 text-sm space-y-1">
            <li><Link href="/logs/new">New entry</Link></li>
            <li><Link href="/logs">Entries</Link></li>
            <li><Link href="/summaries/new">Weekly/Monthly summary</Link></li>
            <li><Link href="/export">Checkpoint export</Link></li>
          </ul>
        </main>
      </SignedIn>
    </>
  );
}