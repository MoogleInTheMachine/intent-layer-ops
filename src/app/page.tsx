import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <main className="max-w-2xl mx-auto px-6 pt-20 pb-16 space-y-10">

          {/* Hero */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Work log
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Log your intent.<br />Ship with clarity.
            </h1>
            <p className="text-base text-muted leading-relaxed max-w-md">
              Intent Diary captures what you actually did each day — decisions,
              blockers, AI usage — and turns it into AI-ready checkpoint prompts
              for standups, reviews, and handoffs.
            </p>
          </div>

          {/* Primary CTA */}
          <Link
            href="/logs/new"
            className="inline-flex items-center gap-2 bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            + New entry
          </Link>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href="/logs"
              className="block border border-border rounded-xl p-4 hover:bg-surface transition-colors group"
            >
              <div className="text-sm font-semibold group-hover:text-accent transition-colors">
                Past entries
              </div>
              <div className="text-xs text-muted mt-1">
                Browse and review your work log
              </div>
            </Link>
            <Link
              href="/summaries/new"
              className="block border border-border rounded-xl p-4 hover:bg-surface transition-colors group"
            >
              <div className="text-sm font-semibold group-hover:text-accent transition-colors">
                Generate summary
              </div>
              <div className="text-xs text-muted mt-1">
                Build a weekly or monthly AI prompt
              </div>
            </Link>
            <Link
              href="/export"
              className="block border border-border rounded-xl p-4 hover:bg-surface transition-colors group"
            >
              <div className="text-sm font-semibold group-hover:text-accent transition-colors">
                Checkpoint export
              </div>
              <div className="text-xs text-muted mt-1">
                Copy a Markdown pack for handoffs
              </div>
            </Link>
          </div>

        </main>
      </SignedIn>
    </>
  );
}
