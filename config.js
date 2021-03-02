const config = {
  host: process.env.DB_HOST || 'freedb.tech',
  user: process.env.DB_USER || 'freedbtech_safwanoz',
  password: process.env.DB_PASSWORD || 'safwanoz',
  database: process.env.DB_NAME || 'freedbtech_shipmentsapi',
};


module.exports = config;