import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, "Full name is required"],
    unique: true,
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
    required: [true, "Password is required"],
    minlength: 6,
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
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  referralList: [
    {
      userId: {
        type: Schema.Types.ObjectId,
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

userSchema.pre("save", function (next) {
  if (!this.referralCode) {
    const namePrefix = this.userName.substring(0, 3).toUpperCase();
    const uniqueSuffix = uuidv4().substring(0, 6).toUpperCase();
    this.referralCode = `${namePrefix}${uniqueSuffix}`;
  }
  next();
});

export default mongoose.model("User", userSchema);
