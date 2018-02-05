import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("crowdsourcers").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      crowdsourcerID: "0x0000000000000000001000000000000000000001",
      marketID: "0x0000000000000000000000000000000000000011",
      feeWindow: "0x1000000000000000000000000000000000000000",
      payoutID: 1,
      size: 20000,
      amountStaked: 20000,
      blockNumber: 1400100,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
      logIndex: 0,
    }, {
      crowdsourcerID: "0x0000000000000000001000000000000000000002",
      marketID: "0x0000000000000000000000000000000000000011",
      feeWindow: "0x1000000000000000000000000000000000000000",
      payoutID: 2,
      size: 40000,
      amountStaked: 20000,
      blockNumber: 1400101,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E01",
      logIndex: 0,
    }, {
      crowdsourcerID: "0x0000000000000000001000000000000000000003",
      marketID: "0x0000000000000000000000000000000000000019",
      feeWindow: "0x1000000000000000000000000000000000000000",
      payoutID: 3,
      size: 20000,
      blockNumber: 1400102,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E01",
      logIndex: 1,
    },  {
      crowdsourcerID: "0x0000000000000000001000000000000000000004",
      marketID: "0x0000000000000000000000000000000000000211",
      feeWindow: "0x1000000000000000000000000000000000000000",
      payoutID: 5,
      size: 16,
      blockNumber: 1500002,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F01",
      logIndex: 1,
    }];
    return knex.batchInsert("crowdsourcers", seedData, seedData.length);
  });
};
