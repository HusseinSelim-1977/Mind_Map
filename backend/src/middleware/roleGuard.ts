import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { sendError } from "../utils/responses";

export const roleGuard = (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.map(r => r.toUpperCase()).includes(req.user.role.toUpperCase())) {
    return sendError(res, 403, "Access denied");
  }
  next();
};

export const requireManager = roleGuard(["MANAGER", "ADMIN"]);
