"use client";
import { useState } from "react";
import MessageItem from "./MessageItem";
import Composer from "./Composer";
import type { Message } from "@/lib/types";

type Scope = { kind: "channel" | "dm"; workspace: string; id: string };

export default function ThreadPane({
  root,
  onCloseAction,
}: {
  root: Message | null;
  onCloseAction: () => void;
}) {
  const [msgs, setMsgs] = useState<Message[]>([]);

  if (!root) return null;

  const scope: Scope =
    "channelId" in root && root.channelId
      ? { kind: "channel", workspace: root.workspaceId, id: root.channelId }
      : { kind: "dm", workspace: root.workspaceId, id: root.dmPeerId! };

  return (
    <aside className="border-l border-neutral-800 w-[360px] min-w-[320px] max-w-[420px] bg-neutral-950 h-full grid grid-rows-[auto_1fr_auto]">
      <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <div className="font-semibold">Thread</div>
        <button
          className="text-neutral-400 hover:text-white"
          onClick={onCloseAction}
        >
          ✕
        </button>
      </div>

      <div className="overflow-auto p-4 space-y-4">
        <MessageItem m={root} onReplyAction={() => {}} />
        <div className="text-xs opacity-60">Replies</div>
        {msgs.map((m) => (
          <MessageItem key={m.id} m={m} onReplyAction={() => {}} />
        ))}
      </div>

      <div className="border-t border-neutral-800">
        <Composer
          scope={scope}
          threadRootId={root.id}
          onSentAction={(m: Message) => setMsgs((s) => [...s, m])}
        />
      </div>
    </aside>
  );
}
