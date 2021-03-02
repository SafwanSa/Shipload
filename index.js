const express = require('express');
const cors = require('cors');
const multer = require("multer")

const { shipmentSchema } = require('./shipmentSchemas');
const { getLabel } = require('./label');
const createShipment = require('./create_shipment');
const getShipment = require('./get_shipments');
const trackShipment = require('./track_shipment');

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


app.get('/api', (_, res) => {
  res.send({"message": "Hello World"});
});

// List all shipments
app.get('/api/shipments', async (_, res) => {
  const shipments = await getShipment();
  res.send(shipments);
});

// Add Shipment
app.post('/api/shipments', async (req, res) => {
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
app.get('/api/track/', async (req, res) => {
  const tracking_number = parseInt(req.query.tracking_number);
  if(!tracking_number) return res.send(400).send("Enter the tracking number correctly!");
  const shipment = await trackShipment(tracking_number);
  if(!shipment) return res.status(404).send("Shipment not found..!"); 
  res.send(shipment);
});

// Get Label of shipment/s
app.post('/api/labelizer', async (req, res) => {
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
app.get('/api/hook', (req, res) => {
  
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("dest");
    cb(null, "/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const uploadStorage = multer({ storage: storage })

// Single file
app.post("/upload/single", uploadStorage.single("file"), (req, res) => {
  return res.send("Single file")
})
//Multiple files
app.post("/upload/multiple", uploadStorage.array("file", 10), (req, res) => {
  return res.send("Multiple files")
})






app.listen(port, () => {
  console.log(`Server is listening to port: ${port}`)
});