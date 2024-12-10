import Vendor from "../models/vendor.schema.js";
import CustomError from "../utils/error.utils.js";
import Admin from "../models/admin.schema.js";
import User from "../models/user.schema.js";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utils/email.utils.js";
import Category from "../models/category.schema.js";
import fs from "fs";
import fsp from "fs/promises"; // Use promises version of

import csv from "csv-parser";
import vendorSchema from "../models/vendor.schema.js";
import cloudinary from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

const cookieOption = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "None",
};

const vendorRegister = async (req, res, next) => {
  console.log(1);
  console.log(req.body);
  try {
    const {
      fullName,
      vendorEmail,
      vendorPassword,
      shopName,
      nearByLocation,
      phoneNumber,
      fullAddress,
      iframe,
      categoryIds,
      discountProvidedByVendor,
      description,
      youTubeLink,
    } = req.body;

    if (
      !shopName ||
      !fullName ||
      !vendorEmail ||
      !vendorPassword ||
      !nearByLocation ||
      !phoneNumber ||
      !fullAddress ||
      !discountProvidedByVendor ||
      !description ||
      !youTubeLink
    ) {
      return next(new CustomError("All Fields are required", 400));
    }
    console.log("uniqueEmail", req.body);
    const uniqueEmail = await Vendor.findOne({ vendorEmail });
    if (uniqueEmail) {
      return next(new CustomError("Email is already registered", 400));
    }
    console.log(" uniqueEmail       ", uniqueEmail);
    const validCategories = await Category.find({ _id: { $in: categoryIds } });
    if (validCategories.length !== categoryIds.length) {
      return next(new CustomError("Invalid category IDs provided", 400));
    }
    console.log("user", validCategories);
    // Create the vendor with references to categories
    const user = await Vendor.create({
      fullName,
      vendorEmail,
      vendorPassword,
      shopName,
      nearByLocation,
      phoneNumber,
      fullAddress,
      iframe,
      discountProvidedByVendor,
      description,
      youTubeLink,
      products: categoryIds?.map((id) => ({ category: id })),
    });

    if (!user) {
      return next(new CustomError("Registration Failed!", 400));
    }

    console.log(req.files.logo[0]);
    if (req.files && req.files.vendorImage) {
      try {
        // Upload to Cloudinary
        const vendorImageResult = await cloudinary.v2.uploader.upload(
          req.files.vendorImage[0].path,
          {
            folder: "Referbiz",
            width: 250,
            height: 250,
            gravity: "faces",
            crop: "fill",
          }
        );
        console.log("Vendor image uploaded successfully:", vendorImageResult);

        if (vendorImageResult) {
          user.vendorImage = {
            publicId: vendorImageResult.public_id,
            secure_url: vendorImageResult.secure_url,
          };
          console.log("Vendor Image Public ID:", user.vendorImage.publicId);
          console.log("Vendor Image URL:", user.vendorImage.secure_url);
        }

        const filePath = `uploads/${req.files.vendorImage[0].filename}`;

        await fsp.rm(filePath, { force: true });
        console.log("File removed successfully:", filePath);

        console.log("done");
      } catch (err) {
        console.error(
          "Error during vendor image upload or cleanup:",
          err.message
        );
        return next(new CustomError("Vendor image cannot be uploaded", 500));
      }
    }

    if (req.files && req.files.logo) {
      try {
        const logoImageResult = await cloudinary.v2.uploader.upload(
          req.files.logo[0].path,
          {
            folder: "Referbiz",
          }
        );

        if (logoImageResult) {
          user.logo.publicId = logoImageResult.public_id;
          user.logo.secure_url = logoImageResult.secure_url;
        }

        // Remove the local uploaded file
        await fsp.rm(`uploads/${req.files.logo[0].filename}`, {
          force: true,
        });

        console.log("ho gya wow");
      } catch (err) {
        console.log("are yr", err);
        return next(new CustomError("Logo image can not be uploaded", 500));
      }
    }

    await user.save();

    const populatedUser = await Vendor.findById(user._id).populate(
      "products.category"
    );

    user.vendorPassword = undefined;
    res.status(201).json({
      success: true,
      message: "Registered Successfully",
      user: populatedUser, // Send populated data in response
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};
const updateVendor = async (req, res, next) => {
  console.log(1);
  console.log(req.body);
  try {
    const {
      id,
      fullName,
      vendorEmail,

      shopName,
      nearByLocation,
      phoneNumber,
      fullAddress,
      iframe,
      categoryIds,
      discountProvidedByVendor,
      description,
      youTubeLink,
    } = req.body;

    if (
      !id ||
      !shopName ||
      !fullName ||
      !vendorEmail ||
      !nearByLocation ||
      !phoneNumber ||
      !fullAddress ||
      !discountProvidedByVendor ||
      !description ||
      !youTubeLink
    ) {
      return next(new CustomError("All Fields are required", 400));
    }
    console.log("dpne");
    const validCategories = await Category.find({ _id: { $in: categoryIds } });
    if (validCategories.length !== categoryIds.length) {
      return next(new CustomError("Invalid category IDs provided", 400));
    }
    console.log("user", validCategories);

    const user = await Vendor.findById(id);
    if (fullName) {
      user.fullName = await fullName;
    }
    if (phoneNumber) {
      user.phoneNumber = await phoneNumber;
    }
    if (shopName) {
      user.shopName = await shopName;
    }
    if (nearByLocation) {
      user.nearByLocation = await nearByLocation;
    }
    if (fullAddress) {
      user.fullAddress = await fullAddress;
    }
    if (categoryIds) {
      user.products = categoryIds?.map((id) => ({ category: id }));
    }
    if (discountProvidedByVendor) {
      user.discountProvidedByVendor = await discountProvidedByVendor;
    }
    if (description) {
      user.description = await description;
    }
    if (youTubeLink) {
      user.youTubeLink = await youTubeLink;
    }
    if (iframe) {
      user.iframe = await iframe;
    }
    console.log("dpne");

    console.log(req.files);
    if (req.files && req.files.vendorImage) {
      try {
        // Upload to Cloudinary
        const vendorImageResult = await cloudinary.v2.uploader.upload(
          req.files.vendorImage[0].path,
          {
            folder: "Referbiz",
            width: 250,
            height: 250,
            gravity: "faces",
            crop: "fill",
          }
        );
        console.log("Vendor image uploaded successfully:", vendorImageResult);

        if (vendorImageResult) {
          user.vendorImage = {
            publicId: vendorImageResult.public_id,
            secure_url: vendorImageResult.secure_url,
          };
          console.log("Vendor Image Public ID:", user.vendorImage.publicId);
          console.log("Vendor Image URL:", user.vendorImage.secure_url);
        }

        const filePath = `uploads/${req.files.vendorImage[0].filename}`;

        await fsp.rm(filePath, { force: true });
        console.log("File removed successfully:", filePath);

        console.log("done");
      } catch (err) {
        console.error(
          "Error during vendor image upload or cleanup:",
          err.message
        );
        return next(new CustomError("Vendor image cannot be uploaded", 500));
      }
    }

    if (req.files && req.files.logo) {
      try {
        const logoImageResult = await cloudinary.v2.uploader.upload(
          req.files.logo[0].path,
          {
            folder: "Referbiz",
          }
        );

        if (logoImageResult) {
          user.logo.publicId = logoImageResult.public_id;
          user.logo.secure_url = logoImageResult.secure_url;
        }

        // Remove the local uploaded file
        await fsp.rm(`uploads/${req.files.logo[0].filename}`, {
          force: true,
        });

        console.log("ho gya wow");
      } catch (err) {
        console.log("are yr", err);
        return next(new CustomError("Logo image can not be uploaded", 500));
      }
    }
    console.log("done");

    await user.save();

    const populatedUser = await Vendor.findById(user._id).populate(
      "products.category"
    );

    res.status(201).json({
      success: true,
      message: "Updated Successfully",
      user: populatedUser, // Send populated data in response
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};

const adminRegister = async (req, res, next) => {
  try {
    const { fullName, adminEmail, adminPassword } = req.body;

    if (!fullName || !adminEmail || !adminPassword) {
      return next(new CustomError("All Fields are required", 400));
    }

    const uniqueEmail = await Admin.findOne({ adminEmail });
    if (uniqueEmail) {
      return next(new CustomError("Email is already registered", 400));
    }

    const user = await Admin.create({
      fullName,
      adminEmail,
      adminPassword,
    });

    if (!user) {
      return next(new CustomError("Registration Failed!", 400));
    }

    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOption);
    await user.save();
    user.adminPassword = undefined;
    res.status(201).json({
      success: true,
      message: "Admin Registration Successfully done",
      user,
      isLoggedIn: true,
    });
  } catch (err) {
    return next(new CustomError(err.message, 500));
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { adminEmail, adminPassword } = req.body;

    if (!adminEmail || !adminPassword) {
      return next(new CustomError("Email and Password is required", 400));
    }

    const user = await Admin.findOne({
      adminEmail,
    }).select("+adminPassword");

    if (!user) {
      return next(new CustomError("Email is not registered", 401));
    }

    const passwordCheck = await user.comparePassword(adminPassword);
    if (!passwordCheck) {
      return next(new CustomError("Password is wrong", 400));
    }

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "Login Successfull!",
      user,
      isLoggedIn: true,
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
    res
      .status(200)
      .json({ success: true, message: "Logged out", isLoggedIn: false });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const profile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Admin.findById(userId);

    res.status(200).json({
      success: true,
      message: "",
      user,
      isLoggedIn: true,
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

    const user = await Admin.findById(id).select("+password");

    if (!user) {
      return next(new CustomError("Admin does not exist", 400));
    }

    const passwordValid = await user.comparePassword(oldPassword);

    if (!passwordValid) {
      return next(new CustomError("Old Password is wrong", 400));
    }

    user.adminPassword = await newPassword;
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

    const user = await Admin.findById(id);

    if (!user) {
      return next(new CustomError("Admin does not exist", 400));
    }

    if (fullName) {
      user.fullName = await fullName;
    }
    if (phoneNumber) {
      user.phoneNumber = await phoneNumber;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: "Admin Detail updated successfully",
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { adminEmail } = req.body;

  if (!adminEmail) {
    return next(new CustomError("Email is Required", 400));
  }

  const user = await Admin.findOne({ adminEmail });

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
    await sendEmail(adminEmail, subject, message);
    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your adminEmail",
    });
  } catch (e) {
    await user.save();
    return next(new CustomError(e.message, 500));
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { adminEmail, otp, newPassword } = req.body;

    if (!adminEmail) {
      return next(new CustomError("Email is Required", 400));
    }

    if (!otp) {
      return next(new CustomError("OTP is required", 400));
    }

    if (!newPassword) {
      return next(new CustomError("New password is required", 400));
    }

    const user = await Admin.findOne({ adminEmail });

    if (!user) {
      return next(new CustomError("Email is not registered", 400));
    }

    if (user.otp == otp) {
      if (Date.now() < user.otpExpiry) {
        user.adminPassword = await newPassword;
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

const usersList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, searchQuery = "" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const startIndex = (pageNum - 1) * limitNum;

    const list = await User.find({
      fullName: { $regex: searchQuery, $options: "i" },
    })
      .skip(startIndex)
      .limit(limitNum);

    const totalCount = await User.countDocuments({
      fullName: { $regex: searchQuery, $options: "i" },
    });

    res.status(200).json({
      status: true,
      message: "Users list",
      list,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const vendorsList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, searchQuery = "" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const startIndex = (pageNum - 1) * limitNum;

    const list = await vendorSchema
      .find({
        fullName: { $regex: searchQuery, $options: "i" },
      })
      .skip(startIndex)
      .limit(limitNum);

    const totalCount = await vendorSchema.countDocuments({
      fullName: { $regex: searchQuery, $options: "i" },
    });

    res.status(200).json({
      status: true,
      message: "Vendors list",
      list,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
    });
  } catch (e) {
    return next(new CustomError(e.message, 500));
  }
};

const addCategoriesAndSubcategoryByCsv = async (req, res) => {
  const categories = [];
  //formate for csv file must be like this otherwise it will not parse
  // "categoryName", "subCategory", "", "", "", "", "", "", "", "";
  // "Technology", "Smartphones,Tablets", "", "", "", "", "", "", "", "";
  // "Apparel", "Formal Wear,Casual Wear", "", "", "", "", "", "", "", "";
  // "", "", "", "", "", "", "", "", "", "";
  console.log("file", req.file);
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      const categoryName = row.categoryName ? row.categoryName.trim() : "";
      let subCategory = row.subCategory ? row.subCategory.trim() : "";
      console.log("cat", categoryName, subCategory);
      if (subCategory) {
        subCategory = subCategory.split(",").map((item) => item.trim());
      }
      console.log("sub", subCategory);

      if (!categoryName || !subCategory || subCategory.length === 0) return;

      categories.push({ categoryName, subCategory });
    })
    .on("end", async () => {
      try {
        for (const category of categories) {
          const existingCategory = await Category.findOne({
            categoryName: {
              $regex: new RegExp(`^${category.categoryName}$`, "i"),
            },
          });

          if (existingCategory) {
            const updatedSubcategories = Array.from(
              new Set([
                ...existingCategory.subCategory,
                ...category.subCategory.map((sub) => sub.toLowerCase()),
              ])
            );

            existingCategory.subCategory = updatedSubcategories;
            await existingCategory.save();
          } else {
            const newCategory = new Category({
              categoryName: category.categoryName,
              subCategory: category.subCategory.map((sub) => sub.toLowerCase()),
            });
            await newCategory.save();
          }
        }
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });

        res
          .status(200)
          .json({ success: true, message: "Categories added successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding categories", error });
      }
    })
    .on("error", (error) => {
      console.error(error);
      res.status(500).json({ message: "Error processing the CSV file", error });
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    });
};
const addCategoriesCsv = async (req, res) => {
  const categoriesToAdd = new Set();

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      const categoryName = row.categoryName ? row.categoryName.trim() : "";

      if (categoryName) {
        categoriesToAdd.add(categoryName.toLowerCase());
      }
    })
    .on("end", async () => {
      try {
        const uniqueCategories = Array.from(categoriesToAdd);

        for (const categoryName of uniqueCategories) {
          const existingCategory = await Category.findOne({
            categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") },
          });

          if (!existingCategory) {
            const newCategory = new Category({ categoryName });
            await newCategory.save();
          }
        }
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });

        res.status(200).json({
          success: true,
          message: "Categories added successfully, duplicates ignored.",
        });
      } catch (error) {
        console.error(error);
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
        res
          .status(500)
          .json({ message: "Error adding categories to the database", error });
      }
    })
    .on("error", (error) => {
      console.error(error);
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
      res.status(500).json({ message: "Error processing the CSV file", error });
    });
};
const addSubcategoriesByCsv = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Category ID is required in params." });
  }

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const subCategoriesToAdd = new Set();
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        const subCategory = row.subCategory ? row.subCategory.trim() : "";

        if (subCategory) {
          subCategoriesToAdd.add(subCategory.toLowerCase());
        }
      })
      .on("end", async () => {
        try {
          const existingSubCategories = new Set(
            category.subCategory.map((sub) => sub.toLowerCase())
          );

          const uniqueSubCategories = Array.from(subCategoriesToAdd).filter(
            (subCategory) => !existingSubCategories.has(subCategory)
          );

          if (uniqueSubCategories.length > 0) {
            category.subCategory.push(...uniqueSubCategories);
            await category.save();
          }
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });

          res.status(200).json({
            success: true,
            message: "Subcategories added successfully.",
          });
        } catch (error) {
          console.error(error);
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
          res.status(500).json({ message: "Error updating category", error });
        }
      })
      .on("error", (error) => {
        console.error(error);
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
        res
          .status(500)
          .json({ message: "Error processing the CSV file", error });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching category", error });
  }
};
const getVendorData = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    // Find the vendor by ID and populate the 'category' field in the products array
    const vendor = await Vendor.findById(id).populate({
      path: "products.category", // Path to populate
      select: "categoryName", // Only fetch the categoryName field
    });

    console.log(vendor);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
    // console.log(vendor);

    res.status(200).json({
      success: true,
      message: "Vendor data fetched successfully",
      user: vendor,
    });
  } catch (err) {
    console.error(err);
    return next(new CustomError("Failed to fetch: " + err.message, 500));
  }
};
const updateStatus = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;
    const { id } = req.params;
    console.log("isblocked", isBlocked);
    const user = await User.findById(id);
    user.isBlocked = await isBlocked;
    await user.save();
    res.status(200).json({
      status: true,
      message: "Status updated Successfully",
      user,
    });
  } catch (err) {
    return next(new CustomError("Failed to fetch: " + err.message, 500));
  }
};

export {
  vendorRegister,
  adminLogin,
  adminRegister,
  updateProfile,
  forgotPassword,
  verifyOTP,
  changePassword,
  profile,
  logout,
  usersList,
  vendorsList,
  addCategoriesAndSubcategoryByCsv,
  addCategoriesCsv,
  addSubcategoriesByCsv,
  getVendorData,
  updateVendor,
  updateStatus,
};
