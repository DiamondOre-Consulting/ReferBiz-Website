import {
  vendorRegister,
  adminLogin,
  adminRegister,
  updateProfile,
  forgotPassword,
  verifyOTP,
  changePassword,
  profile,
  logout,
  usersList,
  vendorsList,
} from "../controllers/admin.controller.js";
import express from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/vendor-register", isLoggedIn, vendorRegister);
router.post("/login", adminLogin);
router.post("/register", adminRegister);
router.get("/logout", isLoggedIn, logout);
router.get("/", isLoggedIn, profile);
router.put("/update/:id", isLoggedIn, updateProfile);
router.post("/change-password", isLoggedIn, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOTP);
router.get('/user-list', isLoggedIn, usersList)
router.get('/vendor-list', isLoggedIn, vendorsList)


export default router;
