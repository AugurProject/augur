import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("reports").del().then((): void => {
    // Inserts seed entries
    const seedData = [{
      reporter: "0x0000000000000000000000000000000000000021",
      marketID: "0x0000000000000000000000000000000000000002",
      stakedToken: "0x0000000000000000001000000000000000000001",
      amountStaked: 17,
    }, {
      reporter: "0x0000000000000000000000000000000000000022",
      marketID: "0x0000000000000000000000000000000000000002",
      stakedToken: "0x0000000000000000001000000000000000000002",
      amountStaked: 41,
    }, {
      reporter: "0x0000000000000000000000000000000000000023",
      marketID: "0x0000000000000000000000000000000000000002",
      stakedToken: "0x0000000000000000001000000000000000000002",
      amountStaked: 222,
    }];
    knex.batchInsert("reports", seedData, seedData.length);
  });
};
