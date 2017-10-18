import * as Knex from "knex";

// PRIMARY KEY AUTOINCREMENT pgsql compat issue? TODO: use .primary()
exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("market_state").then( (): PromiseLike<any> => {
    return  knex.schema.createTable('market_state', function(table) {
      table.increments("marketStateID");
      table.string("marketID", 66).notNullable();
      table.integer("phase").nullable();
      table.boolean("isDisputed");
      table.integer("blockNumber").notNullable();
    })
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("market_state");
};
