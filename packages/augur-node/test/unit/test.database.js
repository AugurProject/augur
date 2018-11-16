"use strict";

const environments = require("../../knexfile.js");
const Knex = require("knex");
const { postProcessDatabaseResults } = require("src/server/post-process-database-results");

module.exports = () => {
  const env = Object.assign({}, environments.test, {
    postProcessResponse: postProcessDatabaseResults,
  });
  const db = Knex(env);
  return db.migrate.latest(env.migrations)
    .then(() => db.seed.run(env.seeds))
    .then(() => db);
};
