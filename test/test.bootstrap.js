"use strict";

var knex = require("knex");

knex.migrate.latest();
before(function() {
  knex.seed.run();
});

