const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const { shipmentSchema } = require('./shipmentSchemas');
const { shipments } = require('./dummy');
const { number } = require('joi');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 30000;


function validateShipment(shipment) {
  return shipmentSchema.validate(shipment);
}

function generateRandomId() {
  return Math.round(Math.random() * Math.pow(10, 12));
}


app.get('/api', (_, res) => {
  res.send({"message": "Hello World"});
});

// List all shipments
app.get('/api/shipments', (_, res) => {
  res.send(shipments);
});

// Add Shipment
app.post('/api', (req, res) => {
  const { error } = validateShipment(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const shipment = req.body
  shipment.tracking_number = generateRandomId();
  shipment.shipment_id = `${shipments.length + 1}`;
  shipments.push(shipment);
  res.send(shipment);
});

// Track Shipment
app.get('/api/track/', (req, res) => {
  const tracking_number = parseInt(req.query.tracking_number);
  console.log(tracking_number);
  if(!tracking_number) return res.send(404);
  
  const shipment = shipments.find(sh => sh.tracking_number === tracking_number);

  if(!shipment) return res.status(404).send("Shipment not found..!"); 

  // Send Tracking info, and not the shipment itself

  res.send(shipment);
});
















app.listen(port, () => {
  console.log(`Server is listening to port: ${port}`)
});

