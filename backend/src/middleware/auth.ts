import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/responses";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; teamId?: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return sendError(res, 401, "No token provided");
  try {
    const decoded = verifyToken(token) as { id: string; role: string; teamId?: string };
    req.user = decoded;
    next();
  } catch (err) {
    sendError(res, 401, "Invalid token");
  }
};
