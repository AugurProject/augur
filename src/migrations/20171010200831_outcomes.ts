import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes").then((): PromiseLike<any> => {
    return knex.schema.createTable("outcomes", (table: Knex.CreateTableBuilder): void => {
      table.string("marketId", 42).notNullable();
      table.specificType("outcome", "integer NOT NULL CONSTRAINT nonnegativeOutcome CHECK (outcome >= 0)");
      table.specificType("price", "VARCHAR(255) NOT NULL");
      table.specificType("volume", "VARCHAR(255) NOT NULL CONSTRAINT nonnegativeVolume CHECK (ltrim(volume, '-') = volume)");
      table.text("description").nullable();

      table.unique(["marketId", "outcome"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes");
};
