import express from "express";
import {
  createSyllabus,
  getAllSyllabus,
  getSyllabusById,
  updateSyllabus,
  assignSyllabus,
  getAssignmentsBySchool,
  getTeacherSyllabus,
  updateChapterProgress,
  markAttendance,
  getAttendanceBySchool
} from "../controller/syllabus.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin, isPrincipal, isTeacher } from "../middleware/role.moddleware.js";

const router = express.Router();

// ADMIN Routes
router.post("/master", auth, isAdmin, createSyllabus);
router.get("/master", auth, getAllSyllabus);
router.get("/master/:id", auth, getSyllabusById);
router.put("/master/:id", auth, isAdmin, updateSyllabus);

// PRINCIPAL Routes
router.post("/assign", auth, isPrincipal, assignSyllabus);
router.get("/assignments", auth, isPrincipal, getAssignmentsBySchool);
router.get("/attendance", auth, isPrincipal, getAttendanceBySchool);

// TEACHER Routes
router.get("/my-syllabus", auth, isTeacher, getTeacherSyllabus);
router.post("/progress", auth, isTeacher, updateChapterProgress);
router.post("/attendance", auth, isTeacher, markAttendance);

export default router;
