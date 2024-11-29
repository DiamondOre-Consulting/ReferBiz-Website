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
  logo: {
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
  totalRatingSum: { type: Number, default: 0 },
  totalNumberGivenReview: { type: Number, default: 0 },
  ratedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      starRating: { type: Number, default: 0 },
    },
  ],
  fullName: {
    type: String,
    trim: true,
  },
  iframe: {
    type: String,
    default: null,
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
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      categoryList: [
        {
          type: String,
          trim: true,
        },
      ],
    },
  ],
  customerList: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      totalPaid: {
        type: Number,
        default: 0,
      },
      lastPurchaseDate: {
        type: Date,
      },
      purchaseCount: {
        type: Number,
        default: 0,
      },
    },
  ],
  gst_no: {
    type: String,
  },
  tin_no: {
    type: String,
  },
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
