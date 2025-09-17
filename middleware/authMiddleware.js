const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // match the payload key used in login/register
    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.isActive === false) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({
      message:
        err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
    });
  }
};

module.exports = { authenticateToken };
