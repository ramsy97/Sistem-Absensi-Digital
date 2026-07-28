import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAdmin } from "@/lib/api-middleware";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { payload } = await requireAdmin(req);
    const { id } = params;
    const { action } = await req.json();

    if (!["approved", "rejected"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: action as "approved" | "rejected",
        processedBy: payload.userId,
      },
    });

    return NextResponse.json(leave);
  } catch (error) {
    console.error("Process leave error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
