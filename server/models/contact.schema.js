import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", contactSchema);
