const mysql = require('mysql2/promise');
const config = require('./config');

const saveAttachment = async function (id, url) {
  const sql = `INSERT INTO Attachments(Url, ShipmentId) VALUES("${url}", ${id})`;
  const connection = await mysql.createConnection(config);
  const [results, ] = await connection.execute(sql);
  console.log(results);
  return results;
}


module.exports = saveAttachment;