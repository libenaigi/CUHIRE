const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Make sure this path is correct

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    // Get user data from the request body, validated by express-validator
    const { name, email, password, role, company } = req.body;

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create the new user instance.
    // The plain-text password is provided here. The hashing is handled
    // automatically by the pre('save') hook in your userModel.js.
    const user = new User({
      name,
      email,
      password, // <-- This is the key fix: pass the plain-text password
      role,
      company,
    });

    // Save the user to the database
    await user.save();

    // Send a success response (the toJSON method in the model will remove the password)
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * @desc    Authenticate a user and return a token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    // Get credentials from the request body
    const { email, password, role } = req.body;

    console.log(`Login attempt for: { email: "${email}", role: "${role}" }`);

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`LOGIN FAIL: User with email '${email}' not found.`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Use the .comparePassword() method from your userModel to check the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`LOGIN FAIL: Password mismatch for user '${email}'.`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the user's role matches
    if (user.role !== role) {
      console.log(
        `LOGIN FAIL: Role mismatch for '${email}'. Expected '${role}', but user's role is '${user.role}'.`
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JSON Web Token (JWT)
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log(`LOGIN SUCCESS: User '${email}' logged in as '${role}'.`);

    // Send a success response with the token and user data
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// This line is crucial and fixes the server crash.
module.exports = { register, login };
