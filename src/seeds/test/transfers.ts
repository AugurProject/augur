import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
    return knex("transfers").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
      logIndex: 0,
      sender: "0x0000000000000000000000000000000000000b0b",
      recipient: "0x000000000000000000000000000000000000d00d",
      token: "0x0100000000000000000000000000000000000000",
      value: 10,
      blockNumber: 1400000,
    }, {
      transactionHash: "0x00000000000000000000000000000000000000000000000000000000d3adb33f",
      logIndex: 0,
      sender: "0x000000000000000000000000000000000000d00d",
      recipient: "0x0000000000000000000000000000000000000b0b",
      token: "0x0100000000000000000000000000000000000000",
      value: 2,
      blockNumber: 1400001,
    }, {
      transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadb33f",
      logIndex: 1,
      sender: "0x0000000000000000000000000000000000000b0b",
      recipient: "0x000000000000000000000000000000000000d00d",
      token: "0x7a305d9b681fb164dc5ad628b5992177dc66aec8",
      value: 47,
      blockNumber: 1400001,
    }];
    return knex.batchInsert("transfers", seedData, seedData.length);
  });
};
