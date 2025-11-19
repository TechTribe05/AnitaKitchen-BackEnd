// const { types } = require("joi");
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const userSchema = new Schema(
//     {
//         name: {
//               type: String,
//               required: true,
//               trim: true, 
//               min: 2
//         },
//         email:  {
//             type: String,
//             required: true,
//             unique: true,
//             trim: true,
//         },
//         phone: {
//             type:  String,
//             max: 14,
//             required: true, 
//             unique: true, 
//             trim: true,
//         },
//         userName: {
//             type: String,
//             required: true,
//             unique: true,
//         },
//         password: {
//             type: String,
//             required: true,
//         },
//         isVerified: {
//             type: Boolean,
//             default: false,
//         },
//         country: {
//             type: String, 
//         },
//         isPaused: {
//             type: Boolean,
//             default: false
//         },
//     },
//      {timestamps: true}
// );
// module.exports = mongoose.model("user", userSchema);