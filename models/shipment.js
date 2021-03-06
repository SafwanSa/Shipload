const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shipmentSchema = new Schema({
  tracking_number: {
    type: number,
    required: true
  },
  ship_to: {
    name: String,
    phone_number: String,
    country: String,
    city: String,
    postal_code: String,
    address1: String,
    address2: String
  },
  shi_from: {
    name: String,
    phone_number: String,
    country: String,
    city: String,
    postal_code: String,
    address1: String,
    address2: String
  },
  tracking_status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrackingStatus"
  },
  carrier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carrier"
  }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;