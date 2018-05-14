import * as Knex from "knex";
import { FeeWindowState } from "../../types";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("fee_windows").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      feeWindow: "0x1000000000000000000000000000000000000000",
      feeWindowId: 456,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1506473473,
      endTime: 1506473515,
      state: FeeWindowState.PAST,
      fees: 0,
      feeToken: "FEE_TOKEN_1",
    }, {
      feeWindow: "0x3000000000000000000000000000000000000000",
      feeWindowId: 457,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1506474500,
      endTime: 1506480000,
      state: FeeWindowState.PAST,
      fees: 0,
      feeToken: "FEE_TOKEN_3",
    }, {
      feeWindow: "0x2000000000000000000000000000000000000000",
      feeWindowId: 457,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1509065473,
      endTime: 1509065473 + 604800,
      state: FeeWindowState.CURRENT,
      fees: 0,
      feeToken: "FEE_TOKEN_2",
    }, {
      feeWindow: "0x2100000000000000000000000000000000000000",
      feeWindowId: 1,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1509670273,
      endTime: 1509670273 + 604800,
      state: FeeWindowState.FUTURE,
      fees: 0,
      feeToken: "NEXT_FEE_TOKEN",
    }, {
      feeWindow: "0x4000000000000000000000000000000000000000",
      feeWindowId: 458,
      universe: "CHILD_UNIVERSE",
      startTime: 1509065473,
      endTime: 1511657473,
      state: FeeWindowState.FUTURE,
      fees: 0,
      feeToken: "FEE_TOKEN_CHILD_UNIVERSE",
    }];
    return knex.batchInsert("fee_windows", seedData, seedData.length);
  });
};
