import * as Knex from "knex";
import { DisputeWindowState } from "../../types";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("dispute_windows").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      disputeWindow: "0x1000000000000000000000000000000000000000",
      disputeWindowId: 456,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1506473473,
      endTime: 1506473515,
      state: DisputeWindowState.PAST,
      fees: 0,
    }, {
      disputeWindow: "0x3000000000000000000000000000000000000000",
      disputeWindowId: 457,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1506474500,
      endTime: 1506480000,
      state: DisputeWindowState.PAST,
      fees: 0,
    }, {
      disputeWindow: "0x2000000000000000000000000000000000000000",
      disputeWindowId: 457,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1509065473,
      endTime: 1509065473 + 604800,
      state: DisputeWindowState.CURRENT,
      fees: 0,
    }, {
      disputeWindow: "0x2100000000000000000000000000000000000000",
      disputeWindowId: 1,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1509670273,
      endTime: 1509670273 + 604800,
      state: DisputeWindowState.FUTURE,
      fees: 0,
    }, {
      disputeWindow: "0x5000000000000000000000000000000000000000",
      disputeWindowId: 458,
      universe: "CHILD_UNIVERSE",
      startTime: 1508065473,
      endTime: 1509065473,
      state: DisputeWindowState.CURRENT,
      fees: 0,
    }, {
      disputeWindow: "0x4000000000000000000000000000000000000000",
      disputeWindowId: 459,
      universe: "CHILD_UNIVERSE",
      startTime: 1509065473,
      endTime: 1511657473,
      state: DisputeWindowState.FUTURE,
      fees: 0,
    }];
    return knex.batchInsert("dispute_windows", seedData, seedData.length);
  });
};
