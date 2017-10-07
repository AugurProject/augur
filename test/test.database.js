"use strict";

const unlink = require("fs").unlink;
const environments = require("../knexfile.js");
const db = require("knex")(environments.test);
const { checkAugurDbSetup } = require("../build/setup/check-augur-db-setup");

module.exports = function(callback) {
  checkAugurDbSetup(db, function(err) {
    callback(err, db);
  });
}
