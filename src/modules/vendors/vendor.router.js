const express = require("express");
const { getAVendorDetail, getAllVendor, getAllVendors, createVendor, updateVendor, pauseVendor, searchVendors } = require("./vendor.controller");

const validateUser = require("../../middleware/validate_user");
 
const vendorRouter = express.Router();

vendorRouter.route("/vendor-detail/:id").get(getAVendorDetail);
vendorRouter.route("/all-vendor-specific").get(getAllVendor);
vendorRouter.route("/all-vendors").get(getAllVendors);
vendorRouter.route("/vendor-create").post( validateUser, createVendor);
vendorRouter.route("/vendor-update").put(updateVendor);
vendorRouter.route("/vendor-pause").put(pauseVendor);
vendorRouter.route("/vendor-search").get(searchVendors);

module.exports = { vendorRouter };