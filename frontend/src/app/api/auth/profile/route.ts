import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { requireAuth } from "@/lib/api-middleware";

export async function PUT(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { username, fullName, email, phone } = await req.json();
    const userId = auth.payload.userId;

    if (username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== userId) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }
    }

    const data: Record<string, any> = {};
    if (username !== undefined) data.username = username;
    if (fullName !== undefined) data.fullName = fullName;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    const { password: _, ...userData } = user;
    return NextResponse.json({ message: "Profile updated", user: userData });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
