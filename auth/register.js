const bcrypt = require('bcryptjs');
const validateUser = require('../schemas/user_schema');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


async function getUser(email) {
  return User.findOne({ email });
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function createUser(name, email, password) {
  return new User({ name, email, password });
}

function saveUser(user, res) {
  user.save()
  .then((result) => {
    res.send({ user_id: result._id });
  })
  .catch((error) => {
    res.status(400).send(error);
  });
}

const register = async (req, res) => {
  const { error } = validateUser(req.body, 'register');
  if(error) return res.status(400).send(error.details[0].message);
   
  const userExist = await getUser(req.body.email);
  if(userExist) return res.status(400).send(`User with email (${req.body.email}) already exists!`);
  
  const hashedPassword = await hashPassword(req.body.password);
  const user = createUser(req.body.name, req.body.email, hashedPassword);

  saveUser(user, res);
};

module.exports = register;