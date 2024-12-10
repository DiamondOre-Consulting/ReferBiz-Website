import User from "../models/user.schema.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import fs from "fs/promises";
import cloudinary from "cloudinary";
import CustomError from "../utils/error.utils.js";
import sendEmail from "../utils/email.utils.js";
import Vendor from "../models/vendor.schema.js";
import Contact from "../models/contact.schema.js";
const cookieOption = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "None",
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

    const uniqueEmail = await User.findOne({ userEmail });
    if (uniqueEmail) {
      return next(new CustomError("Email is already registered", 400));
    }

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

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOption);
    await user.save();
    if (referralCode) {
      const referredUser = await User.findOne({ referralCode });

      if (referredUser) {
        user.referredBy = referredUser._id;
        await User.findByIdAndUpdate(
          referredUser._id,
          {
            $push: {
              referralList: {
                userId: user._id,
                dateReferred: new Date(),
              },
            },
          },
          { new: true }
        );
      } else {
        return next(new CustomError("Your referral code is invalid", 400));
      }
    }
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
    console.log(user.isBlocked);
    if (user.isBlocked) {
      return next(
        new CustomError("Admin has Blocked you . Please contact Admin", 400)
      );
    }
    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOption);
    console.log(res.cookie);
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

    res.status(200).json({
      success: true,
      message: "",
      user,
    });
  } catch (err) {
    return next(new CustomError("Failed to fetch" + err.message, 500));
  }
};
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

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

      try {
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

  // const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
  const subject = "🔒 Password Reset Request";
  const message = `
 <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="width: 100% max-width: 24rem background-color: #f4f4f4 border-radius: 8px padding: 20px box-sizing: border-box color-scheme: light dark background-color: #ffffff background-color: #1a1a1a">
  <tr>
    <td style="text-align: center padding: 20px 0">
      
      <img src="https://img.icons8.com/ios-filled/50/0074f9/lock.png" alt="Lock Icon" style="width: 40px margin-bottom: 15px display: block margin-left: auto margin-right: auto">

      <p style="font-size: 1.2rem font-weight: bold margin: 0 color: #000000 color: #ffffff">
        Hello, <span style="color: #0074f9">${user.fullName}</span>
      </p>

      <p style="font-weight: 400 text-align: center margin: 20px 0 color: #555555 color: #cccccc">
        It seems you’ve requested to reset your password. Let’s get you back on track! Use this OTP
      </p>

     <p style="font-weight: 400 text-align: center margin: 20px 0 color: #555555 color: #cccccc">
        <strong>${otp}</strong>
      </p>

      <p style="font-weight: 400 text-align: center margin: 20px 0 color: #555555 color: #cccccc">
        If you did not request a password reset, no worries—just ignore this Email, and your password will remain unchanged.
      </p>

      <div style="text-align: center margin-top: 20px">
        <p style="margin: 0 font-size: 1rem color: #000000 color: #ffffff">
          Stay safe,
        </p>

        <img src="https://img.icons8.com/ios-filled/50/0074f9/shield.png" alt="Shield Icon" style="width: 30px margin: 10px 0">
        <p style="margin: 0 color: #0074f9 font-weight: bold">Refer Biz</p>
        <p style="margin: 0 color: #555555 color: #cccccc">Support Team</p>
      </div>

      <div style="text-align: center margin-top: 20px">
        <a href="" style="text-decoration: none margin: 0 10px">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/facebook.png" alt="Facebook" style="width: 25px display: inline-block">
        </a>
        <a href="" style="text-decoration: none margin: 0 10px">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/x.png" alt="X (formerly Twitter)" style="width: 25px display: inline-block">
        </a>
        <a href="" style="text-decoration: none margin: 0 10px">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/instagram.png" alt="Instagram" style="width: 25px display: inline-block">
        </a>
        <a href="" style="text-decoration: none margin: 0 10px">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/linkedin.png" alt="LinkedIn" style="width: 25px display: inline-block">
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
    const vendors = await Vendor.find({ nearByLocation: location })
      .populate("products.category", "categoryName")
      .select("products");

    const categoryMap = new Map();

    vendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        if (
          product.category &&
          product.category._id &&
          product.category.categoryName
        ) {
          categoryMap.set(
            product.category._id.toString(),
            product.category.categoryName
          );
        }
      });
    });

    const categories = Array.from(categoryMap, ([id, name]) => ({ id, name }));

    console.log("Categories:", categories);

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
    const vendors = await Vendor.find({
      "products.category": category,
      nearByLocation: location,
    })
      .populate("products.category", "categoryName subCategory")
      .select("products");

    const itemSet = new Set();

    vendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        if (product.category && product.category._id.toString() === category) {
          product.categoryList.forEach((item) => {
            itemSet.add(item);
          });
        }
      });
    });

    const items = Array.from(itemSet);

    return res.status(200).json({
      success: true,
      message: "SubCategory list",
      categoryId: category,
      items,
    });
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
    // Query vendors with the matching category ObjectId and location
    const vendors = await Vendor.find({
      "products.category": category, // Match directly with the ObjectId
      nearByLocation: location,
    }).populate("products.category", "categoryName"); // Optionally populate category details

    if (!vendors.length) {
      return next(new CustomError("No vendors found for this category", 404));
    }
    console.log(vendors);

    res.status(200).json({
      success: true,
      message: "Vendors found for the specified category",
      vendors,
    });
  } catch (error) {
    console.error("Error fetching vendors by category:", error);
    res.status(500).json({ message: error.message });
  }
};

const searchVendorsBySubCategory = async (req, res, next) => {
  const { location, category, item } = req.params;

  try {
    const categoryObjectId = new mongoose.Types.ObjectId(category);

    const vendors = await Vendor.find({
      "products.category": categoryObjectId,
      "products.categoryList": { $regex: new RegExp(item, "i") },
      nearByLocation: location,
    });

    if (!vendors.length) {
      return next(
        new CustomError("No vendors found for this Subcategory", 404)
      );
    }

    res.status(200).json({
      success: true,
      message: "Vendor list for subcategory",
      vendors,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);

    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const addPayment = async (req, res, next) => {
  const { amount } = req.body;
  const { vendorId } = req.params;
  const userId = req.user.id;
  const percent = Math.floor(amount / 100);
  let referralEarning;

  if (!userId || !vendorId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid input parameters." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const userEarning = percent * 5;
    user.rbPoints += userEarning;
    user.totalEarnings += userEarning;
    console.log("refer", user);
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        referralEarning = userEarning * 0.1;
        console.log("refer1", referralEarning);
        referrer.referralEarnings += referralEarning;
        referrer.totalEarnings += referralEarning;
        console.log("refer1", referrer.referralEarnings);

        await referrer.save();
      }
    }

    const existingVendor = user.vendorList.find(
      (item) => item.vendorId.toString() === vendorId
    );

    if (existingVendor) {
      existingVendor.totalPaid += amount;
      existingVendor.lastPurchaseDate = new Date();
      existingVendor.purchaseCount += 1;
      existingVendor.lastPurchases.push({
        amount,
        date: new Date(),
      });
    } else {
      user.vendorList.push({
        vendorId,
        totalPaid: amount,
        lastPurchaseDate: new Date(),
        purchaseCount: 1,
        lastPurchases: [
          {
            amount,
            date: new Date(),
          },
        ],
      });
    }
    const UserSubject = "Message by the Referbiz";
    const UserEmailBody = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f9;
            }
            .email-container {
              width: 100%;
              max-width: 650px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
              margin-bottom: 25px;
              font-size: 28px;
              font-weight: bold;
              color: #4CAF50; /* Green for a welcoming feel */
              text-transform: uppercase;
            }
            .email-content {
              font-size: 16px;
              color: #333333;
              line-height: 1.6;
            }
            .email-content p {
              margin-bottom: 15px;
            }
            .email-content .highlight {
              font-weight: bold;
              color: #FF5722; /* Highlight for key details */
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #777777;
            }
            .footer a {
              color: #4CAF50; /* Link color */
              text-decoration: none;
            }
            .footer p {
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              Thank You for Shopping With Us!
            </div>
            <div class="email-content">
              <p>Dear <strong class="highlight">${user.fullName}</strong>,</p>
              <p>We are delighted to inform you that your shopping experience at <strong class="highlight">${vendor.shopName}</strong> was successful!</p>
              <p><strong class="highlight">Total Amount Paid:</strong> ${amount} INR</p>
              <p><strong class="highlight">Reward Points Earned:</strong> ${userEarning} RB Points</p>
              <p>We appreciate your trust in us and look forward to serving you again soon.</p>
              <p>If you have any questions or need assistance, don’t hesitate to <a href="mailto:support@yourdomain.com">contact us</a>.</p>
            </div>
            <div class="footer">
              <p>Thank you for being a valued customer.</p>
              <p>Warm regards,<br>Your Company Name Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
    await sendEmail(user.userEmail, UserSubject, UserEmailBody);
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);

      const referrerSubject = "Congratulations on Earning RB Points - ReferBiz";
      const referrerBody = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f9;
            }
            .email-container {
              width: 100%;
              max-width: 650px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
              margin-bottom: 25px;
              font-size: 28px;
              font-weight: bold;
              color: #4CAF50; /* Green for success and positivity */
              text-transform: uppercase;
            }
            .email-content {
              font-size: 16px;
              color: #333333;
              line-height: 1.6;
            }
            .email-content p {
              margin-bottom: 15px;
            }
            .email-content strong {
              color: #333333;
            }
            .email-content .highlight {
              font-weight: bold;
              color: #FF5722; /* Highlight color for key points */
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #777777;
            }
            .footer a {
              color: #4CAF50; /* Link color */
              text-decoration: none;
            }
            .footer p {
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              Congratulations on Your RB Points!
            </div>
            <div class="email-content">
              <p>Dear <strong class="highlight">${referrer.fullName}</strong>,</p>
              <p>We’re thrilled to inform you that you’ve earned <strong class="highlight">${referralEarning} Points</strong> because your referred user has successfully completed their shopping at <strong class="highlight">${vendor.shopName}</strong> by <strong class="highlight">${user.fullName}</strong>.</p>
              <p>Thank you for using <strong class="highlight">ReferBiz</strong> and helping others discover amazing shopping experiences!</p>
              <p>Your efforts are making a difference, and we are grateful for your continued support.</p>
            </div>
            <div class="footer">
              <p>If you have any questions or need assistance, please <a href="mailto:support@referbiz.com">contact us</a>.</p>
              <p>Keep referring and keep earning!</p>
              <p>Warm regards,<br>The ReferBiz Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

      // Send email to the vendor (or system)
      await sendEmail(referrer.userEmail, referrerSubject, referrerBody);
    }

    await user.save();

    // Update vendor's customerList
    const existingCustomer = vendor.customerList.find(
      (item) => item.userId.toString() === userId
    );

    if (existingCustomer) {
      existingCustomer.totalPaid += amount;
      existingCustomer.lastPurchaseDate = new Date();
      existingCustomer.purchaseCount += 1;
      existingCustomer.lastPurchases?.push({
        amount,
        date: new Date(),
      });
    } else {
      vendor.customerList.push({
        userId,
        totalPaid: amount,
        lastPurchaseDate: new Date(),
        purchaseCount: 1,
        lastPurchases: [
          {
            amount,
            date: new Date(),
          },
        ],
      });
    }

    // Update vendor's total amount
    vendor.totalAmount += amount;
    await vendor.save();

    return res.status(200).json({ message: "Transaction successful." });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getReferralList = async (req, res) => {
  const { page = 1, limit = 10, searchQuery = "" } = req.query;
  const userId = req.user?.id;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  console.log("res", page, limit, searchQuery, userId);

  if (isNaN(pageNum) || pageNum <= 0) {
    return res.status(400).json({ message: "Invalid page number." });
  }
  if (isNaN(limitNum) || limitNum <= 0) {
    return res.status(400).json({ message: "Invalid limit number." });
  }

  const startIndex = (pageNum - 1) * limitNum;

  try {
    const user = await User.findById(userId).populate({
      path: "referralList.userId",
      select: "fullName userEmail",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const filteredReferrals = user.referralList.filter((referral) => {
      const fullName = referral.userId?.fullName?.toLowerCase();
      return searchQuery
        ? fullName && fullName.includes(searchQuery.toLowerCase())
        : true;
    });

    const paginatedReferrals = filteredReferrals.slice(
      startIndex,
      startIndex + limitNum
    );

    return res.status(200).json({
      success: true,
      message: "Referral Data Fetched",
      referrals: paginatedReferrals.map((referral) => ({
        fullName: referral.userId.fullName,
        email: referral.userId.userEmail,
        referredDate: referral.dateReferred,
      })),
      totalPages: Math.ceil(filteredReferrals.length / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching referral list:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const userContactUs = async (req, res, next) => {
  try {
    const { name, email, message, phone, role, userId } = req.body;
    console.log(req.body);
    const contact = new Contact({
      name,
      email,
      message,
      userId,
      role,
    });

    const subject = "Message by the Customer";
    const body = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f9;
        }
        .email-container {
          width: 100%;
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          text-align: center;
          margin-bottom: 25px;
          font-size: 28px;
          font-weight: bold;
          color: #3b5998;  /* Professional blue */
          text-transform: uppercase;
        }
        .email-content {
          font-size: 16px;
          color: #333333;
          line-height: 1.6;
        }
        .email-content p {
          margin-bottom: 15px;
        }
        .email-content strong {
          color: #333333;
        }
        .email-content .highlight {
          font-weight: bold;
          color: #4a90e2; /* Highlight color for emphasis */
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 14px;
          color: #777777;
        }
        .footer a {
          color: #3b5998; /* Link color */
          text-decoration: none;
        }
        .footer p {
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          Vendor Contact Message
        </div>
        <div class="email-content">
          <p><strong class="highlight">Name:</strong> ${name}</p>
          <p><strong class="highlight">Email:</strong> ${email}</p>
          <p><strong class="highlight">Phone Number:</strong> ${phone}</p>
          <p><strong class="highlight">Message:</strong></p>
          <p>${message}</p>
        </div>
        <div class="footer">
          <p>Thank you for taking the time to reach out to us.</p>
          <p>If you have any further questions or need assistance, please <a href="mailto:admin@yourdomain.com">contact us</a> directly.</p>
          <p>Best regards,<br>Your Company Name Team</p>
        </div>
      </div>
    </body>
  </html>
`;

    // Send email to the vendor (or system)
    await sendEmail(email, subject, body);

    // Save contact form entry in the database
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact Email sent successfully!",
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const giveReviewToVendor = async (req, res) => {
  const { vendorId } = req.params;
  const { starRating } = req.body;
  const userId = req.user.id;

  if (!starRating || starRating < 1 || starRating > 5) {
    return res
      .status(400)
      .json({ message: "Invalid star rating. Must be between 1 and 5." });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const previousRatingIndex = vendor?.ratedBy?.findIndex(
      (rating) => rating.userId.toString() === userId
    );

    if (previousRatingIndex !== -1) {
      const oldRating = vendor.ratedBy[previousRatingIndex].starRating;

      vendor.totalRatingSum = vendor.totalRatingSum - oldRating + starRating;

      vendor.ratedBy[previousRatingIndex].starRating = starRating;

      await vendor.save();

      return res.status(200).json({
        message: "Rating updated successfully!",
        vendor,
      });
    } else {
      vendor.ratedBy.push({ userId, starRating });
      vendor.totalRatingSum += starRating;
      vendor.totalNumberGivenReview += 1;

      await vendor.save();

      return res.status(200).json({
        message: "Rating submitted successfully!",
        vendor,
      });
    }
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vendorId } = req.params;

    const user = await User.findById(userId).select("vendorList").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const vendor = user.vendorList.find(
      (v) => v.vendorId.toString() === vendorId
    );

    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor not found in the user's list." });
    }

    return res.status(200).json({
      success: true,
      vendorId: vendorId,
      lastPurchases: vendor.lastPurchases,
    });
  } catch (error) {
    console.error("Error fetching vendor purchases:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const registerOtpGenerate = async (req, res, next) => {
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

  // const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
  const subject = "🔒 Password Reset Request";
  const message = `
 <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="width: 100% max-width: 24rem background-color: #f4f4f4 border-radius: 8px padding: 20px box-sizing: border-box color-scheme: light dark background-color: #ffffff background-color: #1a1a1a">
  <tr>
    <td style="text-align: center padding: 20px 0">
      
      <img src="https://img.icons8.com/ios-filled/50/0074f9/lock.png" alt="Lock Icon" style="width: 40px margin-bottom: 15px display: block margin-left: auto margin-right: auto">

      <p style="font-size: 1.2rem font-weight: bold margin: 0 color: #000000 color: #ffffff">
        Hello, <span style="color: #0074f9">${user.fullName}</span>
      </p>

      <p style="font-weight: 400 text-align: center margin: 20px 0 color: #555555 color: #cccccc">
        It seems you’ve requested to reset your password. Let’s get you back on track! Use this OTP
      </p>

     <p style="font-weight: 400 text-align: center margin: 20px 0 color: #555555 color: #cccccc">
        <strong>${otp}</strong>
      </p>

      <p style="font-weight: 400 text-align: center margin: 20px 0 color: #555555 color: #cccccc">
        If you did not request a password reset, no worries—just ignore this Email, and your password will remain unchanged.
      </p>

      <div style="text-align: center margin-top: 20px">
        <p style="margin: 0 font-size: 1rem color: #000000 color: #ffffff">
          Stay safe,
        </p>

        <img src="https://img.icons8.com/ios-filled/50/0074f9/shield.png" alt="Shield Icon" style="width: 30px margin: 10px 0">
        <p style="margin: 0 color: #0074f9 font-weight: bold">Refer Biz</p>
        <p style="margin: 0 color: #555555 color: #cccccc">Support Team</p>
      </div>

      <div style="text-align: center margin-top: 20px">
        <a href="" style="text-decoration: none margin: 0 10px">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/facebook.png" alt="Facebook" style="width: 25px display: inline-block">
        </a>
        <a href="" style="text-decoration: none margin: 0 10px">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/x.png" alt="X (formerly Twitter)" style="width: 25px display: inline-block">
        </a>
        <a href="" style="text-decoration: none margin: 0 10px">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/instagram.png" alt="Instagram" style="width: 25px display: inline-block">
        </a>
        <a href="" style="text-decoration: none margin: 0 10px">
          <img src="https://img.icons8.com/ios-filled/30/0074f9/linkedin.png" alt="LinkedIn" style="width: 25px display: inline-block">
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
  addPayment,
  getReferralList,
  userContactUs,
  giveReviewToVendor,
  getPurchaseHistory,
  getUserById,
};
