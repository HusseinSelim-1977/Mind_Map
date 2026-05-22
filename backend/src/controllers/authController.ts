import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../lib/dynamodb";
import { generateToken, generateRefreshToken } from "../utils/jwt";
import { sendError, sendSuccess } from "../utils/responses";

const TABLE_USERS = process.env.TABLE_USERS || "Users";

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, role, teamId } = req.body;
  try {
    const existing = await db.query(TABLE_USERS, "EmailIndex", "email = :email", { ":email": email });
    if (existing.length > 0) {
      return sendError(res, 409, "Email already registered");
    }

    const userId = crypto.randomUUID();
    const hashed = await bcrypt.hash(password, 10);

    const user = await db.put(TABLE_USERS, {
      userId,
      email,
      password: hashed,
      name,
      role: role || "EMPLOYEE",
      teamId: teamId || "unassigned",
      createdAt: new Date().toISOString(),
    });

    const token = generateToken({ userId, email: user.email, role: user.role, teamId: user.teamId });
    const refreshToken = generateRefreshToken({ userId });

    sendSuccess(res, {
      user: { userId, email: user.email, name: user.name, role: user.role, teamId: user.teamId },
      token,
      refreshToken
    }, 201);
  } catch (err) {
    console.error("Registration error:", err);
    sendError(res, 400, "Registration failed");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const users = await db.query(TABLE_USERS, "EmailIndex", "email = :email", { ":email": email });
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendError(res, 401, "Invalid credentials");
    }

    const token = generateToken({ userId: user.userId, email: user.email, role: user.role, teamId: user.teamId });
    const refreshToken = generateRefreshToken({ userId: user.userId });

    sendSuccess(res, {
      user: { userId: user.userId, email: user.email, name: user.name, role: user.role, teamId: user.teamId },
      token,
      refreshToken
    });
  } catch (err) {
    sendError(res, 400, "Login failed");
  }
};
