const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Shipment = require('./models/shipment');

const { shipmentSchema } = require('./shipmentSchemas');
const { getLabel } = require('./label');
const createShipment = require('./create_shipment');
const getShipment = require('./get_shipments');
const trackShipment = require('./track_shipment');
const upload = require('./upload_attachments.js');

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

const dbURL = "mongodb+srv://safwanoz:safwanoz@shipments-cluster.tapab.mongodb.net/shipmentsDB?retryWrites=true&w=majority";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  app.listen(port, () => {
    console.log(`Server is listening to port: ${port}`)
  });
  console.log("Database connection established");
})
.catch((error) => {
  console.log(error);
});

app.get('/v1', (_, res) => {
  res.send({"message": "Hello World"});
});

// List all shipments
app.get('/v1/shipments', async (_, res) => {
  const shipments = await getShipment();
  res.send(shipments);
});

// Add Shipment
app.post('/v1/shipments', async (req, res) => {
  const { error } = validateShipment(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const shipment = req.body
  shipment.shipment.tracking_number = generateRandomId();
  const result = await createShipment(shipment.shipment);
  console.log(result);
  if(result === 200) {
    res.send(shipment);
  }else {
    res.status(400).send('Something Wrong Happened with your shipment!..');
  }
});

// Track Shipment
app.get('/v1/track/', async (req, res) => {
  const tracking_number = parseInt(req.query.tracking_number);
  if(!tracking_number) return res.send(400).send("Enter the tracking number correctly!");
  const shipment = await trackShipment(tracking_number);
  if(!shipment) return res.status(404).send("Shipment not found..!"); 
  res.send(shipment);
});

// Get Label of shipment/s
app.post('/v1/labelizer', async (req, res) => {
  // There is a value in the body called trackingNumbers
  if(!req.body.trackingNumbers) return res.status(400)
  .send('Tracking numbers are missing!');

  const trackingNumbers = req.body.trackingNumbers;
  const shipments = await getShipment();

  const requestedShipment = shipments.filter(sh => {
    return trackingNumbers.includes(sh.shipment.tracking_number);
  })

  if(requestedShipment.length === 0) return res.status(404).send("Shipments not found!");

  getLabel(res, requestedShipment);
});

// Hook
app.get('/v1/hook', (req, res) => {
   const newShipment = new Shipment({
    tracking_number: generateRandomId(),
    ship_to: {
      name: "Safwan Saigh",
      phone_number: "0534501056",
      country: "Saudi Arabia",
      city: "Jeddah",
      postal_code: "23356",
      address1: "As Salamah",
      address2: "Ibn Udyes"
    },
    shi_from: {
      name: "Fozan Alkhalawi",
      phone_number: "0556800189",
      country: "Saudi Arabia",
      city: "Makkah",
      postal_code: "98767",
      address1: "Al Haram",
      address2: "Saeed Khames"
    }
  });

  newShipment.save()
  .then((result) => {
    res.send(result);
  })
  .catch((error) => {
    console.log(error);
  });
});

app.post('/v1/upload', upload.array('image', 1), (req, res) => {
  // Take as a request from the client two things: 
  // file and the shipment id. Force the user to add attachments after adding a shipment.
  console.log(req.files[0].location);
  // console.log(req.shipmentId);
  res.send({ file: req.file });
 });

