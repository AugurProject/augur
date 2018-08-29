import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("disputes").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D00",
      logIndex: 0,
      blockNumber: 1400051,
      reporter: "0x0000000000000000000000000000000000000021",
      crowdsourcerId: "0x0000000000000000001000000000000000000001",
      amountStaked: "17",
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D01",
      logIndex: 0,
      blockNumber: 1400051,
      reporter: "0x0000000000000000000000000000000000000022",
      crowdsourcerId: "0x0000000000000000001000000000000000000002",
      amountStaked: "41",
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D02",
      logIndex: 0,
      blockNumber: 1400051,
      reporter: "0x0000000000000000000000000000000000000023",
      crowdsourcerId: "0x0000000000000000001000000000000000000002",
      amountStaked: "222",
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D03",
      logIndex: 0,
      blockNumber: 1400052,
      reporter: "0x0000000000000000000000000000000000000021",
      crowdsourcerId: "0x0000000000000000001000000000000000000003",
      amountStaked: "229",
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D04",
      logIndex: 0,
      blockNumber: 1400051,
      reporter: "0x0000000000000000000000000000000000000024",
      crowdsourcerId: "0x0000000000000000001000000000000000000003",
      amountStaked: "300",
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D05",
      logIndex: 0,
      blockNumber: 1400052,
      reporter: "0x0000000000000000000000000000000000000024",
      crowdsourcerId: "0x0000000000000000001000000000000000000003",
      amountStaked: "450",
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D06",
      logIndex: 0,
      blockNumber: 1500002,
      reporter: "0x0000000000000000000000000000000000000b0b",
      crowdsourcerId: "0x0000000000000000001000000000000000000004",
      amountStaked: "16",
    }];
    return knex.batchInsert("disputes", seedData, seedData.length);
  });
};
