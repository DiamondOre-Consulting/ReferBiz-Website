import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import vendorRouter from "./routes/vendor.routes.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import cloudinary from "cloudinary";

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
config();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
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
      console.log(`Database is connection to ${connection.host}`);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/vendor", vendorRouter);
app.use("/api/user", authRouter);
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
