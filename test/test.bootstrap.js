"use strict";
var knex = require("./test.database");

knex.migrate.latest()
