import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import { sendError, sendSuccess } from "../utils/responses";

export const addComment = async (req: AuthRequest, res: Response) => {
  const { taskId, text } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: { taskId, text, userId: req.user!.id }
    });
    sendSuccess(res, comment, 201);
  } catch (err) {
    sendError(res, 400, "Failed to add comment");
  }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const notifications = await prisma.notification.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" } });
  sendSuccess(res, notifications);
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.notification.update({ where: { id, userId: req.user!.id }, data: { read: true } });
    sendSuccess(res, { message: "Marked as read" });
  } catch (err) {
    sendError(res, 400, "Failed to update notification");
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.query;
  const where = taskId ? { taskId: String(taskId) } : {};
  const logs = await prisma.auditLog.findMany({ where, include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } });
  sendSuccess(res, logs);
};
