import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("reporting_windows").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      reportingWindow: "0x1000000000000000000000000000000000000000",
      reportingWindowID: 456,
      startBlockNumber: 1400000,
      universe: "0x000000000000000000000000000000000000000b",
      startTime: 1506473473,
      endBlockNumber: null,
      endTime: 1509065473,
      fees: 0,
    }, {
      reportingWindow: "0x2000000000000000000000000000000000000000",
      reportingWindowID: 457,
      universe: "0x000000000000000000000000000000000000000b",
      startBlockNumber: 1500001,
      startTime: 1509065473,
      endBlockNumber: null,
      endTime: 1511657473,
      fees: 0,
    }];
    return knex.batchInsert("reporting_windows", seedData, seedData.length);
  });
};
