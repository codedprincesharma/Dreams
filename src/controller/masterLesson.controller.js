import MasterLessonPlan from "../models/MasterLessonPlan.model.js";

/**
 * =======================================================
 * ADMIN → CREATE / UPSERT MASTER LESSON
 * =======================================================
 */
export const createMasterLesson = async (req, res) => {
  try {
    const { class: classNo, subject, week, lessons } = req.body;

    if (!classNo || !subject || !week || !lessons) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lesson = await MasterLessonPlan.findOneAndUpdate(
      { class: classNo, subject, week },
      {
        lessons,
        $inc: { version: 1 },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json({
      success: true,
      lesson,
      message: "Master lesson saved (upsert)",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * ADMIN → UPDATE MASTER LESSON (Version++)
 * =======================================================
 */
export const updateMasterLesson = async (req, res) => {
  try {
    const updated = await MasterLessonPlan.findByIdAndUpdate(
      req.params.id,
      {
        lessons: req.body.lessons,
        $inc: { version: 1 },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Master lesson not found" });
    }

    res.status(200).json({
      success: true,
      updated,
      message: "Master lesson updated",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * COMMON → GET ALL MASTER LESSONS
 * =======================================================
 */
export const getAllMasterLessons = async (req, res) => {
  try {
    const lessons = await MasterLessonPlan.find().sort({
      class: 1,
      subject: 1,
      week: 1,
    });

    res.status(200).json({ success: true, lessons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * COMMON → GET MASTER LESSON BY ID
 * =======================================================
 */
export const getMasterLessonById = async (req, res) => {
  try {
    const lesson = await MasterLessonPlan.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ success: true, lesson });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * COMMON → GET BY CLASS
 * =======================================================
 */
export const getMasterLessonsByClass = async (req, res) => {
  try {
    const lessons = await MasterLessonPlan.find({
      class: req.params.classNo,
    }).sort({ week: 1 });

    res.status(200).json({ success: true, lessons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * COMMON → GET BY SUBJECT
 * =======================================================
 */
export const getMasterLessonsBySubject = async (req, res) => {
  try {
    const lessons = await MasterLessonPlan.find({
      subject: req.params.subject,
    }).sort({ class: 1, week: 1 });

    res.status(200).json({ success: true, lessons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * COMMON → GET BY CLASS + SUBJECT
 * =======================================================
 */
export const getMasterLessonsByClassAndSubject = async (req, res) => {
  try {
    const { classNo, subject } = req.query;

    if (!classNo || !subject) {
      return res
        .status(400)
        .json({ message: "classNo and subject required" });
    }

    const lessons = await MasterLessonPlan.find({
      class: classNo,
      subject,
    }).sort({ week: 1 });

    res.status(200).json({ success: true, lessons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * COMMON → GET BY CLASS + WEEK
 * =======================================================
 */
export const getMasterLessonByWeek = async (req, res) => {
  try {
    const { classNo, week } = req.query;

    const lesson = await MasterLessonPlan.findOne({
      class: classNo,
      week,
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ success: true, lesson });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * ADMIN → DELETE MASTER LESSON
 * =======================================================
 */
export const deleteMasterLesson = async (req, res) => {
  try {
    const deleted = await MasterLessonPlan.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({
      success: true,
      message: "Master lesson deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =======================================================
 * ADMIN → DUPLICATE MASTER LESSON (SAFE)
 * =======================================================
 */
export const duplicateMasterLesson = async (req, res) => {
  try {
    const original = await MasterLessonPlan.findById(req.params.id);
    if (!original) {
      return res.status(404).json({ message: "Original lesson not found" });
    }

    const exists = await MasterLessonPlan.findOne({
      class: original.class,
      subject: original.subject,
      week: original.week + 1,
    });

    if (exists) {
      return res
        .status(409)
        .json({ message: "Next week already exists" });
    }

    const duplicate = await MasterLessonPlan.create({
      class: original.class,
      subject: original.subject,
      week: original.week + 1,
      lessons: original.lessons,
    });

    res.status(201).json({ success: true, duplicate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
