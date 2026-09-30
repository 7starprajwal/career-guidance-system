const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ============================================================
// REGISTER
// ============================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    const token =
      generateToken(user);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage:
          user.profileImage,
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during registration",
    });
  }
};

// ============================================================
// LOGIN
// ============================================================

const login = async (req, res) => {
  const startTime = Date.now();

  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // --------------------------------------------------------
    // FIND USER
    // --------------------------------------------------------

    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select("+password");

    const afterDatabase =
      Date.now();

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // --------------------------------------------------------
    // CHECK PASSWORD
    // --------------------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    const afterPassword =
      Date.now();

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // --------------------------------------------------------
    // GENERATE TOKEN
    // --------------------------------------------------------

    const token =
      generateToken(user);

    const totalTime =
      Date.now() - startTime;

    console.log(
      `Login timing | DB: ${
        afterDatabase - startTime
      }ms | Password: ${
        afterPassword - afterDatabase
      }ms | Total: ${totalTime}ms`
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage:
          user.profileImage,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login",
    });
  }
};

// ============================================================
// GET CURRENT USER
// ============================================================

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,

      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profileImage:
          req.user.profileImage,
      },
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch current user",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};