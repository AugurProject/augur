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
    }];
    return knex.batchInsert("token_supply", seedData, seedData.length);
  });
};
