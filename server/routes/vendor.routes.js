const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");

router.get("/allVendors", vendorController.getVendors);
router.post("/categories", vendorController.getVendorsByCategories);
router.post("/nearby", vendorController.getVendorsByLocation);

module.exports = router;
