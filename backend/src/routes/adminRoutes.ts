import { Router } from "express";
import {
  getReports,
  getDashboardStats,
  getPendingLeaves,
  processLeave,
  getUsers,
  getOffices,
} from "../controllers/adminController";
import { authenticate, authorize } from "../middleware/auth";

export const adminRoutes = Router();

adminRoutes.use(authenticate);
adminRoutes.use(authorize("admin"));

adminRoutes.get("/reports", getReports);
adminRoutes.get("/dashboard", getDashboardStats);
adminRoutes.get("/leaves/pending", getPendingLeaves);
adminRoutes.put("/leaves/:id/process", processLeave);
adminRoutes.get("/users", getUsers);
adminRoutes.get("/offices", getOffices);
