import { Router } from "express";
import { getPresignedUrl, uploadLocal } from "../controllers/uploadController";
import { authMiddleware } from "../middleware/auth";
const router = Router();
router.use(authMiddleware);
router.post("/presigned", getPresignedUrl);
router.post("/local", uploadLocal);
export default router;
