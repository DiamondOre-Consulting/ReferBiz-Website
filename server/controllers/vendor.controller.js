const Vendor = require("../models/vendor.schema");

const vendorController = {
  getVendorsByCategories: async (req, res) => {
    const { categories } = req.body;

    let query = {};

    if (categories) {
      query.businessCategory = categories;
    }
    console.log(query);
    try {
      const vendors = await Vendor.find(query).select("-venderPassword");

      res.status(200).json({
        success: true,
        count: vendors.length,
        data: vendors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error finding vendors by categories",
        error: error.message,
      });
    }
  },
  getVendors: async (req, res) => {
    try {
      const vendors = await Vendor.find().select("-venderPassword");

      res.status(200).json({
        success: true,
        count: vendors.length,
        data: vendors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error finding vendors by categories",
        error: error.message,
      });
    }
  },
  getVendorsByLocation: async (req, res) => {
    try {
      const { nearbyLocation } = req.body;

      let query = {};

      if (nearbyLocation) {
        query.nearByLocation = nearbyLocation; // Case-insensitive search for location
      }
      console.log(query);

      // Execute the query
      const vendors = await Vendor.find(query);
      res.json({ success: true, vendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
};

module.exports = vendorController;
