import AppError from "../utils/error.utils.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = await req.cookies;

    if (!token) {
      return next(new AppError("Unauthenticated! Please Login again", 400));
    }

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;

    next();
  } catch (e) {
    return res.status(500).json({ success: false, message: "Login again!", tokenExpired: true });


  }
};

export default isLoggedIn;
