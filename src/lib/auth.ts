import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "opbr-stock-dev-secret-change-in-production";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(username: string): Promise<string> {
  return jwt.sign({ username }, SECRET, { expiresIn: "7d" });
}

export async function verifyToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET) as { username: string };
    return payload.username;
  } catch {
    return null;
  }
}
