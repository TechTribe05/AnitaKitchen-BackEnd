const express = require("express");

const validateUser = require("../../middleware/validate_user");
const { addItemToCart, getLogginUserCart, initializePayment, verifyPayment } = require("./cart.controller");

const cartRouter = express.Router();

cartRouter.route("/add-to-cart").post(validateUser, addItemToCart);
cartRouter.route("/get-user-cart").get(validateUser, getLogginUserCart);
cartRouter.route("/payment/initialize").post(validateUser,  initializePayment);
cartRouter.route("/payment/verify/:reference").get(validateUser,  verifyPayment);



module.exports =  cartRouter ;   
