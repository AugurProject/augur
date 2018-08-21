"use strict";

const environments = require("../../knexfile.js");
const Knex = require("knex");
const { postProcessDatabaseResults } = require("../../src/server/post-process-database-results");

module.exports = (callback) => {
  const env = Object.assign({}, environments.test, {
    postProcessResponse: postProcessDatabaseResults,
  });
  const db = Knex(env);
  db.migrate.latest().then(() => {
    db.seed.run().then(() => {
      callback(null, db);
    });
  }).catch(callback);
};
