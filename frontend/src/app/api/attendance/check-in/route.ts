import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAuth } from "@/lib/api-middleware";
import { isWithinRadius } from "@/lib/utils/geofencing";

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

    const existing = await prisma.attendance.findFirst({
      where: { userId, checkInTime: { gte: today, lt: tomorrow } },
    });

    if (existing?.checkOutTime === null) {
      return NextResponse.json({ error: "You are already checked in. Please check out first." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { office: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let status: "on_time" | "late" = "on_time";
    let officeId: string | null = user.officeId;

    if (user.office) {
      if (lat && lng) {
        const within = isWithinRadius(
          parseFloat(lat), parseFloat(lng),
          user.office.latitude, user.office.longitude,
          user.office.radiusMeters
        );
        if (!within) {
          return NextResponse.json({ error: "You are outside the allowed geofence area" }, { status: 403 });
        }
      }

      const now = new Date();
      const [h, m] = user.office.workStartTime.split(":").map(Number);
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
      if (now > startTime) status = "late";
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        officeId,
        checkInTime: new Date(),
        checkInPhoto: photoBase64,
        checkInLat: lat ? parseFloat(lat) : null,
        checkInLong: lng ? parseFloat(lng) : null,
        status,
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
