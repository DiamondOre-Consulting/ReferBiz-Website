import {
  register,
  login,
  logout,
  profile,
  updateProfile,
} from "../controllers/auth.controller.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/", isLoggedIn, profile);
router.put(
  "/update/:id",
  isLoggedIn,
  upload.single("userImage"),
  updateProfile
);

export default router;
