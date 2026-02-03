import express from "express";
import { getSuperAdminStats, getPrincipalStats, getTeacherDashboardStats } from "../controller/dashboard.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal, allowRoles } from "../middleware/role.moddleware.js";

const router = express.Router();

router.get("/super-admin/stats", auth, isAdmin, getSuperAdminStats);
router.get("/principal/stats/:school_id", auth, isPrincipal, getPrincipalStats);
router.get("/teacher/stats", auth, allowRoles("teacher"), getTeacherDashboardStats);

export default router;
