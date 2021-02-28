const { exist } = require('joi');
const mysql = require('mysql2/promise');
const config = require('./config');

const shipment =  {
    tracking_number: 84634875,
    ship_to: {
      name: "Safwan Saigh",
      phone_number: "0534501056",
      country: "Saudi Arabia",
      city: "Jeddah",
      address1: "As Salamah",
      address2: "Ibn Udyes",
      postal_code: 13334
    },
    ship_from: {
      name: "Fozan Khalawi",
      phone_number: "0556800181",
      country: "Saudi Arabia",
      city: "Medinah",
      address1: "Al haramh",
      address2: "Loly",
      postal_code: 44687
    },
    packages: [{
      weight: 12,
      dimentions: {
        height: 4,
          width: 3,
          length: 2
      }
    }]
  };

module.exports = async function createShipment(shipment) {
  const connection = await mysql.createConnection(config);
  const isSourceExist = await isCustomerExist(shipment.ship_from.phone_number, connection);
  const isDestinationExist = await isCustomerExist(shipment.ship_to.phone_number, connection);
  if (!isSourceExist) await addCustomer(shipment.ship_from, connection);
  if (!isDestinationExist) await addCustomer(shipment.ship_to, connection);

  const result = addShipment(shipment, connection);
  return result;
};

async function isCustomerExist(phone, connection) {
  const sql = `SELECT * FROM Customer WHERE Phone=${phone}`;
  const [results, ] = await connection.execute(sql);
  return results.length !== 0;
}

async function addCustomer(customer, connection) {
  const sql = `INSERT INTO Customer(Phone, Name, Country, City, Address1, Address2, PostalCode) VALUES ('${customer.phone_number}', '${customer.name}', '${customer.country}', '${customer.city}', '${customer.address1}', '${customer.address2}', ${customer.postal_code})`;
  const [results, ] = await connection.execute(sql);
  if(results.affectedRows === 1) {
    return 200;
  }else {
    return 500;
  }
}

async function addShipment(shipment, connection) {
  const date = new Date().toISOString();
  const sql = `INSERT INTO Shipment(TrackingNumber, FromPhone, ToPhone, CarrierId, StatusId, ShipDate, ArrivalDate, EstimatedArrivalDate) VALUES (${shipment.tracking_number}, '${shipment.ship_from.phone_number}', '${shipment.ship_to.phone_number}', 1, 1, '${date}', '${date}', '${date}');`;

  const [results, ] = await connection.execute(sql);
  if(results.affectedRows === 1) {
    return 200;
  }else {
    return 500;
  }
}