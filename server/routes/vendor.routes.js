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
  getVendorData,
  vendorContactUs,
  getCustomerList,
} from "../controllers/vendor.controller.js";
import upload from "../middlewares/multer.middleware.js";
const router = express.Router();
router.get("/", isLoggedIn, vendorProfile);
router.put("/update-status/:id", isLoggedIn, updateStatus);
router.get("/allVendors", getVendors);
router.get("/get-vendor-data/:id", isLoggedIn, getVendorData);
router.post("/nearby", getVendorsByLocation);
router.post("/login", login);
router.get("/logout", isLoggedIn, logout);
router.put(
  "/update/:id",
  isLoggedIn,
  upload.single("vendorImage"),
  updateProfile
);
router.post("/contact-us", isLoggedIn, vendorContactUs);
router.get("/customer-list", isLoggedIn, getCustomerList);
router.post("/add-product/:id", isLoggedIn, addProduct);
router.post("/delete-product/:id", isLoggedIn, deleteProduct);
router.post("/change-password", isLoggedIn, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOTP);

export default router;
