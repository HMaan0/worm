"use server";

import prisma from "@worm/db";

export async function getAllConversations() {
  const users = await prisma.user.findMany({
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return users.map((user) => ({
    id: user.id,
    phoneNumber: user.phoneNumber,
    lastMessage: user.messages[0]?.content || "No messages yet",
    lastUpdated: user.updatedAt,
  }));
}

export async function getConversationMessages(userId: number) {
  const messages = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { phoneNumber: true },
  });

  return { user, messages };
}
