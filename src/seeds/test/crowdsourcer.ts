import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("crowdsourcers").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      crowdsourcerID: "0x0000000000000000001000000000000000000001",
      marketID: "0x0000000000000000000000000000000000000011",
      payoutID: 1,
      blockNumber: 1400100,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
      logIndex: 0,
    }, {
      crowdsourcerID: "0x0000000000000000001000000000000000000002",
      marketID: "0x0000000000000000000000000000000000000011",
      payoutID: 2,
      blockNumber: 1400101,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E01",
      logIndex: 0,
    }, {
      crowdsourcerID: "0x0000000000000000001000000000000000000003",
      marketID: "0x0000000000000000000000000000000000000019",
      payoutID: 3,
      blockNumber: 1400102,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E01",
      logIndex: 1,
    }];
    return knex.batchInsert("crowdsourcers", seedData, seedData.length);
  });
};
