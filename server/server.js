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
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.FRONTEND_URL,
      process.env.ADMIN_FRONTEND_URL,
    ],
    credentials: true,
  },
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

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
      process.env.ADMIN_FRONTEND_URL,
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

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinVendorRoom", (vendorId) => {
    const roomName = `vendor_${vendorId}`;
    socket.join(roomName);
    console.log(`Vendor ${vendorId} joined room: ${roomName}`);
  });

  socket.on("payment-request", (data) => {
    console.log("Payment request received on server:", data);
    const vendorRoom = `vendor_${data.vendorId}`;

    io.to(vendorRoom).emit("payment-request", {
      paymentId: data.paymentId,
      customerName: data.customerName,
      amount: data.amount,
      message: data.message,
    });

    console.log(`Payment request sent to room: ${vendorRoom}`);
  });

  socket.on("payment-confirmation", (data) => {
    console.log("Payment confirmation received:", data);
    io.emit("payment-status", {
      paymentId: data.paymentId,
      status: data.status,
      vendorId: data.vendorId,
    });
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

connectDB();

app.use("/api/vendor", vendorRouter);
app.use("/api/user", authRouter);
app.use("/api/admin", adminRouter);
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use(errorMiddleware);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
