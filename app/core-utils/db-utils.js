"use strict";
const { Model } = require("objection");
const Knex = require("knex");
const LOG_CATEGORY = "POSTGRES-UTILS";
var logger = require("../../utils/logger");
const models = require("../../model/");
const DBUtils = {};
let knexObj;
let knexPool;
let corePool;
const { Pool } = require("pg");
const { transaction } = require("objection");

async function initDB(dbConfiguration) {
  try {
    // configuration for probe ( core client )
    let corePgConfig = {
      host: dbConfiguration.connection.host,
      database: dbConfiguration.connection.database,
      user: dbConfiguration.connection.user,
      password: dbConfiguration.connection.password,
      port: dbConfiguration.connection.port,
      //   max: dbConfiguration.pool.max,
      //   min: dbConfiguration.pool.min,
      //   idleTimeoutMillis: dbConfiguration.acquireConnectionTimeout,
      connectionTimeoutMillis: 2000
    };
    corePool = new Pool(corePgConfig);
    // end of configuration for (core client) // will be remove in future

    knexObj = Knex(dbConfiguration);
    knexPool = knexObj.client.pool;
    Model.knex(knexObj);
    await models.init(knexObj);
    knexObj.on("query", function(queryData) {
      logger.info("<********** db query **********>");
      if (queryData.__knexQueryUid) {
        logger.info("query Uid: [%s]", queryData.__knexQueryUid);
      }
      logger.info("SQL: [%s]", queryData.sql);
      if (queryData.bindings) {
        logger.info("Bindings: [%s]", queryData.bindings);
      }
      logger.info("<********** /db query **********>");
    });
    if (knexPool) {
      logger.info("<=========== POOL INITIALIZED ============>");
    } else {
      throw new Error("<======== POOL INITILIZED ERROR =============>");
    }
  } catch (err) {
    throw err;
  }
}

async function getClient() {
  try {
    const client = await corePool.connect();
    await client.query("BEGIN");
    return client;
  } catch (err) {
    throw err;
  }
}

async function startTransaction() {
  try {
    const client = await corePool.connect();
    await client.query("BEGIN");
    return client;
  } catch (err) {
    throw err;
  }
}

async function beginTransaction() {
  try {
    console.log("asdasdasdasd", knexObj);
    const client = await transaction.start(knexObj);
    logger.info("<================ Transaction Started ================>");
    return client;
  } catch (err) {
    logger.info(
      "<================ Connection Transaction Establised Error================>",
      err
    );
    throw err;
  }
}

async function commitTrax(object) {
  try {
    await object.tranx.commit();
    logger.info("<================ Transaction Committed ================>");
    return true;
  } catch (err) {
    logger.info(
      "<================ Transaction Committed Error================>",
      err
    );
    throw err;
  }
}

async function rollBackTrax(object) {
  try {
    await object.tranx.rollback();
    logger.info("<================ Transaction RollBacked ================>");
    return true;
  } catch (err) {
    logger.info(
      "<================ Transaction RollBack Error================>",
      err
    );
    throw err;
  }
}

DBUtils.getClient = getClient;
DBUtils.startTransaction = startTransaction;
DBUtils.beginTransaction = beginTransaction;
DBUtils.initDB = initDB;
module.exports.DBUtils = DBUtils;
