import { Router } from "express";
import { requestLeave, getMyLeaves } from "../controllers/leaveController";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

export const leaveRoutes = Router();

leaveRoutes.post("/request", authenticate, upload.single("attachment"), requestLeave);
leaveRoutes.get("/my", authenticate, getMyLeaves);
