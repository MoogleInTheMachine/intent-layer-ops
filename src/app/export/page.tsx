"use client";

import { useEffect, useState } from "react";

export default function ExportPage() {
  const [markdown, setMarkdown] = useState<string>("Loading...");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/export");
      const text = await res.text();
      setMarkdown(text);
    })();
  }, []);

  return (
    <main className="p-6 space-y-4 max-w-3xl">
      <h1 className="text-xl font-semibold">Checkpoint Export</h1>

      <div className="flex justify-end">
        <button
          className="border rounded px-3 py-2 text-sm"
          onClick={async () => {
            await navigator.clipboard.writeText(markdown);
          }}
        >
          Copy Markdown
        </button>
      </div>

      <pre className="border rounded p-3 text-sm whitespace-pre-wrap">
        {markdown}
      </pre>
    </main>
  );
}