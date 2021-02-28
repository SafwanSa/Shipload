const express = require('express');
const cors = require('cors');
const Joi = require('joi');

const { shipmentSchema, trackShipmentSchema } = require('./shipmentSchemas');
const { StatusCodes, StatusDescriptions, TrackingStatuses } = require('./statuses');
const { shipments, trackedShipments } = require('./dummy');
const { getLabel } = require('./label');
const createShipment = require('./create_shipment');


const port = process.env.PORT || 30000;
const app = express();
app.use(express.json());
app.use(cors());


function validateShipment(shipment) {
  return shipmentSchema.validate(shipment);
}

function generateRandomId() {
  return Math.round(Math.random() * Math.pow(10, 6));
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
app.post('/api/shipments', async (req, res) => {
  const { error } = validateShipment(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const shipment = req.body
  shipment.shipment.tracking_number = generateRandomId();
  // trackedShipment = setTrackedShipment(shipment);
  const result = await createShipment(shipment.shipment);
  console.log(result);
  if(result === 200) {
    shipments.push(shipment);
    // trackedShipments.push(trackedShipment)
    res.send(shipment);
  }else {
    res.status(400).send('Something Wrong Happened with your shipment!..');
  }
});

// Track Shipment
app.get('/api/track/', (req, res) => {
  const tracking_number = parseInt(req.query.tracking_number);
  if(!tracking_number) return res.send(404);
  const shipment = trackedShipments.find(sh => sh.tracking_number === tracking_number);
  if(!shipment) return res.status(404).send("Shipment not found..!"); 
  res.send(shipment);
});

// Get Label of shipment/s
app.post('/api/labelizer', (req, res) => {
  // There is a value in the body called trackingNumbers
  if(!req.body.trackingNumbers) return res.status(400)
  .send('Tracking numbers are missing!');

  const trackingNumbers = req.body.trackingNumbers;
  const requiredShipments = shipments.filter(sh => {
    return trackingNumbers.includes(sh.tracking_number); 
  })

  if(requiredShipments.length === 0) return res.status(404).send("Shipments not found!");

  getLabel(res, requiredShipments);
});

// Hook
app.get('/api/hook', (req, res) => {
  
});

app.listen(port, () => {
  console.log(`Server is listening to port: ${port}`)
});