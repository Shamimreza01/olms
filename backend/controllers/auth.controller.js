import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  accessCookieOptions,
  clearCookieOptions,
  refreshCookieOptions,
} from "../configs/cookie.config.js";
import Setting from "../models/setting.model.js";
import User from "../models/user.model.js";
import getUserStatus from "../utils/getUserStatus.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenManagementHelper.js";

const verifySecretCode = async (plaintext, hashed) => {
  if (!plaintext || !hashed) return false;
  if (hashed.startsWith("$2b$") || hashed.startsWith("$2a$")) {
    return await bcrypt.compare(plaintext, hashed);
  }
  return plaintext === hashed;
};

export const studentRegistration = async (req, res) => {
  try {
    const { name, email, password, classId } = req.body;

    const setting = await Setting.findOne();
    if (setting && setting.studentRegistration === false) {
      return res.status(403).json({
        message: "Student registration is currently disabled by administrator.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
      currentStatus: "pending",
      classId: classId || null,
    });

    await user.save();

    res.status(201).json({
      message: "Student registered successfully. Awaiting admin approval.",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const teacherRegistration = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    const setting = await Setting.findOne();
    if (setting && setting.teacherRegistration === false) {
      return res.status(403).json({
        message: "Teacher registration is currently disabled by administrator.",
      });
    }

    if (setting && setting.teacherSecretKey) {
      const isSecretKeyValid = await verifySecretCode(
        secretKey,
        setting.teacherSecretKey,
      );
      if (!isSecretKeyValid) {
        return res
          .status(400)
          .json({ message: "Invalid teacher registration secret key" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      currentStatus: "pending",
    });

    await user.save();

    res.status(201).json({
      message: "Teacher registered successfully. Awaiting admin approval.",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const statusCheck = getUserStatus(user);
    if (statusCheck) {
      return res
        .status(statusCheck.status)
        .json({ message: statusCheck.message });
    }

    const accessToken = generateAccessToken(user);
    console.log("Access Token:", accessToken); // Log the access token for debugging
    const refreshToken = generateRefreshToken(user._id);
    console.log("Refresh Token:", refreshToken); // Log the refresh token for debugging
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refreshTokenHash = hashedRefreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.refreshTokenHash = null;
        await user.save();
      }
    }

    res.clearCookie("accessToken", clearCookieOptions);
    res.clearCookie("refreshToken", clearCookieOptions);

    res.json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(404).json({ message: "User not found." });
    }
    const user = await User.findById(userId).populate("classId");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const statusCheck = getUserStatus(user);
    if (statusCheck) {
      return res
        .status(statusCheck.status)
        .json({ message: statusCheck.message });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentStatus: user.currentStatus,
        class: user.classId || null,
        className: user.classId?.name || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "You are not authenticated." });
  }
  try {
    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_key_123",
    );
    const user = await User.findById(decode.id).select("+refreshTokenHash");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const statusCheck = getUserStatus(user);
    if (statusCheck) {
      return res
        .status(statusCheck.status)
        .json({ message: statusCheck.message });
    }

    if (!user.refreshTokenHash) {
      return res.status(401).json({ message: "Please login again." });
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user._id);
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    user.refreshTokenHash = hashedNewRefreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.status(200).json({ message: "Access token refreshed." });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token." });
  }
};
