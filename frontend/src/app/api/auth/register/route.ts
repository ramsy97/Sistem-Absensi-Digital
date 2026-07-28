import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/utils/prisma";
import { generateToken } from "@/lib/utils/token";

export async function POST(req: NextRequest) {
  try {
    const { username, password, fullName, email } = await req.json();
    if (!username || !password || !fullName || !email) {
      return NextResponse.json({ error: "username, password, fullName, and email are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, fullName, email, role: "employee" },
    });

    const token = generateToken({ userId: user.id, role: user.role, username: user.username });
    const { password: _, ...userData } = user;
    return NextResponse.json({ token, user: userData }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
