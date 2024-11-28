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
