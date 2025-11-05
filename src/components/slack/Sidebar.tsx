"use client";
import Link from "next/link";
import {
  Hash,
  AtSign,
  Plus,
  FileText,
  Inbox,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

function Row({
  href,
  icon: Icon,
  label,
  active,
  badge,
}: {
  href: string;
  icon: LucideIcon; // ✅ precise type
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-2 py-1.5 rounded hover:bg-black/30 ${
        active ? "bg-black/40 text-white" : "text-[var(--text)]/90"
      }`}
    >
      <span className="flex items-center gap-2">
        <Icon className="w-4 h-4 opacity-70" />
        {label}
      </span>
      {badge ? (
        <span className="min-w-5 h-5 px-1 rounded-full bg-[var(--accent)] text-xs grid place-items-center text-black font-semibold">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export default function Sidebar({ workspaceSlug }: { workspaceSlug: string }) {
  const ws = `/${workspaceSlug}`;

  return (
    <div className="h-full flex flex-col min-h-0 text-[var(--text)]">
      <div className="px-3 py-3 flex items-center justify-between border-b">
        <div className="font-semibold">{workspaceSlug.toUpperCase()}</div>
        <button className="text-sm px-2 py-1 rounded bg-black/40 hover:bg-black/60">
          Create New
        </button>
      </div>

      <div className="overflow-auto p-2 space-y-4">
        <div>
          <div className="px-2 text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2">
            Quick access
          </div>
          <div className="space-y-1">
            <Row href={`${ws}/threads`} icon={MessageCircle} label="Threads" />
            <Row
              href={`${ws}/mentions`}
              icon={AtSign}
              label="Mentions & reactions"
              badge={2}
            />
            <Row href={`${ws}/drafts`} icon={Inbox} label="Drafts & sent" />
            <Row href={`${ws}/files`} icon={FileText} label="Files" />
          </div>
        </div>

        <div>
          <div className="px-2 text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2 flex items-center justify-between">
            Channels
            <button
              className="p-1 hover:bg-black/40 rounded"
              aria-label="Add channel"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {[
              "design",
              "development",
              "sales-marketing",
              "vacations",
              "general",
              "memes",
            ].map((c, i) => (
              <Row
                key={c}
                href={`${ws}/channels/${c}`}
                icon={Hash}
                label={c.replace("-", " ")}
                active={i === 0}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="px-2 text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2">
            Direct messages
          </div>
          <div className="space-y-1">
            {["Nami", "Monkey D. Luffy", "Roronoa Zoro", "Koby"].map((n) => (
              <Row
                key={n}
                href={`${ws}/dm/${n.toLowerCase().replace(/\s/g, "-")}`}
                icon={AtSign}
                label={n}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
