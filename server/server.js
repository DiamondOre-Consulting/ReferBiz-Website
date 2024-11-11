const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.schema");
const Vendor = require("./models/vendor.schema");
const vendorRouter = require("./routes/vendor.routes");
const { config } = require('dotenv')
const app = express();
const PORT = process.env.PORT || 5000;
config()

app.use(express.json());

mongoose.set('strictQuery', false)
const connectDB = async () => {
  try {

    const { connection } = await mongoose.connect(process.env.MONGO_URI)

    console.log(connection)

    if (connection) {
      console.log(`Database is connection to ${connection.host}`)
    }

  } catch (err) {
    console.log(err)
    process.exit(1)
  }
};

connectDB();
app.use("/api/vendor/", vendorRouter);
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
