require("dotenv").config(); // must be at the very top 
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./apidoc.yaml");
const cors = require("cors");
const path = require("path");
const connectDB = require("./database/dbConnection");
const { register, login, getUserinfo, getUseremail } = require("./src/controller/user.controller");
const validateUser = require("./src/middleware/validate_user");   //JWT MD
const { addUserValidator } = require("./src/joi/user.validator"); 
const { validate } = require("./src/middleware/validate");   //JOI validator MD
const { vendorRouter } = require("./src/modules/vendors/vendor.router");
const itemRouter  = require("./src/modules/items/item.router");
// const  { addItemToCart } = require("./src/modules/cart/cart.controller");
const cartRouter = require("./src/modules/cart/cart.router");
// const { restaurantRouter } = require("./src/modules/restaurants/restaurant.router");
// const { customerRouter }   = require("./src/modules/customers/customer.router");



const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));



//Image retrival handling
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root test route
app.get('/', (req, res) => {
    res.end("Chowdeck server is running 😎");
});

// USER Routes
app.post('/reg', validate(addUserValidator), register);  //JOI validation
app.post('/login', login);
app.get('/info', validateUser, getUserinfo);           //JWT auth
app.get('/email', validateUser, getUseremail);     //JWT auth
app.use("/api/v1/vendor", vendorRouter);
app.use("/api/v1/item", itemRouter);
app.use("/api/v1/cart", cartRouter);

// app.use("/api/v1/restaurant", restaurantRouter);
// app.use("/api/v1/customer",   customerRouter); 


const PORT = process.env.PORT || 9000; // fallback port
connectDB();

//THIS HANDLE THE SERVER ERROR===(global error)
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("❌ Server startup error:", error);
});
 
