import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("blocks").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      blockNumber: 7,
      timestamp: 10000000,
    }, {
      blockNumber: 8,
      timestamp: 10000015,
    }, {
      blockNumber: 1400000,
      timestamp: 1506473474,
    }, {
      blockNumber: 1400001,
      timestamp: 1506473500,
    }, {
      blockNumber: 1400002,
      timestamp: 1506473515,
    }, {
      blockNumber: 1400051,
      timestamp: 1506474500,
    }, {
      blockNumber: 1400100,
      timestamp: 1506480000,
    }, {
      blockNumber: 1400101,
      timestamp: 1506480015,
    }];
    return knex.batchInsert("blocks", seedData, seedData.length);
  });
};
