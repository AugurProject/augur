import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("crowdsourcers").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      crowdsourcerId: "0x0000000000000000001000000000000000000001",
      marketId: "0x0000000000000000000000000000000000000011",
      feeWindow: "0x1000000000000000000000000000000000000000",
      payoutId: 1,
      size: "10000",
      amountStaked: "10000",
      blockNumber: 1400100,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
      logIndex: 0,
      completed: 1,
      disavowed: 0,
    }, {
      crowdsourcerId: "0x0000000000000000001000000000000000000002",
      marketId: "0x0000000000000000000000000000000000000011",
      feeWindow: "0x2000000000000000000000000000000000000000",
      payoutId: 2,
      size: "20000",
      amountStaked: "20000",
      blockNumber: 1400101,
      completed: 1,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E01",
      logIndex: 0,
      disavowed: 0,
    }, {
      crowdsourcerId: "0x0000000000000000001000000000000000000005",
      marketId: "0x0000000000000000000000000000000000000011",
      feeWindow: "0x3000000000000000000000000000000000000000",
      payoutId: 1,
      size: "30000",
      amountStaked: "30000",
      blockNumber: 1400102,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E01",
      logIndex: 0,
      disavowed: 0,
    }, {
      crowdsourcerId: "0x0000000000000000001000000000000000000003",
      marketId: "0x0000000000000000000000000000000000000019",
      feeWindow: "0x1000000000000000000000000000000000000000",
      payoutId: 3,
      amountStaked: "9000",
      size: "20000",
      blockNumber: 1400102,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E01",
      logIndex: 1,
      disavowed: 0,
    },  {
      crowdsourcerId: "0x0000000000000000001000000000000000000004",
      marketId: "0x0000000000000000000000000000000000000211",
      feeWindow: "0x1000000000000000000000000000000000000000",
      payoutId: 6,
      amountStaked: "20",
      size: "204",
      blockNumber: 1500002,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F01",
      logIndex: 1,
      disavowed: 0,
    },  {
      crowdsourcerId: "0x0000000000000000001000000000000000000006",
      marketId: "0x00000000000000000000000000000000000000f1",
      feeWindow: "0x2000000000000000000000000000000000000000",
      payoutId: 6,
      amountStaked: "20",
      size: "204",
      blockNumber: 1500002,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F01",
      logIndex: 1,
      disavowed: 0,
    },  {
      crowdsourcerId: "0x0000000000000000001000000000000000000007",
      marketId: "0x00000000000000000000000000000000000000f1",
      feeWindow: "0x3000000000000000000000000000000000000000",
      payoutId: 6,
      amountStaked: "20",
      disavowed: 1,
      size: "204",
      blockNumber: 1500002,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F01",
      logIndex: 1,
    }];
    return knex.batchInsert("crowdsourcers", seedData, seedData.length);
  });
};
