import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAdmin } from "@/lib/api-middleware";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalEmployees, presentToday, lateToday, pendingLeaves] =
      await Promise.all([
        prisma.user.count({ where: { role: "employee" } }),
        prisma.attendance.count({
          where: {
            checkInTime: { gte: today, lt: tomorrow },
            status: "on_time",
          },
        }),
        prisma.attendance.count({
          where: {
            checkInTime: { gte: today, lt: tomorrow },
            status: "late",
          },
        }),
        prisma.leaveRequest.count({ where: { status: "pending" } }),
      ]);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);

    const allAttendances = await prisma.attendance.findMany({
      where: { checkInTime: { gte: weekAgo } },
      select: { checkInTime: true },
    });

    const weeklyChart = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekAgo);
      d.setDate(d.getDate() + i);
      const day = d
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const count = allAttendances.filter(
        (a) => new Date(a.checkInTime).toDateString() === d.toDateString()
      ).length;
      return { day, count };
    });

    const recentActivity = await prisma.attendance.findMany({
      take: 5,
      orderBy: { checkInTime: "desc" },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({
      totalEmployees,
      presentToday,
      lateToday,
      pendingLeaves,
      weeklyChart,
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
