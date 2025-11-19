// src/joi/user.validator.js
const Joi = require("joi");

const addUserValidator = Joi.object({
  name: Joi.string().required().trim().min(3).max(40),

  email: Joi.string()
    .required()
    .trim()
    .min(5)
    .email({ tlds: { allow: ["com", "org", "net", "biz"] } }),

  phone: Joi.string()
    .required()
    .max(15)
    .pattern(/^[0-9+\s-]+$/), // allows digits, +, space, dash

  userName: Joi.string().alphanum().min(3).max(10).required(),

  password: Joi.string()
    .required()
    .trim()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    ), // must be at least 8 chars, include upper, lower, number, special char

  country: Joi.string().trim(),
});

module.exports = addUserValidator ;   // ✅ keep named export
