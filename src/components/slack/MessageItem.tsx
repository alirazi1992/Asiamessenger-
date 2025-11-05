"use client";
import { useState } from "react";
import type { Message } from "@/lib/types";
import { getSocket } from "@/lib/events";

const defaultReactions = ["👍", "❤️", "🎉", "😂", "🙏"];

export default function MessageItem({
  m,
  onReplyAction,
}: {
  m: Message;
  onReplyAction: (m: Message) => void;
}) {
  const [reactions, setReactions] = useState<Record<string, number>>(
    m.reactions ?? {}
  );
  const addReaction = (emoji: string) => {
    const next = { ...reactions, [emoji]: (reactions[emoji] ?? 0) + 1 };
    setReactions(next);
    getSocket().emit("reaction:new", { messageId: m.id, emoji });
  };

  return (
    <div className="group flex items-start gap-3">
      <img
        src={m.author.image ?? "/avatar-placeholder.png"}
        alt=""
        className="w-8 h-8 rounded-full mt-1 border border-[var(--border)]"
      />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] mb-1">
          <span className="font-semibold">{m.author.name}</span>{" "}
          <span className="text-[var(--text-dim)]">
            {new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="rounded-lg bg-[var(--panel-2)] border px-3 py-2 text-[15px] leading-6">
          <div className="whitespace-pre-wrap break-words">{m.content}</div>
          {!!m.files?.length && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {m.files.map((f) => (
                <a
                  key={f.id}
                  href={f.url}
                  className="text-xs underline break-all"
                >
                  📎 {f.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* reactions */}
        <div className="mt-1 flex flex-wrap gap-1">
          {Object.entries(reactions).map(([emo, count]) => (
            <button
              key={emo}
              onClick={() => addReaction(emo)}
              className="rounded-full border px-2 py-[2px] text-xs hover:bg-black/30"
            >
              {emo} {count}
            </button>
          ))}
        </div>
      </div>

      {/* hover toolbar */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {defaultReactions.map((e) => (
          <button
            key={e}
            onClick={() => addReaction(e)}
            className="h-7 w-7 rounded-full bg-[var(--panel-2)] hover:bg-black/40"
            title={`React ${e}`}
          >
            {e}
          </button>
        ))}
        <button
          onClick={() => onReplyAction(m)}
          className="px-2 h-7 rounded bg-[var(--panel-2)] hover:bg-black/40 text-sm"
          title="Reply in thread"
        >
          💬
        </button>
      </div>
    </div>
  );
}
