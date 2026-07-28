import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAuth } from "@/lib/api-middleware";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const userId = auth.payload.userId;

    const formData = await req.formData();
    const type = formData.get("type") as string | null;
    const startDate = formData.get("startDate") as string | null;
    const endDate = formData.get("endDate") as string | null;
    const reason = formData.get("reason") as string | null;
    const attachment = formData.get("attachment") as File | null;

    if (!type || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "type, startDate, endDate, and reason are required" },
        { status: 400 }
      );
    }

    let attachmentUrl: string | null = null;
    if (attachment && attachment instanceof File && attachment.size > 0) {
      const bytes = await attachment.arrayBuffer();
      const buffer = Buffer.from(bytes);
      attachmentUrl = `data:${attachment.type};base64,${buffer.toString("base64")}`;
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        userId,
        type: type as any,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        attachmentUrl,
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error("Request leave error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
