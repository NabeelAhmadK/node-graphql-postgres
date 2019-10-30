const objection = require("objection");
const model = {};
let initialized = false;

/**
 * Initializes connection, loads model files and assign them to exported property `module.exports.model`. Also assigns `objection.Model`
 * or given subclass of it to `module.exports.Model`. Should be called only once.
 * @param    {knex}                      knex                            - Knex instance to use with model.
 * @param    {objection.Model}           [customModel=objection.Model]   - Optional objection model object, if you want to use custom subclassed model. See [custom query builder](http://vincit.github.io/objection.js/#custom-query-builder)
 * @returns  {Object.<string, Object>}                                   - Keys are names of entities, values are `objection.Model` subclasses for that entity.
 * @throws                                                               - Init function supposed to be called only once. When called more than once, this function throws exception.
 */

/*------------------------------------*/
/*----------Override DB Errors--------*/
/*------------------------------------*/

const { DbErrors } = require("objection-db-errors");

class BaseModel extends DbErrors(objection.Model) {
  $beforeUpdate() {
    let modelProperties = this.constructor.jsonSchema.properties;
    if ("mod_date" in modelProperties) {
      this.mod_date = new Date().toISOString();
    }
  }
}

/*------------------------------------*/
/*----------End Override DB Errors--------*/
/*------------------------------------*/

function init(knex, customModel) {
  if (initialized) {
    throw new Error(
      "Model is already initialized. init function must be called only once."
    );
  }
  initialized = true;

  module.exports.Model = BaseModel; // If no model is given use default Model.
  module.exports.Model.knex(knex); // Give the connection to objection.

  /* eslint-disable global-require */
  // Import model files and assign them to `model` object.
  model.Employee = require("./definition/employee.js");
}

/** objection.Model or subclass of it. */
module.exports.Model = null; // Will be assigned by init function

/** Objection models representing database tables. */
module.exports.model = model;

/** Init function */

module.exports.init = init;
module.exports.objection = objection;
