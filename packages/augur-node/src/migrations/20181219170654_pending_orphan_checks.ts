import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("pending_orphan_checks").then((): PromiseLike<any> => {
    return knex.schema.createTable("pending_orphan_checks", (table: Knex.CreateTableBuilder): void => {
      table.string("marketId", 42).notNullable();
      table.specificType("orderType", "varchar(4) NOT NULL CONSTRAINT enumOrderTypes CHECK (\"orderType\" = 'buy' OR \"orderType\" = 'sell')");
      table.specificType("outcome", "integer NOT NULL CONSTRAINT nonnegativeOutcome CHECK (outcome >= 0)");
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("pending_orphan_checks");
};
