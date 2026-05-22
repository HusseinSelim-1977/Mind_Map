import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { generateToken } from "../utils/jwt";
import { sendError, sendSuccess } from "../utils/responses";

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role },
    });
    sendSuccess(res, { token: generateToken({ id: user.id, role: user.role }) }, 201);
  } catch (err) {
    sendError(res, 400, "User already exists or invalid data");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return sendError(res, 401, "Invalid credentials");
  }
  sendSuccess(res, { token: generateToken({ id: user.id, role: user.role }), user: { id: user.id, name: user.name, role: user.role } });
};
