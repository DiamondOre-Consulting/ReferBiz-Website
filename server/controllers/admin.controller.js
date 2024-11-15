import Vendor from "../models/vendor.schema.js";
import CustomError from "../utils/error.utils.js";
const cookieOption = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  // sameSite: "None",
};

const vendorRegister = async (req, res, next) => {
  try {
    const {
      fullName,
      vendorEmail,
      vendorPassword,
      shopName,
      nearByLocation,
      phoneNumber,
      fullAddress,
    } = req.body;

    if (
      !shopName ||
      !fullName ||
      !vendorEmail ||
      !vendorPassword ||
      !nearByLocation ||
      !phoneNumber ||
      !fullAddress
    ) {
      return next(new CustomError("All Fields are required", 400));
    }

    const uniqueEmail = await Vendor.findOne({ vendorEmail });
    if (uniqueEmail) {
      return next(new CustomError("Email is already registered", 400));
    }

    console.log(1);

    const user = await Vendor.create({
      fullName,
      vendorEmail,
      vendorPassword,
      shopName,
      nearByLocation,
      phoneNumber,
      fullAddress,
    });

    if (!user) {
      return next(new CustomError("Registration Failed!", 400));
    }
    console.log(3);

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOption);
    await user.save();
    user.vendorPassword = undefined;
    res.status(201).json({
      success: true,
      message: "Registered Successfully",
      user,
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};

export { vendorRegister };
