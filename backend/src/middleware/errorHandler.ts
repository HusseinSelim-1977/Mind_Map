import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/responses";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  sendError(res, 500, "Internal Server Error");
};
