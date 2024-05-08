import { Schema, model } from "mongoose";

const cartProductSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "products" },
    quantity: { type: Number, required: true, default: 1 }
});

const cartSchema = new Schema({
    userId: String,
    products: [cartProductSchema]
});
  
cartSchema.pre("find", function () {
    this.populate("products.product");
});
  
cartSchema.pre("findOne", function () {
    this.populate("products.product");
});

const cartModel = model("carts", cartSchema);

export { cartModel };