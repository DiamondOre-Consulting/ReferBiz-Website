import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  businessName: {
    type: String,
    trim: true,
  },
  vendorEmail: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "VENDOR"],
    default: "VENDOR",
  },
  status: {
    type: String,
    enum: ["OPEN", "CLOSE", "BLOCKED"],
    default: "OPEN",
  },
  vendorPassword: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  shopName: {
    type: String,
    trim: true,
  },
  nearByLocation: {
    type: String,
    trim: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [Number],
  },
  vendorImage: {
    publicId: {
      type: "String",
    },
    secure_url: {
      type: "String",
    },
  },
  phoneNumber: {
    type: Number,
  },
  fullName: {
    type: String,
    trim: true,
  },
  otp: {
    type: Number,
  },
  otpExpiry: {
    type: Date,
  },
  businessCategory: {
    type: String,
    trim: true,
  },
  fullAddress: {
    type: String,
    trim: true,
  },
  rb_points: {
    type: Number,
    default: 0,
  },
  totalTransactions: {
    type: Number,
    default: 0,
  },
  visitorCount: {
    type: Number,
    default: 0,
  },
  products: [
    {
      category: {
        type: String,
        required: true,
        trim: true,
      },
      categoryList: [
        {
          type: String,
          trim: true,
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

vendorSchema.methods = {
  generateJWTToken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },
  comparePassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.vendorPassword);
  },
};

export default mongoose.model("Vendor", vendorSchema);
