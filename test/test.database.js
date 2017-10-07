"use strict";

const environments = require("../knexfile.js");

module.exports = require("knex")(environments.test);
