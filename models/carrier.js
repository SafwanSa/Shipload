const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carrierSchema = new Schema({
  name: String,
  code: String
});

const Carrier = mongoose.model('Carrier', carrierSchema);

module.exports = Carrier;
const list = [
  {
    name: 'FedEx',
    code: 'fedex'
  },
  {
    name: 'DHL Express',
    code: 'dhl_express'
  },
  {
    name: 'DHL ECommerce',
    code: 'dhl_global_mail'
  },
  {
    name: 'Aramex',
    code: 'aramex'
  },
  {
    name: 'SMSA Express',
    code: 'smsa_express'
  },
  {
    name: 'Unknown Carrier',
    code: 'n/a'
  },
];