import {
  register,
  login,
  logout,
  profile,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyOTP,
  searchVendorsByCategory,
  searchVendorsBySubCategory,
  getAllCategories,
  getItemsByCategory,
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
router.post("/change-password", isLoggedIn, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOTP);
router.post("/search-vendor-catagory", isLoggedIn, searchVendorsByCategory);
router.post(
  "/search-vendor-subcatagory",
  isLoggedIn,
  searchVendorsBySubCategory
);
router.get("/get-allCatagories", isLoggedIn, getAllCategories);
router.get("/get-subCatagory/:catagory", isLoggedIn, getItemsByCategory);

export default router;
