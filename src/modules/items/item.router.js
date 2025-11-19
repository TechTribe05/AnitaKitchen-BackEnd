const express = require("express");

const validateUser = require("../../middleware/validate_user");
const { uploadSingleImg } = require("../../../multer/multer");
const { createItem, getAllItems, getAllitems } = require("./item.controller");

const itemRouter = express.Router();

itemRouter
   .route("/item-create")
   .post(validateUser, uploadSingleImg, createItem);
   itemRouter.route("/all-items").get(validateUser, getAllitems );

module.exports =  itemRouter ;   
