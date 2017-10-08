"use strict";

const unlink = require("fs").unlink;
const environments = require("../knexfile.js");
const Knex  = require("knex")
const { checkAugurDbSetup } = require("../build/setup/check-augur-db-setup");

module.exports = function(callback) {
  const db = Knex(environments.test);
  db.migrate.latest().then(() => {
    db.seed.run().then(() => {
      checkAugurDbSetup(db, function(err) {
        callback(err, db);
      });
    });
  });
}
