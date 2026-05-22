import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../middleware/auth";
import { db } from "../lib/dynamodb";
import { sendError, sendSuccess } from "../utils/responses";

const TABLE_COMMENTS = process.env.TABLE_COMMENTS || "Comments";
const TABLE_TASKS = process.env.TABLE_TASKS || "Tasks";
const TABLE_USERS = process.env.TABLE_USERS || "Users";

export const getComments = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.query;
  try {
    if (taskId) {
      const comments = await db.query(TABLE_COMMENTS, "TaskIndex", "taskId = :taskId", { ":taskId": taskId });
      const commentsWithUsers = await Promise.all(comments.map(async (comment: any) => {
        const user = await db.get(TABLE_USERS, { userId: comment.userId });
        return { ...comment, user: user ? { userId: user.userId, name: user.name } : null };
      }));
      sendSuccess(res, commentsWithUsers);
    } else {
      const comments = await db.scan(TABLE_COMMENTS, 100);
      sendSuccess(res, comments);
    }
  } catch {
    sendError(res, 500, "Failed to fetch comments");
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  const { taskId, text } = req.body;
  try {
    const task = await db.get(TABLE_TASKS, { taskId });
    if (!task) return sendError(res, 404, "Task not found");

    if (req.user!.role === "EMPLOYEE" && task.teamId !== req.user!.teamId) {
      return sendError(res, 403, "Access denied");
    }

    const commentId = uuidv4();
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
    sendError(res, 400, "Failed to create comment");
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const comment = await db.get(TABLE_COMMENTS, { commentId: id });
    if (!comment) return sendError(res, 404, "Comment not found");

    if (comment.userId !== req.user!.id && req.user!.role !== "MANAGER" && req.user!.role !== "ADMIN") {
      return sendError(res, 403, "Access denied");
    }

    await db.delete(TABLE_COMMENTS, { commentId: id });
    res.status(204).send();
  } catch {
    sendError(res, 404, "Comment not found");
  }
};
