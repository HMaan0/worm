import prisma from "@worm/db";
import { NextResponse } from "next/server";

export async function GET() {
  let personality = await prisma.personality.findFirst();

  if (!personality) {
    personality = await prisma.personality.create({
      data: { casualness: 10, verbosity: 10 },
    });
  }

  return NextResponse.json(personality);
}

export async function POST(req: Request) {
  const { casualness, verbosity } = await req.json();

  if (
    typeof casualness === "number" &&
    typeof verbosity === "number" &&
    casualness >= 0 &&
    casualness <= 100 &&
    verbosity >= 0 &&
    verbosity <= 100
  ) {
    let personality = await prisma.personality.findFirst();

    if (personality) {
      personality = await prisma.personality.update({
        where: { id: personality.id },
        data: { casualness, verbosity },
      });
    } else {
      personality = await prisma.personality.create({
        data: { casualness, verbosity },
      });
    }

    return NextResponse.json({ success: true, personality });
  }

  return NextResponse.json({ success: false, error: "Invalid slider values" });
}
