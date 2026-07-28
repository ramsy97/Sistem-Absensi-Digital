import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAuth } from "@/lib/api-middleware";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const userId = auth.payload.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: { userId, checkInTime: { gte: today, lt: tomorrow } },
      include: { office: true },
    });

    return NextResponse.json(attendance || null);
  } catch (error) {
    console.error("Today status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
