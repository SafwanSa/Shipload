const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusSchema = new Schema({
  code: String,
  description: String,
  status: String
});

const TrackingStatus = mongoose.model('TrackingStatus', statusSchema);

module.exports = TrackingStatus;

const list = [
  {
    code: 'IT',
    description: 'In Transit', 
    status: 'in_transit'
  },
  {
    code: 'DE',
    description: 'Delivered', 
    status: 'delivered'
  },
  {
    code: 'EX',
    description: 'Exception', 
    status: 'error'
  },    {
    code: 'UN',
    description: 'Unknown', 
    status: 'unknown'
  },    {
    code: 'AT',
    description: 'Delivery Attempt', 
    status: 'N/A'
  },
  {
    code: 'NY',
    description: 'Not Yet In System', 
    status: 'N/A'
  },
  {
    code: 'HD',
    description: 'On Hold', 
    status: 'on_hold'
  }
];