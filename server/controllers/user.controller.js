import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { io } from "../socket/socket.js";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const days = Number(process.env.COOKIE_EXPIRES) || 2;
  return {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

export const register = asyncHandler(async (req, res, next) => {
  const { fullName, username, password, gender } = req.body;

  if (!fullName || !username || !password || !gender) {
    return next(new errorHandler("All fields are required", 400));
  }

  const user = await User.findOne({ username });
  if (user) {
    return next(new errorHandler("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const avatarType = gender === "male" ? "boy" : "girl";
  const avatar = `https://avatar.iran.liara.run/public/${avatarType}?username=${username}`;

  const newUser = await User.create({
    username,
    fullName,
    password: hashedPassword,
    gender,
    avatar,
  });

  const tokenData = {
    _id: newUser?._id,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "2d",
  });

  const userObj = newUser.toObject();
  delete userObj.password;

  res
    .status(200)
    .cookie("token", token, getCookieOptions())
    .json({
      success: true,
      responseData: {
        user: userObj,
        newUser: userObj,
        token,
      },
    });
});

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  const user = await User.findOne({ username });
  if (!user) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  const tokenData = {
    _id: user?._id,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "2d",
  });

  const userObj = user.toObject();
  delete userObj.password;

  res
    .status(200)
    .cookie("token", token, getCookieOptions())
    .json({
      success: true,
      responseData: {
        user: userObj,
        token,
      },
    });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const profile = await User.findById(userId).select("-password");
  if (!profile) {
    return next(new errorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    responseData: profile,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    })
    .json({
      success: true,
      message: "Logout successfull!",
    });
});

export const getOtherUsers = asyncHandler(async (req, res, next) => {
  const otherUsers = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.status(200).json({
    success: true,
    responseData: otherUsers,
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { fullName, username, avatar, currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  // If username changed, verify uniqueness
  if (username && username.trim() !== user.username) {
    const existingUser = await User.findOne({
      username: username.trim(),
      _id: { $ne: userId },
    });
    if (existingUser) {
      return next(new errorHandler("Username is already taken", 400));
    }
    user.username = username.trim();
  }

  // If password change is requested
  if (newPassword) {
    if (!currentPassword) {
      return next(
        new errorHandler("Current password is required to change password", 400)
      );
    }
    if (newPassword.length < 6) {
      return next(
        new errorHandler("New password must be at least 6 characters long", 400)
      );
    }
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(new errorHandler("Current password is incorrect", 400));
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  // Update fullName if provided
  if (fullName && fullName.trim()) {
    user.fullName = fullName.trim();
  }

  // Update avatar if provided
  if (avatar && avatar.trim()) {
    user.avatar = avatar.trim();
  }

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  // Real-time broadcast so contacts list & active chat headers update live
  io.emit("userUpdated", userObj);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully!",
    responseData: userObj,
  });
});
