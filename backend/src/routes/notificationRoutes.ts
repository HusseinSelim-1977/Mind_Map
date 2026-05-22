import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";
import { authMiddleware } from "../middleware/auth";
const router = Router();
router.use(authMiddleware);
router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);
export default router;
