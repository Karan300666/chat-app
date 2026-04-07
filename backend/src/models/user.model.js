import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    userName:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String
    }
})

const userModel = mongoose.model("user" , userSchema);

export default userModel;