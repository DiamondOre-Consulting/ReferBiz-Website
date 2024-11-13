import express from "express";
import vendorController from "../controllers/vendor.controller.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/allVendors", vendorController.getVendors);
router.post("/categories", vendorController.getVendorsByCategories);
router.post("/nearby", vendorController.getVendorsByLocation);
router.post("/login", vendorController.login);
router.get("/logout", isLoggedIn, vendorController.logout);

export default router;
