const express = require("express");
const { param } = require("express-validator");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRecruiter } = require("../middleware/roleMiddleware");

// ✅ Correctly import validators from your 'middleware/validation.js' file
const {
  validateJobCreation,
  validateJobUpdate,
} = require("../middleware/validation");

const router = express.Router();

// ✅ Define the error handling function directly in this file
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// ---------------- Public Routes ----------------
router.get("/", getJobs);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid job ID")],
  handleValidationErrors,
  getJobById
);

// ---------------- Protected Recruiter Routes ----------------
router.post(
  "/",
  authenticateToken,
  requireRecruiter,
  validateJobCreation,
  handleValidationErrors,
  createJob
);

router.put(
  "/:id",
  authenticateToken,
  requireRecruiter,
  [param("id").isMongoId().withMessage("Invalid job ID"), ...validateJobUpdate],
  handleValidationErrors,
  updateJob
);

router.delete(
  "/:id",
  authenticateToken,
  requireRecruiter,
  [param("id").isMongoId().withMessage("Invalid job ID")],
  handleValidationErrors,
  deleteJob
);

module.exports = router;
