import { NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "./utils/token";

export function getAuthUser(req: Request): TokenPayload | null {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  try {
    return verifyToken(header.split(" ")[1]);
  } catch {
    return null;
  }
}

export function requireAuth(req: Request): { payload: TokenPayload; error?: NextResponse } {
  const payload = getAuthUser(req);
  if (!payload) {
    return { payload: null as any, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { payload };
}

export function requireAdmin(req: Request): { payload: TokenPayload; error?: NextResponse } {
  const result = requireAuth(req);
  if (result.error) return result;
  if (result.payload.role !== "admin") {
    return { payload: result.payload, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}
