"use client";
import { useState } from "react";
import {
  Search,
  ChevronDown,
  Users,
  Bell,
  PanelRightClose,
} from "lucide-react";

export default function Header({
  onToggleProfile,
}: {
  onToggleProfile: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-14 border-b bg-[var(--panel)] flex items-center gap-3 px-3">
      <button
        className="px-2 py-1 rounded bg-[var(--panel-2)] hover:bg-black/40 text-[var(--text)] flex items-center gap-1"
        onClick={() => setOpen((o) => !o)}
      >
        Jolly Roger <ChevronDown className="w-4 h-4 opacity-70" />
      </button>

      <div className="flex-1 max-w-[620px] ml-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            className="w-full h-9 rounded bg-[var(--panel-2)] pl-9 pr-3 outline-none text-sm placeholder:text-[var(--text-dim)]"
            placeholder="Search messages, files, people…"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="h-9 w-9 rounded-full bg-[var(--panel-2)] grid place-items-center">
          <Users className="w-4 h-4" />
        </button>
        <button className="h-9 w-9 rounded-full bg-[var(--panel-2)] grid place-items-center">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex -space-x-2 mx-1">
          {["/a.png", "/b.png", "/c.png"].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-8 h-8 rounded-full border border-[var(--border)]"
            />
          ))}
        </div>

        <button
          onClick={onToggleProfile}
          className="h-9 px-3 rounded bg-[var(--panel-2)] hover:bg-black/40 text-sm flex items-center gap-2"
          title="Toggle profile"
        >
          <PanelRightClose className="w-4 h-4" /> Profile
        </button>
      </div>
    </header>
  );
}
