// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(country) {

    country.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    country.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "country_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "population": {
                "type": ["integer", "null"]
            },
            "size": {
                "type": ["integer", "null"]
            },
            "river_ids": {
                "type": ["array", "null"]
            },
            "capital_id": {
                "type": ["string", "null"]
            }
        }
    }

    country.prototype.asyncValidate = ajv.compile(
        country.prototype.validatorSchema
    )

    country.prototype.validateForCreate = async function(record) {
        return await country.prototype.asyncValidate(record)
    }

    country.prototype.validateForUpdate = async function(record) {
        return await country.prototype.asyncValidate(record)
    }

    country.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    country.prototype.validateAfterRead = async function(record) {
        return await country.prototype.asyncValidate(record)
    }

    return country
}