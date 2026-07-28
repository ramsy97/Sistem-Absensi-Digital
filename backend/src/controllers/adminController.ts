import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getReports(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate, officeId, status } = req.query;

    const where: any = {};
    if (startDate && endDate) {
      where.checkInTime = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }
    if (officeId) where.officeId = officeId as string;
    if (status) where.status = status as string;

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true, email: true, username: true } },
        office: true,
      },
      orderBy: { checkInTime: "desc" },
    });

    res.json(attendances);
  } catch (error) {
    console.error("Reports error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getDashboardStats(_req: Request, res: Response): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalEmployees, presentToday, lateToday, pendingLeaves] = await Promise.all([
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
      where: {
        checkInTime: { gte: weekAgo },
      },
      select: { checkInTime: true },
    });

    const weeklyChart = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekAgo);
      d.setDate(d.getDate() + i);
      const day = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
      const count = allAttendances.filter(
        (a) =>
          new Date(a.checkInTime).toDateString() === d.toDateString()
      ).length;
      return { day, count };
    });

    const recentActivity = await prisma.attendance.findMany({
      take: 10,
      orderBy: { checkInTime: "desc" },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    res.json({
      totalEmployees,
      presentToday,
      lateToday,
      pendingLeaves,
      weeklyChart,
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getPendingLeaves(req: Request, res: Response): Promise<void> {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      where: { status: "pending" },
      include: {
        user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(leaves);
  } catch (error) {
    console.error("Pending leaves error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function processLeave(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!["approved", "rejected"].includes(action)) {
      res.status(400).json({ error: "Action must be 'approved' or 'rejected'" });
      return;
    }

    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: action as "approved" | "rejected",
        processedBy: req.user!.userId,
      },
    });

    res.json(leave);
  } catch (error) {
    console.error("Process leave error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        phone: true,
        avatarUrl: true,
        office: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getOffices(_req: Request, res: Response): Promise<void> {
  try {
    const offices = await prisma.office.findMany();
    res.json(offices);
  } catch (error) {
    console.error("Get offices error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
