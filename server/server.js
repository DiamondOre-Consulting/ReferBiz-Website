const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.schema");
const Vendor = require("./models/vendor.schema");
const vendorRouter = require("./routes/vendor.routes");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
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
app.use("/api/vendor", vendorRouter);
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
