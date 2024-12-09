import Vendor from "../models/vendor.schema.js";
import CustomError from "../utils/error.utils.js";
import Contact from "../models/contact.schema.js";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utils/email.utils.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import User from "../models/user.schema.js";
const cookieOption = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "None",
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

    // const passwordCheck = await vendor.comparePassword(vendorPassword)
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
    console.log("near", nearByLocation);

    if (!nearByLocation) {
      return next(new CustomError("Query is invalid", 500));
    }

    let query = {};

    if (nearByLocation) {
      query.nearByLocation = {
        $regex: new RegExp(`^${nearByLocation}$`, "i"),
      };
    }

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
    res.status(200).json({
      success: true,
      message: "",
      user,
    });
  } catch (err) {
    return next(new CustomError("Failed to fetch" + err.message, 500));
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

    // const passwordValid = await user.comparePassword(oldPassword)

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
    const { shopName, fullAddress, phoneNumber, fullName, status } = req.body;
    const { id } = req.params;

    const user = await Vendor.findById(id);

    if (!user) {
      return next(new CustomError("User does not exist", 400));
    }
    if (!fullName || !phoneNumber || !fullAddress || !shopName) {
      return next(new CustomError("All field are required", 400));
    }

    if (status) {
      user.status = await status;
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

    console.log(req.files.logo[0]);
    if (req.files && req.files.vendorImage) {
      try {
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
        console.log(vendorImageResult);

        if (vendorImageResult) {
          user.vendorImage.publicId = vendorImageResult.public_id;
          user.vendorImage.secure_url = vendorImageResult.secure_url;
        }
        console.log(user.vendorImage.publicId, user.vendorImage.secure_url);

        // Remove the local uploaded file
        await fs.rm(`uploads/${req.files.vendorImage[0].filename}`, {
          force: true,
        });
      } catch (err) {
        return next(new CustomError("Vendor image can not be uploaded", 500));
      }
    }

    if (req.files && req.files.logo) {
      try {
        const logoImageResult = await cloudinary.v2.uploader.upload(
          req.files.logo[0].path,
          {
            folder: "Referbiz",
            width: 250,
            height: 250,
            gravity: "faces",
            crop: "fill",
          }
        );

        if (logoImageResult) {
          user.logo.publicId = logoImageResult.public_id;
          user.logo.secure_url = logoImageResult.secure_url;
        }

        // Remove the local uploaded file
        await fs.rm(`uploads/${req.files.logo[0].filename}`, { force: true });
      } catch (err) {
        return next(new CustomError("Logo image can not be uploaded", 500));
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

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const user = await Vendor.findById(id);

    if (!user) {
      return next(new CustomError("User does not exist", 400));
    }

    if (status) {
      user.status = await status;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor Status updated successfully",
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

const addProduct = async (req, res, next) => {
  const { items } = req.body;
  const { id } = req.params; // Expecting `categoryId` and `items` array
  const userId = await req.user.id;
  console.log(id, items);
  if (!id) {
    return next(
      new CustomError(
        "Category ID is required. Please provide a valid category ID.",
        400
      )
    );
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(
      new CustomError(
        "Items list is empty or invalid. Please provide a valid list of items",
        400
      )
    );
  }

  try {
    const vendor = await Vendor.findById(userId);

    // Find the category by ID
    const categoryExists = await vendor.products.find(
      (prod) => prod._id.toString() === id.toString() // Match category by ID
    );

    if (categoryExists) {
      // Add items to the category if they are not already present
      const addedItems = [];
      const existingItems = categoryExists.categoryList;

      items.forEach((item) => {
        if (!existingItems.includes(item)) {
          categoryExists.categoryList.push(item);
          addedItems.push(item);
        }
      });

      // Save the vendor's updated products
      if (addedItems.length > 0) {
        await vendor.save();
        return res.status(200).json({
          message: `${addedItems.length} item(s) added successfully.`,
          addedItems,
          vendor,
        });
      } else {
        return res.status(200).json({
          message:
            "No new items were added as they already exist in the category.",
        });
      }
    } else {
      return next(
        new CustomError(
          "Category with the provided ID not found. Please contact the admin.",
          404
        )
      );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const deleteProduct = async (req, res, next) => {
  const { item } = req.body;
  const { id } = req.params; // categoryId from the request params
  const vendorId = req.user.id;
  console.log(req.body);

  if (!id || !item || typeof item !== "string") {
    return next(
      new CustomError(
        "Invalid input. Please provide a valid categoryId and item.",
        404
      )
    );
  }

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return next(new CustomError("Vendor Not Found", 404));
    }

    const categoryFound = vendor.products.find(
      (prod) => prod._id.toString() === id
    );

    if (!categoryFound) {
      return next(new CustomError("Category Not Found", 404));
    }

    const itemIndex = categoryFound.categoryList.findIndex(
      (subCategory) => subCategory.toLowerCase() === item.toLowerCase()
    );

    if (itemIndex === -1) {
      return next(new CustomError("Item Not Found", 404));
    }

    // Remove the item from the category list
    categoryFound.categoryList.splice(itemIndex, 1);

    await vendor.save();

    return res.status(200).json({
      message: "Item deleted successfully.",
      vendor,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const getCustomerList = async (req, res) => {
  const { page = 1, limit = 10, searchQuery = "" } = req.query;
  const vendorId = req.user?.id;
  console.log("Vendor ID:", vendorId);
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const startIndex = (pageNum - 1) * limitNum;

  try {
    console.log("Vendor ID:", vendorId);

    const vendor = await Vendor.findById(vendorId).populate({
      path: "customerList.userId",
      select: "fullName phoneNumber email",
    });
    console.log("end", vendor);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    console.log("Customer List:", vendor.customerList);

    const filteredCustomers = vendor.customerList.filter((customer) => {
      const fullName = customer.userId?.fullName?.toLowerCase();
      return searchQuery
        ? fullName && fullName.includes(searchQuery.toLowerCase())
        : true;
    });

    console.log("Filtered Customers:", filteredCustomers);

    const paginatedCustomers = filteredCustomers.slice(
      startIndex,
      startIndex + limitNum
    );

    return res.status(200).json({
      success: true,
      message: "Customer Data Fetched",
      customers: paginatedCustomers.map((customer) => ({
        fullName: customer.userId.fullName,
        phoneNumber: customer.userId.phoneNumber,
        email: customer.userId.email,
        totalPaid: customer.totalPaid,
        lastPurchaseDate: customer.lastPurchaseDate,
        purchaseCount: customer.purchaseCount,
      })),
      totalPages: Math.ceil(filteredCustomers.length / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching customer list:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const vendorContactUs = async (req, res, next) => {
  try {
    const { name, email, message, phoneNumber, shopName } = req.body;
    const vendorId = req.user.id; // Assuming `req.user.id` is the logged-in vendor's ID
    console.log(name, email, message, phoneNumber, shopName);
    // Save the contact data to the database, including the vendorId
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }
    const contact = new Contact({
      name,
      email,
      message,
      vendorId,
      role: vendor?.role, // Add vendorId here
    });

    const subject = "Message by the vendor";
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
          <p><strong class="highlight">Phone Number:</strong> ${phoneNumber}</p>
          <p><strong class="highlight">Shop Name:</strong> ${shopName}</p>
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
    await sendEmail("itsakash18.06@gmail.com", subject, body);

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
  addProduct,
  deleteProduct,
  updateStatus,
  getVendorData,
  getCustomerList,
  vendorContactUs,
};
