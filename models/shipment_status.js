const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusSchema = new Schema({
  code: String,
  description: String,
  status: String
});

const TrackingStatus = mongoose.model('TrackingStatus', statusSchema);

module.exports = TrackingStatus;