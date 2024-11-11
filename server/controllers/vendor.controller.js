import Vendor from "../models/vendor.schema.js";
import CustomError from "../utils/error.utils.js";

const vendorController = {
  getVendorsByCategories: async (req, res, next) => {
    const { categories } = req.body;

    let query = {};

    if (categories) {
      query.businessCategory = categories;
    }
    console.log(query);
    if (!categories) {
      return next(new CustomError("Query is invalid", 500));
    }
    try {
      const vendors = await Vendor.find(query).select("-vendorPassword");

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
      const vendors = await Vendor.find().select("-vendorPassword");

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
  getVendorsByLocation: async (req, res, next) => {
    try {
      let { nearByLocation } = req.body;
      console.log(nearByLocation);
      if (!nearByLocation) {
        return next(new CustomError("Query is invalid", 500));
      }

      let query = {};

      if (nearByLocation) {
        query.nearByLocation = {
          $regex: new RegExp(`^${nearByLocation}$`, "i"),
        };
      }
      console.log(new RegExp(`^${nearByLocation}$`, "i"));

      const vendors = await Vendor.find(query);
      res.json({ success: true, vendors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
};

export default vendorController;
