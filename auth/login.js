const bcrypt = require('bcryptjs');
const validateUser = require('../schemas/user_schema');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { error } = validateUser(req.body, 'login');
  if(error) return res.status(400).send(error.details[0].message);

  const user = await getUser(req.body.email);
  if(!user) return res.status(400).send(`Incorrect credentials!`);

  const validPassword = await validatePassword(user, req.body.password);
  if(!validPassword) return res.status(400).send(`Incorrect credentials!`);

  const token = await getToken(user);
  res.header('auth_token', token)
  .send({ message:"User logged in successfully" });
};

async function getToken(user) {
  return jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
}

async function validatePassword(user, password) {
  return bcrypt.compare(password, user.password);
}

async function getUser(email) {
  return User.findOne({ email });
}

module.exports = login;