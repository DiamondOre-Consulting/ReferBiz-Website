const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  businessName: {
    type: String,
    required: [true, "Business name is required"],
    trim: true,
  },
  venderEmail: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  venderPassword: {
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
  businessCategory: {
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
  totalProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  totalReferrals: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vendor", vendorSchema);
