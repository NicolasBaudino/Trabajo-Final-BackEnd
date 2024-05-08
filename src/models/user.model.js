import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = "users";

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    loggedBy: String,
    role: {
        type: String,
        default: "user",
        enum: ['user', 'admin', 'premium']
    },
    cart: {type: mongoose.Schema.Types.ObjectId},
    documents: [{name: String, reference: String}],
    last_connection: Date
})

schema.plugin(mongoosePaginate)

const userModel = mongoose.model(collection, schema)

export default userModel;