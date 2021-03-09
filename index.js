const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Shipment = require('./models/shipment');
const TrackingStatus = require('./models/trackingStatus');
const Carrier = require('./models/carrier');

const login = require('./auth/login');
const register = require('./auth/register');

const validateShipment = require('./schemas/shipmentSchemas');
const label = require('./utilities/label');
const upload = require('./utilities/upload_attachments.js');

const port = process.env.PORT || 30000;
const app = express();
app.use(express.json());
app.use(cors());


function generateRandomId() {
  return Math.round(Math.random() * Math.pow(10, 6));
}

function dbConnect() {
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is listening to port: ${port}`)
      });
      console.log("Database connection established");
    })
    .catch((error) => {
      console.log(error);
    });
}

function auth(req, res, next) {
  const token = req.header('auth_token');
  if(!token) return res.status(401).send('Access Denied!');
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch(err) {
    res.status(400).send('Invalid Token!');
  }
}

dbConnect();

app.get('/v1', (_, res) => {
  res.send({"message": "Hello World"});
});

// List all shipments
app.get('/v1/shipments', async (_, res) => {
 Shipment.find()
  .populate([
    {
      path: 'carrier',
      select: { '_id': 0 }
    },
    { 
      path: 'events.tracking_status',
      select: { '_id': 0, '__v': 0 }
    }
  ])
  .exec((shipments, error) => {
    if(error) return res.send(error);
    if(!shipments) return res.status(404).send('There are no shipments!');
    res.send(shipments);
  })
});

// Lists all tracking statuses
app.get('/v1/tracking-statuses', async (_, res) => {
  TrackingStatus.find()
  .then((result) => {
    res.send(result);
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});

// List all carriers
app.get('/v1/carriers', async (_, res) => {
  Carrier.find()
  .then((result) => {
    res.send(result);
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});


// Add Shipment
app.post('/v1/create-shipment', async (req, res) => {
  const { error } = validateShipment(req.body.shipment);
  if(error) return res.status(400).send(error.details[0].message);
  const freshShipment = req.body.shipment;
  freshShipment.tracking_number = generateRandomId();
  freshShipment.events = [{
    occurred_at: Date().toString(),
    description: "Shipment established",
    country: freshShipment.ship_from.country,
    city: freshShipment.ship_from.city,
    tracking_status: "60449851d69928531b6ecf46"
  }];
  
  // Extra checking to prevent the carrier to be null
  let carrierId = req.body.carrier_id;
  if(!carrierId) {
    carrierId = `${(await Carrier.findOne({ code: 'n/a' }))._id}`;
  }

  freshShipment.carrier = carrierId;

  const shipment = new Shipment({...freshShipment});

  shipment.save()
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
  });
});

// Track Shipment
app.get('/v1/track-shipment', async (req, res) => {
  const tracking_number = parseInt(req.query.tracking_number);
  if(!tracking_number) return res.send(400).send("Enter the tracking number correctly!");
  Shipment.findOne({ "tracking_number":  tracking_number}, {
    "_id": 0,
    "ship_from": 0,
    "ship_to": 0,
    "createdAt": 0,
    "updatedAt": 0
  })
  .populate([
    {
      path: 'carrier',
      select: { '_id': 0 }
    },
    { 
      path: 'events.tracking_status',
      select: { '_id': 0, '__v': 0 }
    }
  ])
  .exec((err, shipment) => {
    if(err) return res.send(err);
    if(!shipment) return res.status(404).send("Shipment not found!");
    res.send(shipment);
  });
});

// Get Label of shipment/s
app.post('/v1/get-label', async (req, res) => {
  // There is a value in the body called trackingNumbers
  if(!req.body.trackingNumbers) return res.status(400)
  .send('Tracking numbers are missing!');

  const trackingNumbers = req.body.trackingNumbers;
  const shipments = await Shipment.find({ "tracking_number": {"$in": trackingNumbers}}, {
    "_id": 0,
  })
  
  if(!shipments) return res.status(404).send("Shipments not found!");

  // res.send(shipments);
  label(res, requestedShipment);
});

// upload attachments to a shipment
app.post('/v1/upload-attachments', upload.array('file', 3), async (req, res) => {
  const shipmentId = req.body.shipmentId;
  if(!shipmentId) return res.status(404).send("Shipment not found!");
  const shipment = await Shipment.findOne({"_id": shipmentId});
  for(let file of req.files) {
    shipment.attachments.push(file.location)
  }
  shipment.save()
    .then((_) => {
      res.send({ file: req.file });
    }).catch((error) => {
      console.log(error);
      res.send({ file: req.file });
    })
 });

// Register a user
app.post('/v1/register', async (req, res) => {
  register(req, res);
});

// Login a user
app.post('/v1/login', async (req, res) => {
  login(req, res);
});

app.get('/v1/token', auth, (_, res) => {
  res.json({ message: 'This is a private endpoint' });
});