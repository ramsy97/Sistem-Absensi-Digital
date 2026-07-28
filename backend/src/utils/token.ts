import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallback-dev-secret";

export interface TokenPayload {
  userId: string;
  role: "admin" | "employee";
  username: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "24h" });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET) as TokenPayload;
}
