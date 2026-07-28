import jwt, { SignOptions } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallback-dev-secret";

export interface TokenPayload {
  userId: string;
  role: "admin" | "employee";
  username: string;
}

export function generateToken(payload: TokenPayload): string {
  const opts: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN || "24h") as any };
  return jwt.sign(payload, SECRET, opts);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET) as TokenPayload;
}
