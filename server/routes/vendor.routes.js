import express from "express";
import vendorController from "../controllers/vendor.controller.js";

const router = express.Router();
router.get("/allVendors", vendorController.getVendors);
router.post("/categories", vendorController.getVendorsByCategories);
router.post("/nearby", vendorController.getVendorsByLocation);

export default router;
