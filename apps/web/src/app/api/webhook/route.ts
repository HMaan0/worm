import prisma from "@worm/db";
import { NextResponse } from "next/server";
type Msg = {
  id: number;
  createdAt: Date;
  role: string;
  content: string;
  userId: number;
};
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const from = formData.get("From") as string | null;
    const body = formData.get("Body") as string | null;

    if (!from || !body) {
      return NextResponse.json(
        { error: "Missing 'From' or 'Body' in request" },
        { status: 400 }
      );
    }

    const normalizedPhone = from.replace(/\D+/g, "");
    const user = await prisma.user.upsert({
      where: { phoneNumber: normalizedPhone },
      update: {},
      create: { phoneNumber: normalizedPhone },
    });

    await prisma.message.create({
      data: {
        userId: user.id,
        role: "user",
        content: body,
      },
    });

    const history = await prisma.message.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    const messages = history.map((msg: Msg) => ({
      id: msg.id.toString(),
      role: msg.role,
      parts: [{ type: "text", text: msg.content }],
    }));

    const aiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      }
    );

    if (!aiResponse.ok) {
      throw new Error(
        `AI endpoint error: ${aiResponse.status} ${aiResponse.statusText}`
      );
    }

    const reader = aiResponse?.body?.getReader();
    const decoder = new TextDecoder();
    let aiText = "";

    if (reader !== undefined) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.startsWith("data:"));

        for (const line of lines) {
          const jsonString = line.replace(/^data:\s*/, "");
          if (jsonString === "[DONE]") continue;
          try {
            const event = JSON.parse(jsonString);
            if (event.type === "text-delta" && event.delta) {
              aiText += event.delta;
            }
          } catch {
            continue;
          }
        }
      }
    }

    aiText = aiText.trim();
    if (!aiText) aiText = "Sorry, I couldn’t generate a reply.";

    await prisma.message.create({
      data: {
        userId: user.id,
        role: "assistant",
        content: aiText,
      },
    });

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: normalizedPhone, body: aiText }),
    });

    return new NextResponse("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
