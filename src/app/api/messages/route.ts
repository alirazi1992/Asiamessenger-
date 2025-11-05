import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const workspace = searchParams.get("workspace");
  const kind = searchParams.get("kind");
  const id = searchParams.get("id");

  if (!workspace || !kind || !id) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const where =
      kind === "channel"
        ? { workspaceId: workspace, channelId: id }
        : { workspaceId: workspace, dmPeerId: id };

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: "asc" },
      include: { author: true, files: true },
    });

    return NextResponse.json(messages);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { workspaceId, channelId, dmPeerId, authorId, content } = body;

  if (!workspaceId || !authorId || !content || (!channelId && !dmPeerId)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      workspaceId,
      channelId: channelId ?? null,
      dmPeerId: dmPeerId ?? null,
      authorId,
      content,
    },
    include: { author: true, files: true },
  });

  return NextResponse.json(message, { status: 201 });
}
