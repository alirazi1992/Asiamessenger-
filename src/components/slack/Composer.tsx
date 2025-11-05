"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/offline";
import { getSocket } from "@/lib/events";
import type { Message } from "@/lib/types";

type Scope = { kind: "channel" | "dm"; workspace: string; id: string };

// Socket payload types
type TypingEvent = { room: string };
type MessageNewEvent = { room: string; message: Message };

// Local outbox payload type (matches what the WS expects)
type OutboxPayload = MessageNewEvent;

export default function Composer({
  scope,
  threadRootId,
  onSentAction, // ✅ Next 16 serializable-friendly name
}: {
  scope: Scope;
  threadRootId?: string;
  onSentAction?: (m: Message) => void;
}) {
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const lastTypedAt = useRef<number>(0);
  const stopTypingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sock = getSocket();
  const room = `${scope.kind}:${scope.workspace}:${scope.id}`;

  // Listen for typing signals for this room
  useEffect(() => {
    const onTyping = () => setTyping(true);
    const onTypingStop = () => setTyping(false);

    sock.on(`typing:${room}`, onTyping);
    sock.on(`typingstop:${room}`, onTypingStop);

    return () => {
      sock.off(`typing:${room}`, onTyping);
      sock.off(`typingstop:${room}`, onTypingStop);
      if (stopTypingTimer.current) clearTimeout(stopTypingTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  // Emit a throttled typing event, and schedule a stop event
  const emitTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastTypedAt.current > 900) {
      const payload: TypingEvent = { room };
      sock.emit("typing", payload);
      lastTypedAt.current = now;
    }
    if (stopTypingTimer.current) clearTimeout(stopTypingTimer.current);
    stopTypingTimer.current = setTimeout(() => {
      const payload: TypingEvent = { room };
      sock.emit("typingstop", payload);
    }, 1500);
  }, [room, sock]);

  const send = useCallback(async () => {
    const content = text.trim();
    if (!content || isSending) return;
    setIsSending(true);

    const id = uuid();
    const message: Message = {
      id,
      workspaceId: scope.workspace,
      author: { id: "u1", name: "You", image: null },
      content,
      createdAt: new Date().toISOString(),
      ...(scope.kind === "channel"
        ? { channelId: scope.id }
        : { dmPeerId: scope.id }),
      ...(threadRootId ? { parentId: threadRootId } : {}),
    };

    try {
      // Persist to API (optional for your current backend stage)
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: scope.workspace,
          channelId: scope.kind === "channel" ? scope.id : undefined,
          dmPeerId: scope.kind === "dm" ? scope.id : undefined,
          authorId: "u1",
          content,
          parentId: threadRootId,
        }),
      });

      if (res.ok) {
        const saved = (await res.json()) as Message;
        const wsPayload: MessageNewEvent = { room, message: saved };
        sock.emit("message:new", wsPayload);
        onSentAction?.(saved);
      } else {
        // Fallback to outbox if API fails
        const offlinePayload: OutboxPayload = { room, message };
        await db.outbox.add({
          id,
          kind: "message",
          payload: offlinePayload,
          createdAt: Date.now(),
        });
      }
    } catch {
      // Offline: store in outbox
      const offlinePayload: OutboxPayload = { room, message };
      await db.outbox.add({
        id,
        kind: "message",
        payload: offlinePayload,
        createdAt: Date.now(),
      });
    } finally {
      setText("");
      setIsSending(false);
    }
  }, [text, isSending, scope, threadRootId, room, sock, onSentAction]);

  // Flush outbox when connection returns
  useEffect(() => {
    const handler = async () => {
      const items = await db.outbox.toArray();
      for (const it of items) {
        sock.emit("message:new", it.payload as OutboxPayload);
      }
      await db.outbox.clear();
    };
    window.addEventListener("online", handler);
    return () => window.removeEventListener("online", handler);
  }, [sock]);

  return (
    <div className="border-t border-[var(--border)] p-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-2 text-[var(--text-dim)]">
        <button
          type="button"
          className="h-8 px-2 rounded bg-[var(--panel-2)] hover:bg-black/40"
          title="Emoji"
        >
          😀
        </button>
        <button
          type="button"
          className="h-8 px-2 rounded bg-[var(--panel-2)] hover:bg-black/40"
          title="Attach"
        >
          📎
        </button>
        <button
          type="button"
          className="h-8 px-2 rounded bg-[var(--panel-2)] hover:bg-black/40"
          title="Inline code"
        >
          <span>{"`"}```</span>
        </button>
      </div>

      {/* Input */}
      <textarea
        className="w-full resize-none h-20 bg-[var(--panel-2)] border rounded p-3 outline-none"
        placeholder={`Message ${scope.kind === "channel" ? "#" : "@"}${
          scope.id
        }`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Enter to send, Shift+Enter for newline
          const isMetaEnter = (e.ctrlKey || e.metaKey) && e.key === "Enter";
          if ((e.key === "Enter" && !e.shiftKey) || isMetaEnter) {
            e.preventDefault();
            void send();
          } else {
            emitTyping();
          }
        }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-[var(--text-dim)]">
          {typing ? "Someone is typing…" : "\u00A0"}
        </div>
        <button
          type="button"
          onClick={send}
          disabled={!text.trim() || isSending}
          className="px-3 py-1 rounded bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
