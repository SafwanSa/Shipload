const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const { shipmentSchema, trackShipmentSchema } = require('./shipmentSchemas');
const { StatusCodes, StatusDescriptions, TrackingStatuses } = require('./statuses');
const { shipments, trackedShipments } = require('./dummy');
const { getLabel } = require('./label');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 30000;

function validateShipment(shipment) {
  return shipmentSchema.validate(shipment);
}

function validateTrackShipmentSchema(trackedShipment) {
  return trackShipmentSchema.validate(trackedShipment);
}

function generateRandomId() {
  return Math.round(Math.random() * Math.pow(10, 12));
}

function setTrackedShipment(shipment) {
  return trackedShipment = {
    shipment_id: shipment.shipment_id,
    tracking_number: shipment.tracking_number,
    status_code: StatusCodes.AC,
    status_description: StatusDescriptions.AC,
    tracking_status: TrackingStatuses.AC,
  }
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
  trackedShipment = setTrackedShipment(shipment);
  shipments.push(shipment);
  trackedShipments.push(trackedShipment)
  res.send(shipment);
});

// Track Shipment
app.get('/api/track/', (req, res) => {
  const tracking_number = parseInt(req.query.tracking_number);
  if(!tracking_number) return res.send(404);
  const shipment = trackedShipments.find(sh => sh.tracking_number === tracking_number);
  if(!shipment) return res.status(404).send("Shipment not found..!"); 
  res.send(shipment);
});

// Get Label
app.get('/api/label', (req, res) => {
  getLabel(res);
});

app.listen(port, () => {
  console.log(`Server is listening to port: ${port}`)
});

