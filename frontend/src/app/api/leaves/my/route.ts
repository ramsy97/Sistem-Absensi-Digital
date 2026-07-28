import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAuth } from "@/lib/api-middleware";

export async function GET(req: NextRequest) {
  try {
    const { payload } = await requireAuth(req);
    const userId = payload.userId;

    const leaves = await prisma.leaveRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error("Get my leaves error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
