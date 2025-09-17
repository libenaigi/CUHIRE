const requireRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const userRole = (req.user.role || "").toLowerCase().trim();

  if (!roles.includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  next();
};

const requireRecruiter = requireRole(["recruiter"]);
const requireJobSeeker = requireRole(["jobseeker"]);

module.exports = { requireRole, requireRecruiter, requireJobSeeker };
