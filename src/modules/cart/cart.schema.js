const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
      owner: {
        type: Schema.ObjectId, ref: "user"
      },
      cartedItems: [
        {
            itemId: {type: Schema.ObjectId, ref: "item"},
            quantity: {
                type: Number, 
                default: 1, 
                min: 1
            }, 
                deliveryStatus: {
                type: String, 
                enum: ["accepted", "ready", "picked-up", "delivered", "canceled", "pending"],
               default: "pending"
           },
            price:  Number, 
            totalItemPrice: Number,
       }
      ],
      totalPrice: Number, 
      deliveryAddress: {
        type: String,
        minLength: 10
      },
      deliveryPhone: {
        type: String,
        minLength: 11
      },
      paymentMethod: {
        type: String,
        enum: ["card", "transfer"],
        default:  "card"
      },
      paidAt: Date, 
      isPaid: {
        type: Boolean,
        default: false,
      },
      paymentReference: {type: String},
      paystackAccessCode: {type: String}, 
      orderStatus: {type: String, enum: [
        "Unpaid",
        "Paid",
        "Failed",
        "Canceled",
      ]}
    },
     { timestamps: true }
);
module.exports = mongoose.model("cart", cartSchema);