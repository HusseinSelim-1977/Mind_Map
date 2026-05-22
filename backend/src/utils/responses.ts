import { Response } from "express";
export const sendError = (res: Response, status: number, message: string) => res.status(status).json({ error: message });
export const sendSuccess = (res: Response, data: any, status = 200) => res.status(status).json(data);
