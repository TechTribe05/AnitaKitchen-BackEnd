// require("dotenv").config(); //login/ must be at the very top
// const express = require("express");
// const { sendOTP, verifyOTP } = require("../src/controller/Authotp.controller");
// const connectDB = require("../database/dbConnection");


// const app = express();
// app.use(express.json());

// app.get('/', (req, res) => {
//     res.end("Mini Chowdeck server is running 😎");
// });

// app.post('/send-otp', sendOTP);
// app.post('/verify-otp', verifyOTP);


// const PORT = process.env.PORT || 9001; // fallback port
// connectDB();

// app.use((error, req, res, next) => {
//     console.error("Server error:", error);
//     res.status(500).json({
//         success: false,
//          error: "internal server error",});
// });

// app.use((req, res) => {
//     res.status(404).json({
//         success: false, 
//          error: "Route not found",});
// });


// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// })

// .on("error", (error) => {
//     console.error("❌ Server startup error:", error);
// });