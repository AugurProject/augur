"use strict";

const environments = require("../knexfile.js");
const Knex  = require("knex");
const { checkAugurDbSetup } = require("../build/setup/check-augur-db-setup");

module.exports = (callback) => {
  const db = Knex(environments.test);
  db.migrate.latest().then(() => {
    db.seed.run().then(() => {
      checkAugurDbSetup(db, (err) => {
        callback(err, db);
      });
    });
  });
};
