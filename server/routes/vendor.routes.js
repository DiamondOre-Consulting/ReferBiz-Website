import express from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import {
  login,
  logout,
  getVendorsByCategories,
  getVendorsByLocation,
  getVendors,
} from "../controllers/vendor.controller.js";
const router = express.Router();
router.get("/allVendors", getVendors);
router.post("/categories", getVendorsByCategories);
router.post("/nearby", getVendorsByLocation);
router.post("/login", login);
router.get("/logout", isLoggedIn, logout);

export default router;
