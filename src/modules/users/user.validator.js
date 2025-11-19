///This helps you define rules (a schema) for your data, and then automatically checks if the incoming data matches those rules.
const Joi = require("joi");

const addUserValidator = Joi.object({
    name: Joi.string().required().trim().min(3).max(40),
    email: Joi.string()
    .required
    .trim()
    .min(5)
    .email({minDomainSegment: 2, tlds: { allow: ["com", "org", "net", "biz"] } }),
   phone: Joi.string().required().trim().max(15), 
  userName: Joi.string().alphanum().min(3).max(10).required(),
  password: Joi.string()
  .required()
  .trim()
  .min(5)
  .pattern( new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')),
  country:  Joi.string().trim(),
});

module.exports = { addUserValidator };