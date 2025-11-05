import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);

  const user = await prisma.user.upsert({
    where: { email: "you@example.com" },
    update: {},
    create: {
      email: "you@example.com",
      name: "You",
      passwordHash,
      status: "online"
    }
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: "asia" },
    update: {},
    create: { name: "Asia", slug: "asia" }
  });

  await prisma.membership.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: workspace.id } },
    update: {},
    create: { userId: user.id, workspaceId: workspace.id, role: "owner" }
  });

  const channelGeneral = await prisma.channel.upsert({
    where: { id: "general" },
    update: {},
    create: { id: "general", name: "general", workspaceId: workspace.id }
  });

  await prisma.message.create({
    data: {
      workspaceId: workspace.id,
      channelId: channelGeneral.id,
      authorId: user.id,
      content: "Welcome to #general 👋"
    }
  });

  console.log("✅ Seeded workspace 'asia' with user and #general channel.");
}

main().finally(() => prisma.$disconnect());
