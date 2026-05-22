import { Router } from "express";
import { getAuditLogs, getAuditLog } from "../controllers/auditController";
import { authMiddleware } from "../middleware/auth";
import { requireManager } from "../middleware/roleGuard";
const router = Router();
router.use(authMiddleware);
router.get("/", requireManager, getAuditLogs);
router.get("/:id", requireManager, getAuditLog);
export default router;
