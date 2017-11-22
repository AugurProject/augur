import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("reports").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D00",
      logIndex: 0,
      blockNumber: 1400051,
      reporter: "0x0000000000000000000000000000000000000021",
      marketID: "0x0000000000000000000000000000000000000011",
      marketReportingState: "DESIGNATED_REPORTING",
      stakeToken: "0x0000000000000000001000000000000000000001",
      amountStaked: 17,
      winningToken: null,
      claimed: 0,
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D01",
      logIndex: 0,
      blockNumber: 1400051,
      reporter: "0x0000000000000000000000000000000000000022",
      marketID: "0x0000000000000000000000000000000000000011",
      marketReportingState: "FIRST_REPORTING",
      stakeToken: "0x0000000000000000001000000000000000000002",
      amountStaked: 41,
      winningToken: null,
      claimed: 0,
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D02",
      logIndex: 0,
      blockNumber: 1400051,
      reporter: "0x0000000000000000000000000000000000000023",
      marketID: "0x0000000000000000000000000000000000000011",
      marketReportingState: "LAST_REPORTING",
      stakeToken: "0x0000000000000000001000000000000000000002",
      amountStaked: 222,
      winningToken: null,
      claimed: 0,
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D03",
      logIndex: 0,
      blockNumber: 1400052,
      reporter: "0x0000000000000000000000000000000000000021",
      marketID: "0x0000000000000000000000000000000000000019",
      marketReportingState: "FIRST_REPORTING",
      stakeToken: "0x0000000000000000001000000000000000000003",
      amountStaked: 229,
      winningToken: 1,
      claimed: 0,
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D04",
      logIndex: 0,
      blockNumber: 1400051,
      reporter: "0x0000000000000000000000000000000000000024",
      marketID: "0x0000000000000000000000000000000000000019",
      marketReportingState: "DESIGNATED_REPORTING",
      stakeToken: "0x0000000000000000001000000000000000000003",
      amountStaked: 300,
      winningToken: 1,
      claimed: 0,
    }, {
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D05",
      logIndex: 0,
      blockNumber: 1400052,
      reporter: "0x0000000000000000000000000000000000000024",
      marketID: "0x0000000000000000000000000000000000000019",
      marketReportingState: "FIRST_REPORTING",
      stakeToken: "0x0000000000000000001000000000000000000003",
      amountStaked: 450,
      winningToken: 1,
      claimed: 0,
    }];
    return knex.batchInsert("reports", seedData, seedData.length);
  });
};
