import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { db } from "../lib/dynamodb";
import { sendError, sendSuccess } from "../utils/responses";
import { requireManager } from "../middleware/roleGuard";

const TABLE_AUDIT_LOGS = process.env.TABLE_AUDIT_LOGS || "AuditLogs";

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.query;
  try {
    if (taskId) {
      const logs = await db.query(TABLE_AUDIT_LOGS, "TaskIndex", "taskId = :taskId", { ":taskId": taskId });
      sendSuccess(res, logs);
    } else {
      const logs = await db.scan(TABLE_AUDIT_LOGS, 100);
      sendSuccess(res, logs);
    }
  } catch {
    sendError(res, 500, "Failed to fetch audit logs");
  }
};

export const getAuditLog = async (req: AuthRequest, res: Response) => {
  try {
    const log = await db.get(TABLE_AUDIT_LOGS, { logId: req.params.id });
    if (!log) return sendError(res, 404, "Audit log not found");
    sendSuccess(res, log);
  } catch {
    sendError(res, 500, "Failed to fetch audit log");
  }
};
