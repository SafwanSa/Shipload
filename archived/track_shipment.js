
const mysql = require('mysql2/promise');
const config = require('./config');

const trackShipment = async function (trackingNumber) {
  const sql = `SELECT S.TrackingNumber as "tracking_number", Ca.Name as "carrier_name", TS.Description as "tracking_status", TS.Code as "tracking_code", S.ShipDate as "shipped_at", S.ArrivalDate as "arrived_at" FROM Shipment S, Carrier Ca, TrackStatus TS WHERE S.StatusId = TS.Id AND S.CarrierId = Ca.Id AND S.TrackingNumber = ${trackingNumber};`;
  const connection = await mysql.createConnection(config);
  const [results, ] = await connection.execute(sql);
  return results[0];
}

module.exports = trackShipment;