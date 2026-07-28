import { Request, Response } from "express";
import { PrismaClient, AttendanceStatus } from "@prisma/client";
import { isWithinRadius } from "../utils/geofencing";

const prisma = new PrismaClient();

export async function checkIn(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { lat, lng } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        checkInTime: { gte: today, lt: tomorrow },
      },
    });

    if (existing?.checkOutTime === null) {
      res.status(400).json({ error: "You are already checked in. Please check out first." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { office: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    let status: AttendanceStatus = "on_time";
    let officeId: string | null = user.officeId;

    if (user.office) {
      if (lat && lng) {
        const within = isWithinRadius(
          { lat: Number(lat), lng: Number(lng) },
          { lat: user.office.latitude, lng: user.office.longitude },
          user.office.radiusMeters
        );
        if (!within) {
          res.status(403).json({ error: "You are outside the allowed geofence area" });
          return;
        }
      }

      const now = new Date();
      const [h, m] = user.office.workStartTime.split(":").map(Number);
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
      if (now > startTime) {
        status = "late";
      }
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        officeId,
        checkInTime: new Date(),
        checkInPhoto: photoUrl,
        checkInLat: lat ? Number(lat) : null,
        checkInLong: lng ? Number(lng) : null,
        status,
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function checkOut(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { lat, lng } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        checkInTime: { gte: today, lt: tomorrow },
        checkOutTime: null,
      },
    });

    if (!attendance) {
      res.status(400).json({ error: "No active check-in found for today" });
      return;
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime: new Date(),
        checkOutPhoto: photoUrl,
        checkOutLat: lat ? Number(lat) : null,
        checkOutLong: lng ? Number(lng) : null,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getHistory(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const month = req.query.month as string;
    const year = req.query.year as string;

    const where: any = { userId };

    if (month && year) {
      const m = parseInt(month) - 1;
      const y = parseInt(year);
      where.checkInTime = {
        gte: new Date(y, m, 1),
        lt: new Date(y, m + 1, 1),
      };
    }

    const [data, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        orderBy: { checkInTime: "desc" },
        skip,
        take: limit,
        include: { office: true },
      }),
      prisma.attendance.count({ where }),
    ]);

    res.json({
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTodayStatus(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        checkInTime: { gte: today, lt: tomorrow },
      },
      include: { office: true },
    });

    res.json(attendance || null);
  } catch (error) {
    console.error("Today status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
