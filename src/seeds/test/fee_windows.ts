import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("fee_windows").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      feeWindow: "0x1000000000000000000000000000000000000000",
      feeWindowID: 456,
      startBlockNumber: 1400000,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1506473473,
      endBlockNumber: 1500001,
      endTime: 1509065473,
      fees: 0,
      feeToken: "FEE_TOKEN_1",
    }, {
      feeWindow: "0x2000000000000000000000000000000000000000",
      feeWindowID: 457,
      universe: "0x000000000000000000000000000000000000000b",
      startBlockNumber: 1500001,
      startTime: 1509065473,
      endBlockNumber: null,
      endTime: 1511657473,
      fees: 0,
      feeToken: "FEE_TOKEN_2",
    }];
    return knex.batchInsert("fee_windows", seedData, seedData.length);
  });
};
