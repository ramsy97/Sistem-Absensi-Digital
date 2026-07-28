import { Router } from "express";
import { login, register, logout, me, updateProfile, changePassword } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", authenticate, logout);
authRoutes.get("/me", authenticate, me);
authRoutes.put("/profile", authenticate, updateProfile);
authRoutes.put("/password", authenticate, changePassword);
