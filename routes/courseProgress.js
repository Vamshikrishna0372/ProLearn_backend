import express from "express";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/Course.js";

const router = express.Router();

// ✅ Get progress for a user + course
router.get("/:userId/:courseId", async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({ userId, courseId });
      await progress.save();
    }

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Update progress (mark video completed)
router.post("/update", async (req, res) => {
  try {
    const { userId, courseId, videoIndex } = req.body;

    if (videoIndex === undefined) {
      return res.status(400).json({ success: false, message: "videoIndex is required" });
    }

    // Find course to get total videos
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Find or create progress
    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({ userId, courseId, completedVideos: [] });
    }

    // Add videoIndex if not already completed
    if (!progress.completedVideos.includes(videoIndex)) {
      progress.completedVideos.push(videoIndex);
    }

    // Update last watched and progress %
    progress.lastWatched = videoIndex;
    const totalVideos = course.videos.length || 1; // avoid divide by zero
    progress.currentProgress = Math.round(
      (progress.completedVideos.length / totalVideos) * 100
    );

    await progress.save();
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Mark certificate issued
router.patch("/certificate", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOneAndUpdate(
      { userId, courseId },
      { certificateIssued: true },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ success: false, message: "Progress not found" });
    }

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
