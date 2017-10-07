"use strict";

const unlink = require("fs").unlink;
const environments = require("../knexfile.js");
const db = require("knex")(environments.test);

module.exports = function(callback) {
  callback(null, db);
}
