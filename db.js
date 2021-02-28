const mysql = require('mysql2/promise');
const config = {
  host: process.env.DB_HOST || 'freedb.tech',
  user: process.env.DB_USER || 'freedbtech_safwanoz',
  password: process.env.DB_PASSWORD || 'safwanoz',
  database: process.env.DB_NAME || 'freedbtech_shipmentsapi',
};

exports.query = async function (sql, params) {
  const connection = await mysql.createConnection(config);
  const [results, ] = await connection.execute(sql);
  console.log(1);
  return results;
}