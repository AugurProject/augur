import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("orders_canceled").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      orderId: "0x4200000000000000000000000000000000000000000000000000000000000000",
      blockNumber: 1500001,
      transactionHash: "0x000000000000000000000000000000000000000000000000000000000000AA05",
      logIndex: 0,
    }];
    return knex.batchInsert("orders_canceled", seedData, seedData.length);
  });
};
