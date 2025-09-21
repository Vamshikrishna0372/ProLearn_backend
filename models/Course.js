import mongoose from "mongoose";

// Schema for each video
const videoSchema = new mongoose.Schema({
  index: { type: Number }, // store index for easy tracking
  title: { type: String, required: true },
  url: { type: String, required: true }, // embed link
});

// Main course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  level: { type: String, default: "Beginner" },
  thumbnail: { type: String },
  instructor: { type: String, required: true },
  videos: [videoSchema],
  price: { type: String, default: "Free" },
  active: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  duration: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Course", courseSchema);
