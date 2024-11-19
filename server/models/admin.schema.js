import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const Schema = mongoose.Schema

const adminSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "VENDOR"],
    default: "ADMIN",
  },
  adminEmail: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  adminPassword: {
    type: String,
    minlength: 6,
  },

  phoneNumber: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: Number,
  },
  otpExpiry: {
    type: Date,
  },
})

adminSchema.pre("save", async function (next) {
  if (!this.isModified("adminPassword")) {
    return next()
  }
  this.adminPassword = await bcrypt.hash(this.adminPassword, 10)
})

adminSchema.methods = {
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
    )
  },
  comparePassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.adminPassword)
  },
}

export default mongoose.model("Admin", adminSchema)
