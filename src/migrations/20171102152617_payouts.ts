import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("payouts").then( (): PromiseLike<any> => {
    return knex.schema.createTable("payouts", (table: Knex.CreateTableBuilder): void => {
      table.increments("payoutID");
      table.string("marketID", 42).notNullable();

      const uniqueIndex = ["marketID", "isInvalid"];
      for (let i: number = 0; i <= 7; i++ ) {
        const column = `payout${i}`;
        table.specificType(column, "NUMERIC").nullable();
        uniqueIndex.push(column);
      }
      table.integer("isInvalid");
      table.integer("tentativeWinning").defaultTo(0);
      table.integer("winning").nullable();

      table.index(["marketID"]);
      table.unique(uniqueIndex);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("payouts");
};
