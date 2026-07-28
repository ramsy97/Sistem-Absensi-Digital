import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAuth } from "@/lib/api-middleware";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const userId = auth.payload.userId;
    const role = auth.payload.role;

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const where: any = {};
    if (role !== "admin") where.userId = userId;
    if (month && year) {
      const m = parseInt(month) - 1;
      const y = parseInt(year);
      where.checkInTime = { gte: new Date(y, m, 1), lt: new Date(y, m + 1, 1) };
    }

    const [data, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        orderBy: { checkInTime: "desc" },
        skip,
        take: limit,
        include: { office: true, user: { select: { id: true, fullName: true, email: true, username: true } } },
      }),
      prisma.attendance.count({ where }),
    ]);

    return NextResponse.json({ data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
