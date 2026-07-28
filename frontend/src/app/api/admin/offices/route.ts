import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAdmin } from "@/lib/api-middleware";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const offices = await prisma.office.findMany();

    return NextResponse.json(offices);
  } catch (error) {
    console.error("Get offices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
