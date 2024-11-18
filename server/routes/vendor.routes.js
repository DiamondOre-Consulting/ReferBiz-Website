import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import {
  login,
  logout,
  getVendorsByLocation,
  getVendors,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyOTP,
  vendorProfile,
  addProduct,
  deleteProduct,
  updateStatus,
} from "../controllers/vendor.controller.js";
import upload from "../middlewares/multer.middleware.js";
const router = express.Router();
router.get("/", isLoggedIn, vendorProfile);
router.put("/update-status/:id", updateStatus);
router.get("/allVendors", getVendors);
router.post("/nearby", getVendorsByLocation);
router.post("/login", login);
router.get("/logout", isLoggedIn, logout);
router.put(
  "/update/:id",
  isLoggedIn,
  upload.single("vendorImage"),
  updateProfile
);
router.post("/add-product", isLoggedIn, addProduct);
router.post("/delete-product", isLoggedIn, deleteProduct);
router.post("/change-password", isLoggedIn, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOTP);

export default router;
