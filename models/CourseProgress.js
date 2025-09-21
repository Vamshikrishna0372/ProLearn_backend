import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedVideos: { type: [Number], default: [] }, // indexes of completed videos
    currentProgress: { type: Number, default: 0 }, // percentage
    lastWatched: { type: Number, default: null }, // last video index
    certificateIssued: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CourseProgress", courseProgressSchema);
