import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import vendorRouter from "./routes/vendor.routes.js";
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import cloudinary from "cloudinary";
import morgan from "morgan";
import Vendor from "./models/vendor.schema.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
config();

const res = cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(morgan("dev"));

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);

    if (connection) {
      console.log(connection.host);
    }
  } catch (err) {
    console.log(err, "error");
    process.exit(1);
  }
};

connectDB();

const dummyVendors = [
  {
    businessName: "Business 1",
    vendorEmail: "vendor1@example.com",
    role: "VENDOR",
    status: "OPEN",
    vendorPassword: "password123",
    shopName: "Tech x",
    nearByLocation: "noida",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006], // Example coordinates
    },
    vendorImage: {
      publicId: "",
      secure_url: "",
    },
    phoneNumber: 9000000001,
    fullName: "Vendor FullName 1",
    otp: 123456,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    businessCategory: "Technology",
    fullAddress: "Full Address 1",
    rb_points: 50,
    totalTransactions: 100,
    visitorCount: 200,
    products: [
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ac7"), // Example ObjectId
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ac8"),
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ac9"),
      },
    ],
    customerList: [], // Empty array for now
    gst_no: "GST1234",
    tin_no: "TIN1234",
    createdAt: new Date(),
  },
  {
    businessName: "Web Dev",
    vendorEmail: "vendor1@example.com",
    role: "VENDOR",
    status: "OPEN",
    vendorPassword: "password123",
    shopName: "Doc Labz",
    nearByLocation: "noida",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006], // Example coordinates
    },
    vendorImage: {
      publicId: "",
      secure_url: "",
    },
    phoneNumber: 9000000001,
    fullName: "Vendor FullName 1",
    otp: 123456,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    businessCategory: "web development",
    fullAddress: "Full Address 1",
    rb_points: 50,
    totalTransactions: 100,
    visitorCount: 200,
    products: [
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7acc"), // Example ObjectId
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7acf"),
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ad0"),
      },
    ],
    customerList: [], // Empty array for now
    gst_no: "GST1234",
    tin_no: "TIN1234",
    createdAt: new Date(),
  },
  {
    businessName: "Consultant",
    vendorEmail: "vendor1@example.com",
    role: "VENDOR",
    status: "OPEN",
    vendorPassword: "password123",
    shopName: "DiamondOre",
    nearByLocation: "noida",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006], // Example coordinates
    },
    vendorImage: {
      publicId: "",
      secure_url: "",
    },
    phoneNumber: 9000000001,
    fullName: "Vendor FullName 1",
    otp: 123456,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    businessCategory: "Consultant",
    fullAddress: "Full Address 1",
    rb_points: 50,
    totalTransactions: 100,
    visitorCount: 200,
    products: [
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ad0"), // Example ObjectId
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ace"),
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7acd"),
      },
    ],
    customerList: [], // Empty array for now
    gst_no: "GST1234",
    tin_no: "TIN1234",
    createdAt: new Date(),
  },
  {
    businessName: "Machine learning",
    vendorEmail: "vendor1@example.com",
    role: "VENDOR",
    status: "OPEN",
    vendorPassword: "password123",
    shopName: "Tech shop machine",
    nearByLocation: "delhi",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006], // Example coordinates
    },
    vendorImage: {
      publicId: "",
      secure_url: "",
    },
    phoneNumber: 9000000001,
    fullName: "Vendor FullName 1",
    otp: 123456,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    businessCategory: "Ai",
    fullAddress: "Full Address 1",
    rb_points: 50,
    totalTransactions: 100,
    visitorCount: 200,
    products: [
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ad0"), // Example ObjectId
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7acf"),
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ace"),
      },
    ],
    customerList: [], // Empty array for now
    gst_no: "GST1234",
    tin_no: "TIN1234",
    createdAt: new Date(),
  },
  {
    businessName: "Ai",
    vendorEmail: "vendor1@example.com",
    role: "VENDOR",
    status: "OPEN",
    vendorPassword: "password123",
    shopName: "AI gadget",
    nearByLocation: "delhi",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006], // Example coordinates
    },
    vendorImage: {
      publicId: "",
      secure_url: "",
    },
    phoneNumber: 9000000001,
    fullName: "Vendor FullName 1",
    otp: 123456,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    businessCategory: "Artificial I",
    fullAddress: "Full Address 1",
    rb_points: 50,
    totalTransactions: 100,
    visitorCount: 200,
    products: [
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ad0"), // Example ObjectId
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7acf"),
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ace"),
      },
    ],
    customerList: [], // Empty array for now
    gst_no: "GST1234",
    tin_no: "TIN1234",
    createdAt: new Date(),
  },
  {
    businessName: "Internet OF Things",
    vendorEmail: "vendor1@example.com",
    role: "VENDOR",
    status: "OPEN",
    vendorPassword: "password123",
    shopName: "Smart Hub",
    nearByLocation: "delhi",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006], // Example coordinates
    },
    vendorImage: {
      publicId: "",
      secure_url: "",
    },
    phoneNumber: 9000000001,
    fullName: "Vendor FullName 1",
    otp: 123456,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    businessCategory: "Watches",
    fullAddress: "Full Address 1",
    rb_points: 50,
    totalTransactions: 100,
    visitorCount: 200,
    products: [
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7acc"), // Example ObjectId
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ac7"),
      },
      {
        category: new mongoose.Types.ObjectId("673d762107abd308d6be7ac8"),
      },
    ],
    customerList: [], // Empty array for now
    gst_no: "GST1234",
    tin_no: "TIN1234",
    createdAt: new Date(),
  },
];

// Insert Dummy Data
const insertDummyData = async () => {
  try {
    await Vendor.insertMany(dummyVendors);
    console.log("Dummy data inserted successfully!");
    process.exit(0); // Exit script after successful insertion
  } catch (error) {
    console.error("Error inserting dummy data:", error);
    process.exit(1); // Exit script on error
  }
};
// insertDummyData();

app.use("/api/vendor", vendorRouter);
app.use("/api/user", authRouter);
app.use("/api/admin", adminRouter);
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log("App is running at :", PORT);
});
