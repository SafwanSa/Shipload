const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  occurred_at: String,
  description: String,
  country: String,
  city: String,
  tracking_status: {
    type: Schema.Types.ObjectId,
    ref: 'TrackingStatus'
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;