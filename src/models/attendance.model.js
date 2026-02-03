import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  class: { type: String, required: true },
  subject: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  chapterNo: { type: Number },
  students: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Changed ref to Student potentially? Keeping User for now as per previous context
    status: { type: String, enum: ["PRESENT", "ABSENT"], required: true }
  }]
}, { timestamps: true });

attendanceSchema.index({ schoolId: 1, class: 1, subject: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
