const Joi = require('joi');
const personSchema = Joi.object({
  name: Joi.string().required().min(2),
  phone_number: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  address_line1: Joi.string().required(),
  address_line2: Joi.string().min(0),
  street_name: Joi.string().min(0),
});

const packageSchema = {
  weight: Joi.number().required(),
  dimensions: Joi.object({
    height: Joi.number(),
    width: Joi.number(),
    length: Joi.number()
  })
}

exports.shipmentSchema = Joi.object({
  shipment: Joi.object({
    placed_at: Joi.string().required(),
    ship_to: personSchema,
    ship_from: personSchema,
    packages: Joi.array().items(packageSchema)
  })
});