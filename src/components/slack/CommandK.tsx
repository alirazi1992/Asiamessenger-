"use client";
import { useEffect, useState } from "react";

export default function CommandK() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 grid place-items-start pt-24">
      <div className="mx-auto w-full max-w-xl rounded-lg bg-neutral-950 border border-neutral-800">
        <input
          autoFocus
          placeholder="Jump to channel or DM…"
          className="w-full bg-neutral-900 px-4 py-3 rounded-t-lg outline-none"
        />
        <div className="max-h-80 overflow-auto p-2 text-sm">
          <div className="px-2 py-1 hover:bg-neutral-900 rounded">
            # general
          </div>
          <div className="px-2 py-1 hover:bg-neutral-900 rounded"># dev</div>
          <div className="px-2 py-1 hover:bg-neutral-900 rounded">@ Sara</div>
        </div>
        <div className="p-2 text-right text-xs opacity-60">
          Press Esc to close
        </div>
      </div>
    </div>
  );
}
