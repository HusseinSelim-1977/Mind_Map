import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";

export const generateToken = (payload: any) => jwt.sign(payload, SECRET, { expiresIn: "7d" });
export const generateRefreshToken = (payload: any) => jwt.sign(payload, REFRESH_SECRET, { expiresIn: "30d" });
export const verifyToken = (token: string) => jwt.verify(token, SECRET);
export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET);
