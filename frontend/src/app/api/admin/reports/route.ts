import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAdmin } from "@/lib/api-middleware";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = req.nextUrl;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const officeId = searchParams.get("officeId");
    const status = searchParams.get("status");

    const where: any = {};
    if (startDate && endDate) {
      where.checkInTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    if (officeId) where.officeId = officeId;
    if (status) where.status = status;

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: { id: true, fullName: true, email: true, username: true },
        },
        office: true,
      },
      orderBy: { checkInTime: "desc" },
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
