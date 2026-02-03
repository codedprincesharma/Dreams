import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.moddleware.js";

import {
  createMasterLesson,
  updateMasterLesson,
  getAllMasterLessons,
  getMasterLessonById,
  getMasterLessonsByClass,
  getMasterLessonsBySubject,
  getMasterLessonsByClassAndSubject,
  getMasterLessonByWeek,
  deleteMasterLesson,
  duplicateMasterLesson,
} from "../controller/masterLesson.controller.js";

const router = express.Router();

/**
 * ============================
 * ADMIN
 * ============================
 */
router.post("/", auth, isAdmin, createMasterLesson);
router.put("/:id", auth, isAdmin, updateMasterLesson);
router.delete("/:id", auth, isAdmin, deleteMasterLesson);
router.post("/:id/duplicate", auth, isAdmin, duplicateMasterLesson);

/**
 * ============================
 * READ
 * ============================
 */
router.get("/", auth, getAllMasterLessons);
router.get("/class/:classNo", auth, getMasterLessonsByClass);
router.get("/subject/:subject", auth, getMasterLessonsBySubject);
router.get("/filter", auth, getMasterLessonsByClassAndSubject);
router.get("/week", auth, getMasterLessonByWeek);
router.get("/:id", auth, getMasterLessonById);

export default router;
