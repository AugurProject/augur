import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("market_state").del().then((): void => {
    // Inserts seed entries
    knex.batchInsert("market_state", [{
      marketID: "0x0000000000000000000000000000000000000001",
      marketStateID: 1,
      phase: 1,
      isDisputed: false,
      blockNumber: 50,
    }], 1000);
  });
};
