import express from "express";
import {
  getOtherUsers,
  getProfile,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middlware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-profile", isAuthenticated, getProfile);
router.get("/get-other-users", isAuthenticated, getOtherUsers);
router.put("/update-profile", isAuthenticated, updateProfile);

export default router;
