import type { Metadata } from "next";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intent Diary",
  description: "Log your work. Generate AI-ready checkpoints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-background text-foreground">
          <SignedIn>
            <header className="border-b border-border px-6 py-3 flex items-center justify-between">
              <Link
                href="/"
                className="text-sm font-semibold tracking-tight text-foreground hover:text-accent transition-colors"
              >
                Intent Diary
              </Link>
              <nav className="flex items-center gap-6">
                <Link href="/logs/new" className="text-sm text-muted hover:text-foreground transition-colors">
                  New entry
                </Link>
                <Link href="/logs" className="text-sm text-muted hover:text-foreground transition-colors">
                  Entries
                </Link>
                <Link href="/summaries/new" className="text-sm text-muted hover:text-foreground transition-colors">
                  Summary
                </Link>
                <Link href="/export" className="text-sm text-muted hover:text-foreground transition-colors">
                  Export
                </Link>
                <UserButton />
              </nav>
            </header>
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
