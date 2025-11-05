"use client";
import Dexie, { Table } from "dexie";
import type { Message } from "@/lib/types";

export type OutboxItem = {
  id: string;
  kind: "message";
  payload: { room: string; message: Message }; // ✅ explicit payload shape
  createdAt: number;
};

class LocalDB extends Dexie {
  outbox!: Table<OutboxItem, string>;
}

export const db = new LocalDB("asiachat");
db.version(1).stores({
  outbox: "id, kind, createdAt",
});
