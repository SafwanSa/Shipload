const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required().min(2).max(255),
    email: Joi.string().required().min(6).max(255),
    password: Joi.string().required().min(6).max(1024)
});

const validateUser = (user) => {
  return userSchema.validate(user);
};

module.exports = validateUser;