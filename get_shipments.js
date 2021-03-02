const mysql = require('mysql2/promise');
const config = require('./config');

const getShipments = async function () {
  const sql = 'SELECT S.TrackingNumber, C1.Name as "ship_to_name", C1.Phone as "ship_to_phone", C1.Country as "ship_to_country", C1.City as "ship_to_city", C1.Address1 as "ship_to_address1", C1.Address2 as "ship_to_address2", C1.PostalCode as "ship_to_postal_code", C2.Name as "ship_from_name", C2.Phone as "ship_from_phone", C2.Country as "ship_from_country", C2.City as "ship_from_city", C2.Address1 as "ship_from_address1", C2.Address2 as "ship_from_address2", C2.PostalCode as "ship_from_postal_code", Ca.Name as "Carrier Name", S.ShipDate, S.ArrivalDate, S.EstimatedArrivalDate FROM Shipment S, Customer C1, Carrier Ca, Customer C2 WHERE Ca.Id = S.CarrierId AND C1.Phone = S.ToPhone AND C2.Phone = S.FromPhone'
  const connection = await mysql.createConnection(config);
  const [results, ] = await connection.execute(sql);
  var shipments = [];
  for(shipment of results) {
    shipments.push(shipmentMaker(shipment));
  }
  return shipments;
}

function shipmentMaker(result) {
  return {
    shipment: {
      tracking_number: result.TrackingNumber,
      ship_to: {
        name: result.ship_to_name,
        phone_number: result.ship_to_phone,
        country: result.ship_to_country,
        city: result.ship_to_city,
        address1: result.ship_to_address1,
        address2: result.ship_to_address2,
        postal_code: result.ship_to_postal_code
      },
      ship_from: {
        name: result.ship_from_name,
        phone_number: result.ship_from_phone,
        country: result.ship_from_country,
        city: result.ship_from_city,
        address1: result.ship_from_address1,
        address2: result.ship_from_address2,
        postal_code: result.ship_from_postal_code
      },
      packages: [{
        weight: 12,
        dimentions: {
          height: 4,
            width: 3,
            length: 2
        }
      }]
    }
  };
}

module.exports = getShipments;