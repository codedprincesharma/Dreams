import mongoose from "mongoose";

const syllabusAssignmentSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  class: { type: String, required: true },
  subject: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Teacher User ID
  syllabusId: { type: mongoose.Schema.Types.ObjectId, ref: "Syllabus", required: true }, // Link to Master Syllabus
  academicYear: { type: String, required: true }, // e.g., "2025-2026"
  assignedAt: { type: Date, default: Date.now }
});

// Ensure one teacher per subject per class in a school for an academic year (optional rule, but good for data integrity)
syllabusAssignmentSchema.index({ schoolId: 1, class: 1, subject: 1, academicYear: 1 }, { unique: true });

export default mongoose.model("SyllabusAssignment", syllabusAssignmentSchema);
