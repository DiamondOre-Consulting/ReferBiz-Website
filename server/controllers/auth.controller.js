import User from "../models/user.schema.js";
import AppError from "../utils/error.utils.js";
import { v4 as uuidv4 } from "uuid";

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
      return next(new AppError("All Fields are required", 400));
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
        return next(new AppError("Your referal code is invalid", 400));
      }
    }
    console.log(2);

    const uniqueEmail = await User.findOne({ userEmail });
    if (uniqueEmail) {
      return next(new AppError("Email is already registered", 400));
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
      return next(new AppError("Registration Failed!", 400));
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
    return next(new AppError(err.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
      return next(new AppError("Email and Password is required", 400));
    }

    const user = await User.findOne({
      userEmail,
    }).select("+userPassword");

    if (!user) {
      return next(new AppError("Email is not registered", 401));
    }

    const passwordCheck = await user.comparePassword(userPassword);
    if (!passwordCheck) {
      return next(new AppError("Password is wrong", 400));
    }

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "Login Successfull!",
      user,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
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
export { register, login, logout };
