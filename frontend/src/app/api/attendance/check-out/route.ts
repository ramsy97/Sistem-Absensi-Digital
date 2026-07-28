import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAuth } from "@/lib/api-middleware";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const userId = auth.payload.userId;

    const formData = await req.formData();
    const lat = formData.get("lat") as string | null;
    const lng = formData.get("lng") as string | null;
    const photoFile = formData.get("photo") as File | null;

    let photoBase64: string | null = null;
    if (photoFile) {
      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      photoBase64 = `data:${photoFile.type};base64,${buffer.toString("base64")}`;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: { userId, checkInTime: { gte: today, lt: tomorrow }, checkOutTime: null },
    });

    if (!attendance) {
      return NextResponse.json({ error: "No active check-in found for today" }, { status: 400 });
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime: new Date(),
        checkOutPhoto: photoBase64,
        checkOutLat: lat ? parseFloat(lat) : null,
        checkOutLong: lng ? parseFloat(lng) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Check-out error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
