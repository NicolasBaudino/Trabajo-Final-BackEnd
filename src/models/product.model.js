import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnails: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category:{type: String, required: true },
    status:{type: Boolean, default: true },
    owner: { type: String, default: "admin" }
});

productSchema.plugin(mongoosePaginate);

const productModel = model("products", productSchema);

export { productModel };