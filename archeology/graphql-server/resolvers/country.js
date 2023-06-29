/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const country = require(path.join(__dirname, '..', 'models', 'index.js')).country;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');
const validatorUtil = require("../utils/validatorUtil");
const associationArgsDef = {
    'addCapital': 'city',
    'addCities': 'city',
    'addRivers': 'river'
}



/**
 * country.prototype.capital - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
country.prototype.capital = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.capital_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneCity({
                [models.city.idAttribute()]: this.capital_id
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.city.idAttribute(),
                "value": this.capital_id,
                "operator": "eq"
            });
            let found = (await resolvers.citiesConnection({
                search: nsearch,
                pagination: {
                    first: 1
                }
            }, context)).edges;
            if (found.length > 0) {
                return found[0].node
            }
            return found;
        }
    }
}

/**
 * country.prototype.citiesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
country.prototype.citiesFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "country_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.cities({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * country.prototype.countFilteredCities - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
country.prototype.countFilteredCities = function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "country_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countCities({
        search: nsearch
    }, context);
}

/**
 * country.prototype.citiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
country.prototype.citiesConnection = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "country_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.citiesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * country.prototype.riversFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
country.prototype.riversFilter = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.river_ids) || this.river_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.river.idAttribute(),
        "value": this.river_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.rivers({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * country.prototype.countFilteredRivers - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
country.prototype.countFilteredRivers = function({
    search
}, context) {

    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.river_ids) || this.river_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.river.idAttribute(),
        "value": this.river_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countRivers({
        search: nsearch
    }, context);
}

/**
 * country.prototype.riversConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
country.prototype.riversConnection = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.river_ids) || this.river_ids.length === 0) {
        return {
            edges: [],
            rivers: [],
            pageInfo: {
                startCursor: null,
                endCursor: null,
                hasPreviousPage: false,
                hasNextPage: false
            }
        };
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.river.idAttribute(),
        "value": this.river_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.riversConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
country.prototype.handleAssociations = async function(input, benignErrorReporter, token) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addCities)) {
        promises_add.push(this.add_cities(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.addRivers)) {
        promises_add.push(this.add_rivers(input, benignErrorReporter, token));
    }
    if (helper.isNotUndefinedAndNotNull(input.addCapital)) {
        promises_add.push(this.add_capital(input, benignErrorReporter, token));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeCities)) {
        promises_remove.push(this.remove_cities(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.removeRivers)) {
        promises_remove.push(this.remove_rivers(input, benignErrorReporter, token));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeCapital)) {
        promises_remove.push(this.remove_capital(input, benignErrorReporter, token));
    }

    await Promise.all(promises_remove);

}
/**
 * add_cities - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
country.prototype.add_cities = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.addCities.map(associatedRecordId => {
        return {
            country_id: this.getIdValue(),
            [models.city.idAttribute()]: associatedRecordId
        }
    });
    await models.city.bulkAssociateCityWithCountry_id(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * add_rivers - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
country.prototype.add_rivers = async function(input, benignErrorReporter, token) {

    await country.add_river_ids(this.getIdValue(), input.addRivers, benignErrorReporter, token);
    this.river_ids = helper.unionIds(this.river_ids, input.addRivers);
}

/**
 * add_capital - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
country.prototype.add_capital = async function(input, benignErrorReporter, token) {
    const associated = await country.readAllCursor({
            field: "capital_id",
            operator: "eq",
            value: input.addCapital
        },
        undefined, {
            first: 2
        },
        benignErrorReporter
    );
    const num = associated.countries.length;
    if (num > 0) {
        if (num > 1) {
            benignErrorReporter.push({
                message: `Please manually fix inconsistent data! Record has been added without association!`,
            });
            return 0;
        } else {
            const country_id = associated.countries[0].country_id;
            const removed = await country.remove_capital_id(country_id, input.addCapital, benignErrorReporter, token);
            benignErrorReporter.push({
                message: `Hint: update ${removed} existing association!`,
            });
        }
    }
    await country.add_capital_id(this.getIdValue(), input.addCapital, benignErrorReporter, token);
    this.capital_id = input.addCapital;
}

/**
 * remove_cities - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
country.prototype.remove_cities = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.removeCities.map(associatedRecordId => {
        return {
            country_id: this.getIdValue(),
            [models.city.idAttribute()]: associatedRecordId
        }
    });
    await models.city.bulkDisAssociateCityWithCountry_id(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * remove_rivers - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
country.prototype.remove_rivers = async function(input, benignErrorReporter, token) {

    await country.remove_river_ids(this.getIdValue(), input.removeRivers, benignErrorReporter, token);
    this.river_ids = helper.differenceIds(this.river_ids, input.removeRivers);
}

/**
 * remove_capital - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
country.prototype.remove_capital = async function(input, benignErrorReporter, token) {
    if (input.removeCapital == this.capital_id) {
        await country.remove_capital_id(this.getIdValue(), input.removeCapital, benignErrorReporter, token);
        this.capital_id = null;
    }
}



/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let country = await resolvers.readOneCountry({
        country_id: id
    }, context);
    //check that record actually exists
    if (country === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    let get_to_one_associated_fk = 0;
    promises_to_many.push(country.countFilteredCities({}, context));

    get_to_many_associated_fk += Array.isArray(country.river_ids) ? country.river_ids.length : 0;
    promises_to_one.push(country.capital({}, context));


    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;

    return get_to_one_associated + get_to_many_associated_fk + get_to_many_associated + get_to_one_associated_fk;
}

/**
 * validForDeletion - Checks wether a record is allowed to be deleted
 *
 * @param  {ID} id      Id of record to check if it can be deleted
 * @param  {object} context Default context by resolver
 * @return {boolean}         True if it is allowed to be deleted and false otherwise
 */
async function validForDeletion(id, context) {
    if (await countAssociatedRecordsWithRejectReaction(id, context) > 0) {
        throw new Error(`country with country_id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

/**
 * updateAssociations - update associations for a given record
 *
 * @param  {ID} id      Id of record
 * @param  {object} context Default context by resolver
 */
const updateAssociations = async (id, context) => {
    const country_record = await resolvers.readOneCountry({
            country_id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * countries - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    countries: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "countries");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await country.readAll(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countriesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    countriesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "countriesConnection");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await country.readAllCursor(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneCountry - Check user authorization and return one record with the specified country_id in the country_id argument.
     *
     * @param  {number} {country_id}    country_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with country_id requested
     */
    readOneCountry: async function({
        country_id
    }, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneCountry");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await country.readById(country_id, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countCountries - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countCountries: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await country.countRecords(search, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCountryForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCountryForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'country', 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);
            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForCreate",
                    country,
                    inputSanitized
                );
                return true;
            } catch (error) {
                delete input.skipAssociationsExistenceChecks;
                error.input = input;
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCountryForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCountryForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'country', 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);
            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForUpdate",
                    country,
                    inputSanitized
                );
                return true;
            } catch (error) {
                delete input.skipAssociationsExistenceChecks;
                error.input = input;
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCountryForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {country_id} country_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCountryForDeletion: async ({
        country_id
    }, context) => {
        if ((await checkAuthorization(context, 'country', 'read')) === true) {
            try {
                await validForDeletion(country_id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    country,
                    country_id);
                return true;
            } catch (error) {
                error.input = {
                    country_id: country_id
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCountryAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {country_id} country_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCountryAfterReading: async ({
        country_id
    }, context) => {
        if ((await checkAuthorization(context, 'country', 'read')) === true) {
            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    country,
                    country_id);
                return true;
            } catch (error) {
                error.input = {
                    country_id: country_id
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },
    /**
     * addCountry - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addCountry: async function(input, context) {
        let authorization = await checkAuthorization(context, 'country', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            let createdCountry = await country.addOne(inputSanitized, context.benignErrors, token);
            await createdCountry.handleAssociations(inputSanitized, context.benignErrors, token);
            return createdCountry;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteCountry - Check user authorization and delete a record with the specified country_id in the country_id argument.
     *
     * @param  {number} {country_id}    country_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteCountry: async function({
        country_id
    }, context) {
        if (await checkAuthorization(context, 'country', 'delete') === true) {
            if (await validForDeletion(country_id, context)) {
                await updateAssociations(country_id, context);
                let token = context.request ?
                    context.request.headers ?
                    context.request.headers.authorization :
                    undefined :
                    undefined;
                return country.deleteOne(country_id, context.benignErrors, token);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateCountry - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateCountry: async function(input, context) {
        let authorization = await checkAuthorization(context, 'country', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            let updatedCountry = await country.updateOne(inputSanitized, context.benignErrors, token);
            await updatedCountry.handleAssociations(inputSanitized, context.benignErrors, token);
            return updatedCountry;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateCountryWithCapital_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCountryWithCapital_id: async function(bulkAssociationInput, context) {
        let token = context.request ?
            context.request.headers ?
            context.request.headers.authorization :
            undefined :
            undefined;
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                capital_id
            }) => capital_id)), models.city, token);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), country, token);
        }
        return await country.bulkAssociateCountryWithCapital_id(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },
    /**
     * bulkDisAssociateCountryWithCapital_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCountryWithCapital_id: async function(bulkAssociationInput, context) {
        let token = context.request ?
            context.request.headers ?
            context.request.headers.authorization :
            undefined :
            undefined;
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                capital_id
            }) => capital_id)), models.city, token);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), country, token);
        }
        return await country.bulkDisAssociateCountryWithCapital_id(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },

    /**
     * csvTableTemplateCountry - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateCountry: async function(_, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return country.csvTableTemplate(context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countriesZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    countriesZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "country", "read")) === true) {
            return country.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

}