const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorSchema = new Schema(
    {
        businessName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },
        logo: {
            type: String,
        },
        businessAddress: {
            type: String,
            required: true,
            minlength: 3
        },
        businessPhone: {
            type: String,
            required: true,
            minlength: [11, "Phone number should not be less than 11 digits"],
            trim: true,
            unique: true
        },
        businessOwner: {
            type: Schema.ObjectId,
             ref: "user"
        },
        openHour: {
            type: String,
            required: true
        },
        closeHour: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        // isPaused: {
        //     type: Boolean, 
        //     default: false
        // },
    },
    {timestamps: true}
);

module.exports = mongoose.model ("vendor", vendorSchema)