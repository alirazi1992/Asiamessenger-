"use client";
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/types";
import { getSocket } from "@/lib/events";
import MessageItem from "./MessageItem";
import ThreadPane from "./ThreadPane";

type Scope = { kind: "channel" | "dm"; workspace: string; id: string };

// Socket payload types
type MessageCreatedPayload = { room: string; message: Message };
type ReactionCreatedPayload = { messageId: string; emoji: string };

export default function MessageList({ scope }: { scope: Scope }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadRoot, setThreadRoot] = useState<Message | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // initial fetch
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/messages?workspace=${scope.workspace}&kind=${scope.kind}&id=${scope.id}`
        );
        if (res.ok) {
          const data: Message[] = await res.json();
          setMessages(data);

          requestAnimationFrame(() =>
            bottomRef.current?.scrollIntoView({ behavior: "auto" })
          );
        }
      } catch {
        /* ignore */
      }
    })();
  }, [scope.kind, scope.workspace, scope.id]);

  // realtime socket wiring
  useEffect(() => {
    const sock = getSocket();
    const room = `${scope.kind}:${scope.workspace}:${scope.id}`;
    sock.emit("join", { room });

    const onCreated = (payload: MessageCreatedPayload) => {
      if (payload.room === room) {
        setMessages((m) => [...m, payload.message]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    const onReaction = (r: ReactionCreatedPayload) => {
      setMessages((list) =>
        list.map((m) =>
          m.id === r.messageId
            ? {
                ...m,
                reactions: {
                  ...(m.reactions ?? {}),
                  [r.emoji]: ((m.reactions ?? {})[r.emoji] ?? 0) + 1,
                },
              }
            : m
        )
      );
    };

    sock.on("message:created", onCreated);
    sock.on("reaction:created", onReaction);

    return () => {
      sock.off("message:created", onCreated);
      sock.off("reaction:created", onReaction);
    };
  }, [scope.kind, scope.workspace, scope.id]);

  return (
    <div className="h-full grid grid-cols-[1fr_auto]">
      <div className="overflow-auto p-4 space-y-4">
        {messages.map((m) => (
          <MessageItem key={m.id} m={m} onReplyAction={setThreadRoot} />
        ))}
        <div ref={bottomRef} />
      </div>

      <ThreadPane root={threadRoot} onCloseAction={() => setThreadRoot(null)} />
    </div>
  );
}
