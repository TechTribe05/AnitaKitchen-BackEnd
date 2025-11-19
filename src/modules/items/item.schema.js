const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
    {
        itemName: {
        type: String,
        required: true,
        unique: true,
        minlength: 4   
    },
    itemDescription: {
        type: String,
        required: true,
        unique: true,
        minlength: [10, "description should not be less than 10 characters"]
    },
    vendor: {
        type: Schema.Types.ObjectId,
         trim: true,
        required: true, 
     
        ref: 'vendor'
    },
    unit: {
        type: String,
        required: true,
        enum: ['spoon', 'scoop', 'plate', 'potion', 'bowl', 'piece', 'bucket', 'serving', 'wrap', 'bottle', 'can']
    },
    price: {
        type: Number,
        required: true, 
        min: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    ingredients: [String], 
    category: {
        type: String, 
        trim: true
    },
    tags: [String],
    imageUrl: {
        type: String,
        trim: true
    },
    rating: {
        avarage: {
            type: Number,
            min: 0, 
            max: 5, 
            default: 3
        },
        count: {
            type: Number, 
            min: 0, 
            default: 0
        },
    },
    isVegetarian: {
        type: Boolean, 
        default: false,
    },
    allergies: [String],
},
{timestamps: true}
);

module.exports = mongoose.model("item", itemSchema)