import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { joinQueue, checkQueueStatus, leaveQueue } from "../controllers/queueController.js";

const router = express.Router();
router.use(protectRoute);

router.post("/join", joinQueue);
router.get("/status", checkQueueStatus);
router.post("/leave", leaveQueue);

export default router;