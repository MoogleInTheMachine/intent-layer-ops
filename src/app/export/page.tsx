"use client";

import { useEffect, useState } from "react";

export default function ExportPage() {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/export");
      const text = await res.text();
      setMarkdown(text);
      setLoading(false);
    })();
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Checkpoint export</h1>
        <p className="text-sm text-muted">
          Your full work log rendered as Markdown — ready to paste into a
          checkpoint deck, Notion doc, or handoff brief.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          disabled={loading}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 ${
            copied
              ? "border-success text-success"
              : "border-border text-muted hover:border-accent hover:text-foreground"
          }`}
        >
          {copied ? "Copied!" : "Copy Markdown"}
        </button>
      </div>

      {/* Markdown viewer */}
      <div className="border border-border rounded-xl bg-surface overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted">
            Loading export...
          </div>
        ) : (
          <pre className="p-5 text-sm whitespace-pre-wrap leading-relaxed font-mono text-foreground overflow-x-auto">
            {markdown}
          </pre>
        )}
      </div>

    </main>
  );
}
