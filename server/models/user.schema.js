import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  userEmail: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  userPassword: {
    type: String,
    minlength: 6,
  },
  userImage: {
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
  referralCode: {
    type: String,
    unique: true,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  discountEarnings: {
    type: Number,
    default: 0,
  },
  referralEarnings: {
    type: Number,
    default: 0,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  referralList: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      dateReferred: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("userPassword")) {
    return next();
  }
  this.userPassword = await bcrypt.hash(this.userPassword, 10);
});


userSchema.methods = {
  generateJWTToken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },
  comparePassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.userPassword)
  },

};

export default mongoose.model("User", userSchema);
