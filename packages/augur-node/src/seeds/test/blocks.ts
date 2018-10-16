import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("blocks").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      blockNumber: 7,
      blockHash: "0x7",
      timestamp: 10000000,
    }, {
      blockNumber: 8,
      blockHash: "0x8",
      timestamp: 10000015,
    }, {
      blockNumber: 1400000,
      blockHash: "0x1400000",
      timestamp: 1506473474,
    }, {
      blockNumber: 1400001,
      blockHash: "0x1400001",
      timestamp: 1506473500,
    }, {
      blockNumber: 1400002,
      blockHash: "0x1400002",
      timestamp: 1506473515,
    }, {
      blockNumber: 1400051,
      blockHash: "0x1400051",
      timestamp: 1506474500,
    }, {
      blockNumber: 1400052,
      blockHash: "0x1400052",
      timestamp: 1506474515,
    }, {
      blockNumber: 1400100,
      blockHash: "0x1400100",
      timestamp: 1506480000,
    }, {
      blockNumber: 1400101,
      blockHash: "0x1400101",
      timestamp: 1506480015,
    }, {
      blockNumber: 1500001,
      blockHash: "0x1500001",
      timestamp: 1509065474,
    }];
    return knex.batchInsert("blocks", seedData, seedData.length);
  });
};
