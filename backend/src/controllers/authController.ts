import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/token";

const prisma = new PrismaClient();

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
      username: user.username,
    });

    const { password: _, ...userData } = user;

    res.json({ token, user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, fullName, email } = req.body;
    if (!username || !password || !fullName || !email) {
      res.status(400).json({ error: "username, password, fullName, and email are required" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, fullName, email, role: "employee" },
    });

    const token = generateToken({ userId: user.id, role: user.role, username: user.username });
    const { password: _, ...userData } = user;

    res.status(201).json({ token, user: userData });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.json({ message: "Logged out successfully" });
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { office: true },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const { username, fullName, email, phone } = req.body;
    const userId = req.user!.userId;

    if (username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== userId) {
        res.status(409).json({ error: "Username already taken" });
        return;
      }
    }

    const data: any = {};
    if (username !== undefined) data.username = username;
    if (fullName !== undefined) data.fullName = fullName;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    const { password: _, ...userData } = user;
    res.json({ message: "Profile updated", user: userData });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user!.userId;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: "Old password and new password are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
