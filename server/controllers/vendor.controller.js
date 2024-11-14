import Vendor from "../models/vendor.schema.js";
import CustomError from "../utils/error.utils.js";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utils/email.utils.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

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
    const user = await Vendor.findById(userId);
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

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!oldPassword || !newPassword) {
      return next(new CustomError("All fields are required", 400));
    }

    if (oldPassword === newPassword) {
      return next(new CustomError("New password is same as old password", 400));
    }

    const user = await Vendor.findById(id).select("+password");

    if (!user) {
      return next(new CustomError("User does not exist", 400));
    }

    // const passwordValid = await user.comparePassword(oldPassword);

    if (user.vendorPassword != oldPassword) {
      return next(new CustomError("Old Password is wrong", 400));
    }

    user.vendorPassword = await newPassword;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Password Changed successfully",
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { shopName, fullAddress, phoneNumber, fullName } = req.body;
    const { id } = req.params;

    const user = await Vendor.findById(id);

    if (!user) {
      return next(new CustomError("User does not exist", 400));
    }

    if (fullName) {
      user.fullName = await fullName;
    }
    if (phoneNumber) {
      user.phoneNumber = await phoneNumber;
    }

    if (shopName) {
      user.shopName = await shopName;
    }
    if (fullAddress) {
      user.fullAddress = await fullAddress;
    }
    if (req.file) {
      if (user.vendorImage.publicId) {
        await cloudinary.v2.uploader.destroy(user.vendorImage.publicId);
      }

      try {
        console.log(req.file.path);

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Referbiz",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          user.vendorImage.publicId = result.public_id;
          user.vendorImage.secure_url = result.secure_url;

          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (err) {
        return next(new CustomError("File can not get uploaded", 500));
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor Detail updated successfully",
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { vendorEmail } = req.body;

  if (!vendorEmail) {
    return next(new CustomError("Email is Required", 400));
  }

  const user = await Vendor.findOne({ vendorEmail });

  if (!user) {
    return next(new CustomError("Email is not registered", 400));
  }

  const uuid = uuidv4();

  const otp = uuid.replace(/\D/g, "").slice(0, 4);
  user.otp = await otp;
  user.otpExpiry = (await Date.now()) + 2 * 60 * 1000;

  await user.save();

  // const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = "🔒 Password Reset Request";
  const message = `
 <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="width: 100%; max-width: 24rem; background-color: #f4f4f4; border-radius: 8px; padding: 20px; box-sizing: border-box; color-scheme: light dark; background-color: #ffffff; background-color: #1a1a1a;">
  <tr>
    <td style="text-align: center; padding: 20px 0;">
      
      <img src="https://img.icons8.com/ios-filled/50/0074f9/lock.png" alt="Lock Icon" style="width: 40px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">

      <p style="font-size: 1.2rem; font-weight: bold; margin: 0; color: #000000; color: #ffffff;">
        Hello, <span style="color: #0074f9;">${user.fullName}</span>
      </p>

      <p style="font-weight: 400; text-align: center; margin: 20px 0; color: #555555; color: #cccccc;">
        It seems you’ve requested to reset your password. Let’s get you back on track! Use this OTP
      </p>

     <p style="font-weight: 400; text-align: center; margin: 20px 0; color: #555555; color: #cccccc;">
        <strong>${otp}</strong>
      </p>

      <p style="font-weight: 400; text-align: center; margin: 20px 0; color: #555555; color: #cccccc;">
        If you did not request a password reset, no worries—just ignore this Email, and your password will remain unchanged.
      </p>

      <div style="text-align: center; margin-top: 20px;">
        <p style="margin: 0; font-size: 1rem; color: #000000; color: #ffffff;">
          Stay safe,
        </p>

        <img src="https://img.icons8.com/ios-filled/50/0074f9/shield.png" alt="Shield Icon" style="width: 30px; margin: 10px 0;">
        <p style="margin: 0; color: #0074f9; font-weight: bold;">Refer Biz</p>
        <p style="margin: 0; color: #555555; color: #cccccc;">Support Team</p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="" style="text-decoration: none; margin: 0 10px;">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/facebook.png" alt="Facebook" style="width: 25px; display: inline-block;">
        </a>
        <a href="" style="text-decoration: none; margin: 0 10px;">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/x.png" alt="X (formerly Twitter)" style="width: 25px; display: inline-block;">
        </a>
        <a href="" style="text-decoration: none; margin: 0 10px;">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/instagram.png" alt="Instagram" style="width: 25px; display: inline-block;">
        </a>
        <a href="" style="text-decoration: none; margin: 0 10px;">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/linkedin.png" alt="LinkedIn" style="width: 25px; display: inline-block;">
        </a>
      </div>

    </td>
  </tr>
</table>`;

  try {
    await sendEmail(vendorEmail, subject, message);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully !",
    });
  } catch (e) {
    await user.save();
    return next(new CustomError(e.message, 500));
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { vendorEmail, otp, newPassword } = req.body;

    if (!vendorEmail) {
      return next(new CustomError("Email is Required", 400));
    }

    if (!otp) {
      return next(new CustomError("OTP is required", 400));
    }

    if (!newPassword) {
      return next(new CustomError("New password is required", 400));
    }

    const user = await Vendor.findOne({ vendorEmail });

    if (!user) {
      return next(new CustomError("Email is not registered", 400));
    }
    console.log(user, "sdf", otp);
    if (user.otp == otp) {
      if (Date.now() < user.otpExpiry) {
        user.vendorPassword = await newPassword;
      } else {
        return next(new CustomError("OTP is expired! Resend OTP"));
      }
    } else {
      return next(new CustomError("OTP is wrong!"));
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

export {
  login,
  logout,
  getVendorsByCategories,
  getVendors,
  getVendorsByLocation,
  forgotPassword,
  vendorProfile,
  updateProfile,
  changePassword,
  verifyOTP,
};
