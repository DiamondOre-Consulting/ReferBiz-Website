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
  addPayment,
  getReferralList,
  userContactUs,
  giveReviewToVendor,
  getPurchaseHistory,
} from "../controllers/auth.controller.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
const router = Router();
router.post("/register", register);
router.post("/add-payment/:vendorId", isLoggedIn, addPayment);
router.post("/login", login);
router.get("/logout", logout);
router.get("/", isLoggedIn, profile);
router.put(
  "/update/:id",
  isLoggedIn,
  upload.single("userImage"),
  updateProfile
);
router.post("/rating/:vendorId", isLoggedIn, giveReviewToVendor);
router.post("/user-contact-us", userContactUs);
router.get("/referral-list", isLoggedIn, getReferralList);
router.post("/change-password", isLoggedIn, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOTP);
router.get(
  "/search-vendor-category/:location/:category",
  searchVendorsByCategory
);
router.get(
  "/search-vendor-subcategory/:location/:category/:item",
  searchVendorsBySubCategory
);

router.get("/get-allCategories/:location", getAllCategories);
router.get("/get-subCategory/:location/:category", getItemsByCategory);
router.get("/get-purchase-history/:vendorId", isLoggedIn, getPurchaseHistory);

export default router;
