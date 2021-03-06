const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carrierSchema = new Schema({
  name: String,
  code: String
});

const Carrier = mongoose.model('Carrier', carrierSchema);

module.exports = Carrier;