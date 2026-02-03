import mongoose from "mongoose";

const chapterProgressSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  class: { type: String, required: true },
  subject: { type: String, required: true },
  chapterNo: { type: Number, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
    default: "NOT_STARTED"
  },
  completionDate: { type: Date },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.model("ChapterProgress", chapterProgressSchema);
