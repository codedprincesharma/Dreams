import School from "../models/school.model.js";
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import SyllabusAssignment from "../models/syllabusAssignment.model.js";
import ChapterProgress from "../models/chapterProgress.model.js";
import Attendance from "../models/attendance.model.js";
import TimetableTeacher from "../models/timetableTeacher.model.js";

export const getSuperAdminStats = async (req, res) => {
  try {
    const schoolCount = await School.countDocuments();
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();

    res.json({
      success: true,
      stats: {
        schools: schoolCount,
        students: studentCount,
        teachers: teacherCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPrincipalStats = async (req, res) => {
  try {
    const { school_id } = req.params;

    const studentCount = await Student.countDocuments({ school_id });
    const teacherCount = await Teacher.countDocuments({ school_id });

    // Calculate Syllabus Progress
    const assignments = await SyllabusAssignment.find({ schoolId: school_id }).populate("syllabusId");
    let totalChapters = 0;
    let completedChapters = 0;

    for (const assign of assignments) {
      if (assign.syllabusId) {
        totalChapters += assign.syllabusId.chapters.length;
        const completed = await ChapterProgress.countDocuments({
          schoolId: school_id,
          class: assign.class,
          subject: assign.subject,
          status: "COMPLETED"
        });
        completedChapters += completed;
      }
    }

    const syllabusProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    // Calculate Today's Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      schoolId: school_id,
      date: { $gte: today, $lte: endOfDay }
    });

    let totalStudentsInAttendance = 0;
    let totalPresent = 0;

    attendanceRecords.forEach(att => {
      att.students.forEach(s => {
        totalStudentsInAttendance++;
        if (s.status === "PRESENT") totalPresent++;
      });
    });

    const attendancePercent = totalStudentsInAttendance > 0
      ? Math.round((totalPresent / totalStudentsInAttendance) * 100)
      : 0;

    // Divisional Progress Breakdown
    const divisions = {
      Primary: { grades: ["1", "2", "3", "4", "5"], total: 0, completed: 0 },
      Middle: { grades: ["6", "7", "8"], total: 0, completed: 0 },
      Secondary: { grades: ["9", "10", "11", "12"], total: 0, completed: 0 }
    };

    for (const assign of assignments) {
      if (assign.syllabusId) {
        let div = null;
        if (divisions.Primary.grades.includes(assign.class)) div = divisions.Primary;
        else if (divisions.Middle.grades.includes(assign.class)) div = divisions.Middle;
        else if (divisions.Secondary.grades.includes(assign.class)) div = divisions.Secondary;

        if (div) {
          div.total += assign.syllabusId.chapters.length;
          const completed = await ChapterProgress.countDocuments({
            schoolId: school_id,
            class: assign.class,
            subject: assign.subject,
            status: "COMPLETED"
          });
          div.completed += completed;
        }
      }
    }

    const divisionalProgress = {
      Primary: divisions.Primary.total > 0 ? Math.round((divisions.Primary.completed / divisions.Primary.total) * 100) : 0,
      Middle: divisions.Middle.total > 0 ? Math.round((divisions.Middle.completed / divisions.Middle.total) * 100) : 0,
      Secondary: divisions.Secondary.total > 0 ? Math.round((divisions.Secondary.completed / divisions.Secondary.total) * 100) : 0
    };

    res.json({
      success: true,
      stats: {
        students: studentCount,
        teachers: teacherCount,
        syllabusProgress,
        attendancePercent: attendancePercent || 0,
        divisionalProgress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const schoolId = req.user.school_id;

    const assignments = await SyllabusAssignment.find({
      teacherId,
      schoolId
    }).populate("syllabusId");

    let totalChapters = 0;
    let completedChapters = 0;

    for (const assign of assignments) {
      if (assign.syllabusId) {
        totalChapters += assign.syllabusId.chapters.length;
        const completed = await ChapterProgress.countDocuments({
          schoolId,
          teacherId,
          class: assign.class,
          subject: assign.subject,
          status: "COMPLETED"
        });
        completedChapters += completed;
      }
    }

    const syllabusMastery = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    // Get today's sessions
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const ttTeacher = await TimetableTeacher.findOne({ teacher_id: teacherId });

    // Check if timetable is a Map or Object
    let sessionCount = 0;
    if (ttTeacher?.timetable) {
      if (typeof ttTeacher.timetable.get === 'function') {
        sessionCount = ttTeacher.timetable.get(day)?.length || 0;
      } else {
        sessionCount = ttTeacher.timetable[day]?.length || 0;
      }
    }

    res.json({
      success: true,
      stats: {
        totalSubjects: assignments.length,
        syllabusMastery,
        todaySessions: sessionCount,
        recentActivities: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

