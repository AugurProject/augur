import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("token_supply").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      token: "TOKEN_ADDRESS",
      supply: 9001,
    }, {
      token: "0x0000000000000000001000000000000000000001",
      supply: 17,
    }, {
      token: "0x0000000000000000001000000000000000000003",
      supply: 229,
    }, {
      token: "FEE_TOKEN_1",
      supply: 100,
    }, {
      token: "0x1000000000000000000000000000000000000000",
      supply: 200,
    }, {
      token: "0x0100000000000000000000000000000000000000",
      supply: 200000000000000,
    }, {
      token: "FEE_TOKEN_2",
      supply: 100,
    }, {
      token: "0x2000000000000000000000000000000000000000",
      supply: 1000,
    }, {
      token: "0x2100000000000000000000000000000000000000",
      supply: 1000,
    }, {
      token: "FEE_TOKEN_3",
      supply: 100,
    }, {
      token: "REP_TOKEN",
      supply: 10000,
    }, {
      token: "REP_TOKEN_CHILD",
      supply: 2000,
    }, {
      token: "REP_TOKEN_FIRST_GRAND_CHILD",
      supply: 200,
    }, {
      token: "REP_TOKEN_SECOND_GRAND_CHILD",
      supply: 0,
    }];
    return knex.batchInsert("token_supply", seedData, seedData.length);
  });
};
