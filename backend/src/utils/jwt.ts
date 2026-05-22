import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "secret";
export const generateToken = (payload: any) => jwt.sign(payload, SECRET, { expiresIn: "7d" });
export const verifyToken = (token: string) => jwt.verify(token, SECRET);
