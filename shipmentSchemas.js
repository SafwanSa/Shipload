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

const packageSchema = {
  weight: Joi.number().required(),
  dimensions: Joi.object({
    height: Joi.number(),
    width: Joi.number()
  })
}

exports.shipmentSchema = Joi.object({
  shipment: Joi.object({
    ship_to: personSchema,
    ship_from: personSchema,
    packages_weight: Joi.number()
  })
});

exports.trackShipmentSchema = Joi.object({
  tracking_number: Joi.number().required(),
  status_code: Joi.string().required(),
  status_description: Joi.string().required(),
  tracking_status: Joi.string().required(),
  // carrier_status_description: Joi.string().required(),
  ship_date: Joi.string().required(),
  estimated_delivery_date: Joi.string().required(),
  actual_delivery_date: Joi.string(),
});


