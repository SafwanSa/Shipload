const mongoose = require('mongoose');
require('./carrier');
require('./trackingStatus');

const Schema = mongoose.Schema;

const shipmentSchema = new Schema({
  tracking_number: {
    type: Number,
    required: true
  },
  arrived_at: String,
  ship_to: {
    name: String,
    phone_number: String,
    country: String,
    city: String,
    postal_code: String,
    address1: String,
    address2: String
  },
  ship_from: {
    name: String,
    phone_number: String,
    country: String,
    city: String,
    postal_code: String,
    address1: String,
    address2: String,
  },
  carrier: {
    type: Schema.Types.ObjectId,
    ref: "Carrier"
  },
  events: [{
    occurred_at: String,
    description: String,
    country: String,
    city: String,
    tracking_status: {
      type: Schema.Types.ObjectId,
      ref: 'TrackingStatus'
    }
  }],
  attachments: [String],
  packages_weight: Number,
  packages_quantity: Number,
  description: String
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;