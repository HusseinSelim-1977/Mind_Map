import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { db } from "../lib/dynamodb";
import { sendError, sendSuccess } from "../utils/responses";

const TABLE_COMMENTS = process.env.TABLE_COMMENTS || "Comments";
const TABLE_NOTIFICATIONS = process.env.TABLE_NOTIFICATIONS || "Notifications";
const TABLE_AUDIT_LOGS = process.env.TABLE_AUDIT_LOGS || "AuditLogs";

export const addComment = async (req: AuthRequest, res: Response) => {
  const { taskId, text } = req.body;
  try {
    const commentId = crypto.randomUUID();
    const comment = {
      commentId,
      taskId,
      userId: req.user!.id,
      text,
      createdAt: new Date().toISOString(),
    };
    await db.put(TABLE_COMMENTS, comment);
    sendSuccess(res, comment, 201);
  } catch {
    sendError(res, 400, "Failed to add comment");
  }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await db.query(TABLE_NOTIFICATIONS, "UserIndex", "userId = :userId", { ":userId": req.user!.id });
    sendSuccess(res, notifications);
  } catch {
    sendError(res, 500, "Failed to fetch notifications");
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await db.update(TABLE_NOTIFICATIONS, { notificationId: id }, "set #read = :read", { ":read": true }, { "#read": "read" });
    sendSuccess(res, updated);
  } catch {
    sendError(res, 400, "Failed to update notification");
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.query;
  try {
    if (taskId) {
      const logs = await db.query(TABLE_AUDIT_LOGS, "TaskIndex", "taskId = :taskId", { ":taskId": String(taskId) });
      sendSuccess(res, logs);
    } else {
      const logs = await db.scan(TABLE_AUDIT_LOGS, 100);
      sendSuccess(res, logs);
    }
  } catch {
    sendError(res, 500, "Failed to fetch audit logs");
  }
};
