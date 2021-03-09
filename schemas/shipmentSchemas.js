const Joi = require('joi');
const personSchema = Joi.object({
  name: Joi.string().required().min(2),
  phone_number: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  address1: Joi.string().required(),
  address2: Joi.string().min(0),
  postal_code: Joi.number().required()
});

const shipmentSchema = Joi.object({
  ship_to: personSchema,
  ship_from: personSchema,
  packages_weight: Joi.number(),
  packages_quantity: Joi.number(),
  description: Joi.string()
});

// exports.trackShipmentSchema = Joi.object({
//   tracking_number: Joi.number().required(),
//   status_code: Joi.string().required(),
//   status_description: Joi.string().required(),
//   tracking_status: Joi.string().required(),
//   // carrier_status_description: Joi.string().required(),
//   ship_date: Joi.string().required(),
//   estimated_delivery_date: Joi.string().required(),
//   actual_delivery_date: Joi.string(),
// });

const validateShipment = (shipment) => {
  return shipmentSchema.validate(shipment);
};

module.exports = validateShipment;