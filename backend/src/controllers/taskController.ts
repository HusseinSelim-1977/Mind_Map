import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import { sendError, sendSuccess } from "../utils/responses";

export const getTasks = async (req: AuthRequest, res: Response) => {
  const where = req.user?.role === "employee" ? { assigneeId: req.user.id } : {};
  const tasks = await prisma.task.findMany({ 
    where, 
    include: { assignee: { select: { name: true, avatar: true } }, project: true } 
  });
  sendSuccess(res, tasks);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, priority, projectId, assigneeId, deadline } = req.body;
  try {
    const task = await prisma.task.create({
      data: { title, description, priority, projectId, assigneeId, deadline: deadline ? new Date(deadline) : null },
    });
    // Audit log
    await prisma.auditLog.create({
      data: { userId: req.user!.id, taskId: task.id, action: "created task" }
    });
    // Notification
    if (assigneeId) {
      await prisma.notification.create({
        data: { userId: assigneeId, title: "New Task Assigned", message: `You have been assigned to: ${title}` }
      });
    }
    sendSuccess(res, task, 201);
  } catch (err) {
    sendError(res, 400, "Failed to create task");
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const task = await prisma.task.update({ where: { id }, data: updates });
    await prisma.auditLog.create({
      data: { userId: req.user!.id, taskId: id, action: "updated task", metadata: JSON.stringify(updates) }
    });
    sendSuccess(res, task);
  } catch (err) {
    sendError(res, 400, "Failed to update task");
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id } });
    sendSuccess(res, { message: "Task deleted" });
  } catch (err) {
    sendError(res, 400, "Failed to delete task");
  }
};
