import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    return next(new errorHandler("Authentication token required", 401));
  }

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = tokenData;
    next();
  } catch {
    return next(new errorHandler("Invalid or expired token", 401));
  }
});
