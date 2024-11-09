const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.schema");
const Vendor = require("./models/vendor.schema");
const vendorRouter = require("./routes/vendor.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://piyushgupta:test123@cluster0.bkpmg.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

connectDB();
app.use("/api", vendorRouter);
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
