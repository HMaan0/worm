import prisma from "@worm/db";
import { NextResponse } from "next/server";

export async function GET() {
  let knowledge = await prisma.knowledge.findFirst();

  if (!knowledge) {
    knowledge = await prisma.knowledge.create({
      data: {
        customBaseOn: false,
        websitesOn: false,
        customContext: "",
        websiteLink: "",
      },
    });
  }

  return NextResponse.json(knowledge);
}

export async function POST(req: Request) {
  const body = await req.json();

  let knowledge = await prisma.knowledge.findFirst();

  if (!knowledge) {
    knowledge = await prisma.knowledge.create({ data: body });
  } else {
    knowledge = await prisma.knowledge.update({
      where: { id: knowledge.id },
      data: body,
    });
  }

  return NextResponse.json({ success: true, data: knowledge });
}
