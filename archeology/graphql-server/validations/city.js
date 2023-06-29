// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(city) {

    city.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    city.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "city_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "founding_date": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "founding_culture": {
                "type": ["string", "null"]
            },
            "surface_area": {
                "type": ["integer", "null"]
            },
            "has_subway": {
                "type": ["boolean", "null"]
            },
            "population": {
                "type": ["integer", "null"]
            },
            "country_id": {
                "type": ["string", "null"]
            }
        }
    }

    city.prototype.asyncValidate = ajv.compile(
        city.prototype.validatorSchema
    )

    city.prototype.validateForCreate = async function(record) {
        return await city.prototype.asyncValidate(record)
    }

    city.prototype.validateForUpdate = async function(record) {
        return await city.prototype.asyncValidate(record)
    }

    city.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    city.prototype.validateAfterRead = async function(record) {
        return await city.prototype.asyncValidate(record)
    }

    return city
}