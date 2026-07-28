import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAdmin } from "@/lib/api-middleware";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const leaves = await prisma.leaveRequest.findMany({
      where: { status: "pending" },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error("Pending leaves error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
