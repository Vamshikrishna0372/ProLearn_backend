import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

/**
 * 🔹 Normalize YouTube URLs into EMBED format
 */
function normalizeYouTubeUrl(url) {
  if (!url) return url;
  try {
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  } catch {
    return url;
  }
}

// ✅ Add new course
router.post("/", async (req, res) => {
  try {
    let data = req.body;

    if (data.videos && data.videos.length > 0) {
      data.videos = data.videos.map((v, i) => ({
        index: i,
        title: v.title,
        url: normalizeYouTubeUrl(v.url),
      }));
    }

    const course = new Course(data);
    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Update course (Edit)
router.put("/:id", async (req, res) => {
  try {
    let data = req.body;

    if (data.videos && data.videos.length > 0) {
      data.videos = data.videos.map((v, i) => ({
        index: i,
        title: v.title,
        url: normalizeYouTubeUrl(v.url),
      }));
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, course: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Delete course
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
