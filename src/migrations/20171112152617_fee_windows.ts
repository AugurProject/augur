import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("fee_windows").then( (): PromiseLike<any> => {
    return knex.schema.createTable("fee_windows", (table: Knex.CreateTableBuilder): void => {
      table.string("feeWindow", 42).primary().notNullable();
      table.integer("feeWindowId").notNullable();
      table.string("universe", 42).notNullable();
      table.integer("startBlockNumber").notNullable();
      table.specificType("startTime", "integer NOT NULL CONSTRAINT nonnegativeStartTime CHECK (startTime >= 0)");
      table.integer("endBlockNumber").nullable();
      table.specificType("endTime", "integer NOT NULL CONSTRAINT nonnegativeEndTime CHECK (endTime >= 0)");
      table.string("fees", 255).defaultTo("0");
      table.string("feeToken").notNullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("fee_windows");
};
