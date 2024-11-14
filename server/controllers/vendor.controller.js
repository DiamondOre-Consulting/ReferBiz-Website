import Vendor from "../models/vendor.schema.js";
import CustomError from "../utils/error.utils.js";

const cookieOption = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  // sameSite: "None",
};

const login = async (req, res, next) => {
  try {
    const { vendorEmail, vendorPassword } = req.body;

    if (!vendorEmail || !vendorPassword) {
      return next(new CustomError("Email and Password is required", 400));
    }

    const vendor = await Vendor.findOne({
      vendorEmail,
    }).select("+vendorPassword");

    if (!vendor) {
      return next(new CustomError("Email is not registered", 401));
    }

    // const passwordCheck = await vendor.comparePassword(vendorPassword);
    if (vendor.vendorPassword !== vendorPassword) {
      return next(new CustomError("Password is wrong", 400));
    }

    const token = await vendor.generateJWTToken();
    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "Login Successfull!",
      vendor,
      token,
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};
const logout = async (req, res, next) => {
  const token = "";
  const cookiesOption = {
    logoutAt: new Date(),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  try {
    res.cookie("token", token, cookiesOption);
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
const getVendorsByCategories = async (req, res, next) => {
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
    if (vendors.length === 0) {
      return next(
        new CustomError("Vendors are not listed for this catagory", 500)
      );
    }

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
};
const getVendors = async (req, res) => {
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
};
const getVendorsByLocation = async (req, res, next) => {
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
    if (vendors.length === 0) {
      return next(
        new CustomError("Vendors are not listed for this location", 500)
      );
    }
    res.json({ success: true, vendors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const vendorProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    console.log(user);
    res.status(200).json({
      success: true,
      message: "",
      user,
    });
  } catch (err) {
    return next(new CustomError("Failed to fetch" + err.message, 500));
  }
};

export {
  login,
  logout,
  getVendorsByCategories,
  getVendors,
  getVendorsByLocation,
};
