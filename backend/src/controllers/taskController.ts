import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../middleware/auth";
import { db } from "../lib/dynamodb";
import { sendError, sendSuccess } from "../utils/responses";
import { requireManager } from "../middleware/roleGuard";

const TABLE_TASKS = process.env.TABLE_TASKS || "Tasks";
const TABLE_AUDIT_LOGS = process.env.TABLE_AUDIT_LOGS || "AuditLogs";
const TABLE_NOTIFICATIONS = process.env.TABLE_NOTIFICATIONS || "Notifications";

const getTasksForUser = async (req: AuthRequest) => {
  if (req.user!.role === "MANAGER" || req.user!.role === "ADMIN") {
    return db.scan(TABLE_TASKS, 100);
  }
  return db.query(TABLE_TASKS, "TeamIndex", "teamId = :teamId", { ":teamId": req.user!.teamId });
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await getTasksForUser(req);
    sendSuccess(res, tasks);
  } catch {
    sendError(res, 500, "Failed to fetch tasks");
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await db.get(TABLE_TASKS, { taskId: req.params.id });
    if (!task) return sendError(res, 404, "Task not found");

    if (req.user!.role === "EMPLOYEE" && task.teamId !== req.user!.teamId) {
      return sendError(res, 403, "Access denied");
    }

    sendSuccess(res, task);
  } catch {
    sendError(res, 500, "Failed to fetch task");
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, priority, projectId, assigneeId, deadline, teamId } = req.body;
  try {
    const taskId = uuidv4();
    const task = {
      taskId,
      title,
      description,
      priority: priority || "medium",
      projectId,
      assigneeId,
      teamId: teamId || req.user!.teamId || "unassigned",
      status: "TODO",
      deadline: deadline || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.put(TABLE_TASKS, task);

    await db.put(TABLE_AUDIT_LOGS, {
      logId: uuidv4(),
      taskId,
      action: "TASK_CREATED",
      actorId: req.user!.id,
      metadata: JSON.stringify({ title }),
      createdAt: new Date().toISOString(),
    });

    if (assigneeId) {
      await db.put(TABLE_NOTIFICATIONS, {
        notificationId: uuidv4(),
        userId: assigneeId,
        title: "New Task Assigned",
        message: `You have been assigned to: ${title}`,
        read: "false",
        createdAt: new Date().toISOString(),
      });
    }

    sendSuccess(res, task, 201);
  } catch (err) {
    console.error("Task creation error:", err);
    sendError(res, 400, "Failed to create task");
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const task = await db.get(TABLE_TASKS, { taskId: id });
    if (!task) return sendError(res, 404, "Task not found");

    if (req.user!.role === "EMPLOYEE" && task.teamId !== req.user!.teamId) {
      return sendError(res, 403, "Access denied");
    }

    const updateExpr = Object.keys(updates).map((k, i) => `#${k} = :${k}`).join(", ");
    const exprNames = Object.keys(updates).reduce((acc, k) => ({ ...acc, [`#${k}`]: k }), {});
    const exprValues = Object.keys(updates).reduce((acc, k) => ({ ...acc, [`:${k}`]: updates[k] }), {});

    exprNames["#updatedAt"] = "updatedAt";
    exprValues[":updatedAt"] = new Date().toISOString();

    const updated = await db.update(TABLE_TASKS, { taskId: id }, `set ${updateExpr}, #updatedAt = :updatedAt`, exprValues, exprNames);

    await db.put(TABLE_AUDIT_LOGS, {
      logId: uuidv4(),
      taskId: id,
      action: "TASK_UPDATED",
      actorId: req.user!.id,
      metadata: JSON.stringify(updates),
      createdAt: new Date().toISOString(),
    });

    sendSuccess(res, updated);
  } catch {
    sendError(res, 400, "Failed to update task");
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await db.delete(TABLE_TASKS, { taskId: id });
    res.status(204).send();
  } catch {
    sendError(res, 404, "Task not found");
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const task = await db.get(TABLE_TASKS, { taskId: id });
    if (!task) return sendError(res, 404, "Task not found");

    if (req.user!.role === "EMPLOYEE" && task.teamId !== req.user!.teamId) {
      return sendError(res, 403, "Access denied");
    }

    const updated = await db.update(TABLE_TASKS, { taskId: id }, "set #status = :status, #updatedAt = :updatedAt", { ":status": status, ":updatedAt": new Date().toISOString() }, { "#status": "status", "#updatedAt": "updatedAt" });

    await db.put(TABLE_AUDIT_LOGS, {
      logId: uuidv4(),
      taskId: id,
      action: "STATUS_CHANGED",
      actorId: req.user!.id,
      metadata: JSON.stringify({ from: task.status, to: status }),
      createdAt: new Date().toISOString(),
    });

    sendSuccess(res, updated);
  } catch {
    sendError(res, 400, "Failed to update status");
  }
};
