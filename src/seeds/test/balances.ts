import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("balances").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      token: "TOKEN_ADDRESS",
      owner: "FROM_ADDRESS",
      balance: 9001,
    }, {
      token: "0x0000000000000000001000000000000000000001",
      owner: "0x0000000000000000000000000000000000000021",
      balance: 17,
    }, {
      token: "0x0000000000000000001000000000000000000003",
      owner: "0x0000000000000000000000000000000000000021",
      balance: 229,
    }];
    return knex.batchInsert("balances", seedData, seedData.length);
  });
};
