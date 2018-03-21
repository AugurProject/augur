import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("balances").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      token: "TOKEN_ADDRESS",
      owner: "FROM_ADDRESS",
      balance: "9001",
    }, {
      token: "0x0000000000000000001000000000000000000001",
      owner: "0x0000000000000000000000000000000000000021",
      balance: "17",
    }, {
      token: "0x0000000000000000001000000000000000000002",
      owner: "0x0000000000000000000000000000000000000021",
      balance: "500",
    }, {
      token: "0x0000000000000000001000000000000000000003",
      owner: "0x0000000000000000000000000000000000000021",
      balance: "229",
    }, {
      token: "0x1000000000000000000000000000000000000000",
      owner: "0x0000000000000000000000000000000000000021",
      balance: "100",
    }, {
      token: "CASH",
      owner: "0x1000000000000000000000000000000000000000",
      balance: "1000",
    }, {
      token: "0x2000000000000000000000000000000000000000",
      owner: "0x0000000000000000000000000000000000000021",
      balance: "500",
    }, {
      token: "CASH",
      owner: "0x2000000000000000000000000000000000000000",
      balance: "2000",
    }, {
      token: "REP_TOKEN",
      owner: "0x0000000000000000000000000000000000abe123",
      balance: "2000",
    }, {
      token: "REP_TOKEN",
      owner: "0x0000000000000000000000000000000000abe321",
      balance: "2000",
    }];
    return knex.batchInsert("balances", seedData, seedData.length);
  });
};
