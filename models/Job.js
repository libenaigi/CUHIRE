const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    // In models/Job.js

    jobType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "internship"], // <-- Corrected to lowercase
    },
    salary: {
      type: Number,
      min: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      maxlength: 50,
    },
    applicationDeadline: {
      type: Date,
    },
    // ✅ Sets the job to active by default when a new one is created.
    isActive: {
      type: Boolean,
      default: true,
    },
    // ✅ Establishes the link to the User who posted the job.
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  // ✅ Adds `createdAt` and `updatedAt` fields automatically.
  { timestamps: true }
);

// ✅ Adds a text index so you can search by title and description.
// This is required for the `$text` search in your controller.
jobSchema.index({ title: "text", description: "text", skills: "text" });

// ✅ THIS IS THE MOST IMPORTANT LINE.
// It correctly creates and exports the Mongoose model.
module.exports = mongoose.model("Job", jobSchema);
