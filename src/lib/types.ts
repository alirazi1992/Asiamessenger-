// src/lib/types.ts
export type FileRef = {
  id: string;
  name: string;
  url: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  status: "online" | "away" | "offline";
};

export type UserRef = {
  id: string;
  name: string;
  image?: string | null;
};

export type Message = {
  id: string;
  workspaceId: string;
  channelId?: string;
  dmPeerId?: string;
  parentId?: string;
  author: UserRef;
  content: string;
  createdAt: string; // ISO
  edited?: boolean;
  files?: FileRef[];
  reactions?: Record<string, number>;
};
