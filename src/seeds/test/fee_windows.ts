import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("fee_windows").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      feeWindow: "0x1000000000000000000000000000000000000000",
      feeWindowId: 456,
      startBlockNumber: 1400000,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1506473473,
      endBlockNumber: 1400002,
      endTime: 1506473515,
      fees: 0,
      feeToken: "FEE_TOKEN_1",
    }, {
      feeWindow: "0x3000000000000000000000000000000000000000",
      feeWindowId: 457,
      universe: "0x000000000000000000000000000000000000000b",
      startBlockNumber: 1400051,
      startTime: 1506474500,
      endBlockNumber: 1400100,
      endTime: 1506480000,
      fees: 0,
      feeToken: "FEE_TOKEN_3",
    }, {
      feeWindow: "0x2000000000000000000000000000000000000000",
      feeWindowId: 457,
      universe: "0x000000000000000000000000000000000000000b",
      startBlockNumber: 1500001,
      startTime: 1509065473,
      endBlockNumber: null,
      endTime: 1511657473,
      fees: 0,
      feeToken: "FEE_TOKEN_2",
    }, {
      feeWindow: "0x4000000000000000000000000000000000000000",
      feeWindowId: 458,
      universe: "CHILD_UNIVERSE",
      startBlockNumber: 1500001,
      startTime: 1509065473,
      endBlockNumber: null,
      endTime: 1511657473,
      fees: 0,
      feeToken: "FEE_TOKEN_CHILD_UNIVERSE",
    }];
    return knex.batchInsert("fee_windows", seedData, seedData.length);
  });
};
