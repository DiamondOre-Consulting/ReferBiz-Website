import User from "../models/user.schema.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import cloudinary from "cloudinary";
import CustomError from "../utils/error.utils.js";
import sendEmail from "../utils/email.utils.js";
import Vendor from "../models/vendor.schema.js";
const cookieOption = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  // sameSite: "None",
};

const register = async (req, res, next) => {
  try {
    let referredBy;
    const { fullName, userEmail, userPassword, referralCode, phoneNumber } =
      req.body;

    if (!fullName || !userEmail || !userPassword) {
      return next(new CustomError("All Fields are required", 400));
    }

    let namePart = fullName.substring(0, 3).toUpperCase();
    let uuidPart = uuidv4().replace(/-/g, "").substring(0, 4);
    const customUID = `${namePart}${uuidPart}`;
    console.log(customUID);

    console.log(1);
    if (referralCode) {
      const referedUser = await User.findOne({ referralCode });
      if (referedUser) {
        referredBy = referedUser._id;
      } else {
        return next(new CustomError("Your referal code is invalid", 400));
      }
    }
    console.log(2);

    const uniqueEmail = await User.findOne({ userEmail });
    if (uniqueEmail) {
      return next(new CustomError("Email is already registered", 400));
    }

    console.log(1);

    const user = await User.create({
      fullName,
      userEmail,
      userPassword,
      referralCode: customUID,
      phoneNumber: phoneNumber && phoneNumber,
      referredBy: referredBy && referredBy,
      userImage: {
        publicId: "",
        secure_url: "",
      },
    });

    if (!user) {
      return next(new CustomError("Registration Failed!", 400));
    }
    console.log(3);

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOption);
    await user.save();
    user.userPassword = undefined;
    res.status(201).json({
      success: true,
      message: "Registered Successfully",
      user,
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
      return next(new CustomError("Email and Password is required", 400));
    }

    console.log(userPassword);

    const user = await User.findOne({
      userEmail,
    }).select("+userPassword");

    if (!user) {
      return next(new CustomError("Email is not registered", 401));
    }

    const passwordCheck = await user.comparePassword(userPassword);
    if (!passwordCheck) {
      return next(new CustomError("Password is wrong", 400));
    }

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "Login Successfull!",
      user,
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};

const logout = (req, res, next) => {
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

const profile = async (req, res, next) => {
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

    const user = await User.findById(id).select("+password");

    if (!user) {
      return next(new CustomError("User does not exist", 400));
    }

    const passwordValid = await user.comparePassword(oldPassword);

    if (!passwordValid) {
      return next(new CustomError("Old Password is wrong", 400));
    }

    user.userPassword = await newPassword;
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
    const { fullName, phoneNumber } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return next(new CustomError("User does not exist", 400));
    }

    if (fullName) {
      user.fullName = await fullName;
    }
    if (phoneNumber) {
      user.phoneNumber = await phoneNumber;
    }
    if (req.file) {
      if (user.userImage.publicId) {
        await cloudinary.v2.uploader.destroy(user.userImage.publicId);
      }
      console.log("to ");
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
          user.userImage.publicId = result.public_id;
          user.userImage.secure_url = result.secure_url;

          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (err) {
        return next(new CustomError("File can not get uploaded", 500));
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User Detail updated successfully",
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    return next(new CustomError("Email is Required", 400));
  }

  const user = await User.findOne({ userEmail });

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
    await sendEmail(userEmail, subject, message);
    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your userEmail",
    });
  } catch (e) {
    await user.save();
    return next(new CustomError(e.message, 500));
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { userEmail, otp, newPassword } = req.body;

    if (!userEmail) {
      return next(new CustomError("Email is Required", 400));
    }

    if (!otp) {
      return next(new CustomError("OTP is required", 400));
    }

    if (!newPassword) {
      return next(new CustomError("New password is required", 400));
    }

    const user = await User.findOne({ userEmail });

    if (!user) {
      return next(new CustomError("Email is not registered", 400));
    }

    console.log(otp);
    console.log(user.otp);

    if (user.otp == otp) {
      if (Date.now() < user.otpExpiry) {
        user.userPassword = await newPassword;
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
const getAllCategories = async (req, res) => {
  const { location } = req.params;
  try {
    const vendors = await Vendor.find({ nearByLocation: location }, "products");

    const categorySet = new Set();

    vendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        categorySet.add(product.category);
      });
    });

    const categories = Array.from(categorySet);

    return res
      .status(200)
      .json({ success: true, message: "Categories list", categories });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const getItemsByCategory = async (req, res) => {
  const { location, category } = req.params;

  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }

  try {
    const vendors = await Vendor.find(
      { "products.category": category, nearByLocation: location },

      "products"
    );

    const itemSet = new Set();

    vendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        if (product.category === category) {
          product.categoryList.forEach((item) => {
            itemSet.add(item);
          });
        }
      });
    });

    const items = Array.from(itemSet);

    return res
      .status(200)
      .json({ success: true, message: "SubCategory list", category, items });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const searchVendorsByCategory = async (req, res, next) => {
  const { category, location } = req.params;

  try {
    const vendors = await Vendor.find({
      "products.category": { $regex: new RegExp(category, "i") },
      nearByLocation: location,
    });

    if (!vendors.length) {
      return next(new CustomError("No vendors found for this category", 404));
    }

    res
      .status(200)
      .json({ success: true, message: "Categories list", vendors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchVendorsBySubCategory = async (req, res, next) => {
  const { location, category, item } = req.params;

  try {
    const vendors = await Vendor.find({
      "products.category": { $regex: new RegExp(category, "i") },
      "products.categoryList": { $regex: new RegExp(item, "i") },
      nearByLocation: location,
    });

    if (!vendors.length) {
      return next(
        new CustomError("No vendors found for this Subcategory", 404)
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Vendor list for subcategory", vendors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  register,
  login,
  logout,
  profile,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyOTP,
  searchVendorsByCategory,
  searchVendorsBySubCategory,
  getAllCategories,
  getItemsByCategory,
};
