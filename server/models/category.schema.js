import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    categoryName: {
        type: String,
    },
    subCategory: {
        type: Array,
        default: []
    }
});



export default mongoose.model("Category", categorySchema);
