import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reporting_windows").then( (): PromiseLike<any> => {
    return knex.schema.createTable("reporting_windows", (table: Knex.CreateTableBuilder): void => {
      table.string("reportingWindow", 42).primary().notNullable();
      table.integer("reportingwindowID").notNullable();
      table.string("universe", 42).notNullable();
      table.integer("startBlockNumber").notNullable();
      table.specificType("startTime", "integer NOT NULL CONSTRAINT nonnegativeStartTime CHECK (startTime >= 0)");
      table.integer("endBlockNumber").nullable();
      table.specificType("endTime", "integer NOT NULL CONSTRAINT nonnegativeEndTime CHECK (endTime >= 0)");
      table.integer("fees").defaultTo(0);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reporting_windows");
};
