import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { db } from "../lib/dynamodb";
import { sendError, sendSuccess } from "../utils/responses";

const TABLE_NOTIFICATIONS = process.env.TABLE_NOTIFICATIONS || "Notifications";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await db.query(TABLE_NOTIFICATIONS, "UserIndex", "userId = :userId", { ":userId": req.user!.id });
    sendSuccess(res, notifications);
  } catch {
    sendError(res, 500, "Failed to fetch notifications");
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const notification = await db.get(TABLE_NOTIFICATIONS, { notificationId: id });
    if (!notification) return sendError(res, 404, "Notification not found");

    if (notification.userId !== req.user!.id) {
      return sendError(res, 403, "Access denied");
    }

    const updated = await db.update(TABLE_NOTIFICATIONS, { notificationId: id }, "set #read = :read", { ":read": "true" }, { "#read": "read" });
    sendSuccess(res, updated);
  } catch {
    sendError(res, 400, "Failed to mark as read");
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await db.query(TABLE_NOTIFICATIONS, "UserIndex", "userId = :userId", { ":userId": req.user!.id });
    for (const notification of notifications) {
      await db.update(TABLE_NOTIFICATIONS, { notificationId: notification.notificationId }, "set #read = :read", { ":read": "true" }, { "#read": "read" });
    }
    sendSuccess(res, { message: "All notifications marked as read" });
  } catch {
    sendError(res, 400, "Failed to mark all as read");
  }
};
