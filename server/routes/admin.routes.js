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
  addCategoriesAndSubcategoryByCsv,
  addCategoriesCsv,
  addSubcategoriesByCsv,
  getVendorData,
  updateVendor,
  updateStatus,
} from "../controllers/admin.controller.js";
import express from "express";

import isLoggedIn from "../middlewares/auth.middleware.js";
import {
  addCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import upload from "../middlewares/multer.middleware.js";
const router = express.Router();

router.post(
  "/vendor-register",
  isLoggedIn,
  upload.fields([
    { name: "vendorImage", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  vendorRegister
);
router.post(
  "/update-vendor",
  isLoggedIn,
  upload.fields([
    { name: "vendorImage", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  updateVendor
);
router.put("/update-status/:id", isLoggedIn, updateStatus);
router.post(
  "/upload",
  upload.single("file"),
  isLoggedIn,
  addCategoriesAndSubcategoryByCsv
);
router.post(
  "/upload-category",
  upload.single("file"),
  isLoggedIn,
  addCategoriesCsv
);
router.post(
  "/upload-subcategory/:id",
  upload.single("file"),
  isLoggedIn,
  addSubcategoriesByCsv
);

router.get("/vendor-data/:id", isLoggedIn, getVendorData);
router.post("/login", adminLogin);
router.post("/register", adminRegister);
router.get("/logout", isLoggedIn, logout);
router.get("/", isLoggedIn, profile);
router.put("/update/:id", isLoggedIn, updateProfile);
router.post("/change-password", isLoggedIn, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOTP);
router.get("/user-list", isLoggedIn, usersList);
router.get("/vendor-list", isLoggedIn, vendorsList);
router.get("/category-list", isLoggedIn, getAllCategory);
router.post("/add-category", isLoggedIn, addCategory);

router.delete("/delete-category/:id", isLoggedIn, deleteCategory);
router.put("/update-category/:id", isLoggedIn, updateCategory);
router.put("/delete-subCategory/:id", isLoggedIn, deleteSubCategory);
router.put("/category/:id", isLoggedIn, getCategory);

export default router;
