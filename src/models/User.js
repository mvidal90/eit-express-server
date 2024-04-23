import { Schema, model } from "mongoose";


const UserSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    birthDate: {
        type: Date
    },
    userTypes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        require: true
    },
    deletedAt: {
        type: Date,
        require: false
    }
})

export const User = model("User", UserSchema)