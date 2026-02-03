import mongoose from "mongoose";

const masterLessonSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    week: {
      type: Number,
      required: true,
      min: 1,
      max: 52,
    },
    lessons: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// 🔐 One master lesson per class + subject + week
masterLessonSchema.index(
  { class: 1, subject: 1, week: 1 },
  { unique: true }
);

export default mongoose.model("MasterLessonPlan", masterLessonSchema);
