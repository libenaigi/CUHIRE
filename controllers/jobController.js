// ✅ THIS IS THE MOST IMPORTANT LINE.
// It correctly imports the Job model from your models file.
const Job = require("../models/Job");
console.log("Imported Job Model:", Job);
// Create a new job
const createJob = async (req, res) => {
  try {
    // Securely set the job's author to the currently logged-in user
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    console.error("CreateJob Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all jobs (with optional filtering)
const getJobs = async (req, res) => {
  try {
    const { search, location, jobType, skills } = req.query;
    const filter = { isActive: true }; // Default to only showing active jobs

    if (search) filter.$text = { $search: search };
    if (location) filter.location = { $regex: location, $options: "i" }; // Case-insensitive
    if (jobType) filter.jobType = jobType;
    if (skills) filter.skills = { $in: skills.split(",").map((s) => s.trim()) };

    const jobs = await Job.find(filter).populate(
      "postedBy",
      "name company" // Populate with recruiter's name and company
    );

    res.json({ success: true, data: jobs });
  } catch (err) {
    console.error("GetJobs Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single job by its ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name company"
    );

    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, data: job });
  } catch (err) {
    console.error("GetJobById Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (!job.postedBy.equals(req.user.id)) {
      return res
        .status(403)
        .json({ success: false, message: "User not authorized" });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ success: true, data: job });
  } catch (err) {
    console.error("UpdateJob Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Deactivate a job (soft delete)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (!job.postedBy.equals(req.user.id)) {
      return res
        .status(403)
        .json({ success: false, message: "User not authorized" });
    }

    job.isActive = false;
    await job.save();

    res.json({ success: true, message: "Job has been deactivated" });
  } catch (err) {
    console.error("DeleteJob Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
