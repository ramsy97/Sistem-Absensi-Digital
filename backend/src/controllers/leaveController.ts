import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function requestLeave(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { type, startDate, endDate, reason } = req.body;
    const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!type || !startDate || !endDate || !reason) {
      res.status(400).json({ error: "type, startDate, endDate, and reason are required" });
      return;
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        userId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        attachmentUrl,
      },
    });

    res.status(201).json(leave);
  } catch (error) {
    console.error("Request leave error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getMyLeaves(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const leaves = await prisma.leaveRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(leaves);
  } catch (error) {
    console.error("Get my leaves error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
