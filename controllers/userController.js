const User = require("../models/User");

const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // fetch user from DB, excluding password
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      appliedJobs: user.appliedJobs || [],
      savedJobs: user.savedJobs || [],
      profileViews: user.profileViews || 0,
      notifications: user.notifications || [],
      recommendedJobs: user.recommendedJobs || [],
    });
  } catch (err) {
    console.error("getMe Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMe };
