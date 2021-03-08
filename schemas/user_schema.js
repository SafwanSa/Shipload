const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required().min(2).max(255),
    email: Joi.string().required().min(6).max(255),
    password: Joi.string().required().min(6).max(1024)
});

const loginSchema = Joi.object({
  email: Joi.string().required().min(6).max(255),
  password: Joi.string().required().min(6).max(1024)
});

const validateUser = (user, type) => {
  if(type === 'register')
    return registerSchema.validate(user);
  else if(type === 'login')
    return loginSchema.validate(user);
  else
    return null;
};


module.exports = validateUser;