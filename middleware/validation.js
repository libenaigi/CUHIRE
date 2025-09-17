const { body, param, query } = require("express-validator");

// Job creation validation
const validateJobCreation = [
  body("title")
    .trim() // <-- Sanitize: remove whitespace
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 })
    .withMessage("Job title cannot exceed 100 characters"),

  body("description")
    .trim() // <-- Sanitize: remove whitespace
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("location")
    .trim() // <-- Sanitize: remove whitespace
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),

  body("salary")
    .optional()
    .isNumeric()
    .withMessage("Salary must be a number")
    .isFloat({ min: 0 })
    .withMessage("Salary cannot be negative"),

  body("jobType")
    .trim() // <-- Sanitize: remove whitespace
    .toLowerCase() // <-- Sanitize: ensure consistent case
    .notEmpty()
    .withMessage("Job type is required")
    .isIn(["full-time", "part-time", "internship"])
    .withMessage(
      "Invalid job type (must be full-time, part-time, or internship)"
    ),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array of strings")
    .custom((skills) => {
      if (
        !skills.every(
          (s) => typeof s === "string" && s.trim().length > 0 && s.length <= 50
        )
      ) {
        throw new Error(
          "Each skill must be a non-empty string with max length 50"
        );
      }
      return true;
    }),

  body("experience")
    .optional()
    .trim() // <-- Sanitize: remove whitespace
    .isString()
    .withMessage("Experience must be a string")
    .isLength({ max: 50 })
    .withMessage("Experience cannot exceed 50 characters"),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format for applicationDeadline"),
];

// Job update validation (same rules, but all optional and sanitized)
const validateJobUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Job title cannot exceed 100 characters"),

  // ... (similar sanitization for other update fields)

  body("jobType")
    .optional()
    .trim()
    .toLowerCase()
    .isIn(["full-time", "part-time", "internship"])
    .withMessage("Invalid job type"),

  // ...
];

// Validate ObjectId params (no changes needed, this is perfect)
const validateObjectId = (paramName) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
];

// Query param validation (for search/filter)
const validateQueryParams = [
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("location")
    .optional()
    .trim()
    .isString()
    .withMessage("Location must be a string"),
  query("jobType")
    .optional()
    .trim()
    .toLowerCase()
    .isIn(["full-time", "part-time", "internship"])
    .withMessage("Invalid job type"),
  query("skills")
    .optional()
    .trim()
    .isString()
    .withMessage("Skills must be a comma-separated string"),
];

module.exports = {
  validateJobCreation,
  validateJobUpdate,
  validateObjectId,
  validateQueryParams,
};
