"use strict";
const unlink = require("fs").unlink;
const environments = require("../knexfile");

unlink(environments.test.connection.filename, function() {
  var knex = require("./test.database");
  knex.migrate.latest();
});
