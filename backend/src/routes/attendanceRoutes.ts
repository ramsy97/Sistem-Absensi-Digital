import { Router } from "express";
import { checkIn, checkOut, getHistory, getTodayStatus } from "../controllers/attendanceController";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

export const attendanceRoutes = Router();

attendanceRoutes.post("/check-in", authenticate, upload.single("photo"), checkIn);
attendanceRoutes.post("/check-out", authenticate, upload.single("photo"), checkOut);
attendanceRoutes.get("/history", authenticate, getHistory);
attendanceRoutes.get("/today", authenticate, getTodayStatus);
