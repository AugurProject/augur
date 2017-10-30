import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("network_id").del().then((): void => {
    // Inserts seed entries
    const seedData = [{
      networkID: 3,
      firstLaunched: '2017-10-30 23:16:03',
      lastLaunched: '2017-10-30 23:20:53',
    }];
    knex.batchInsert("network_id", seedData, seedData.length);
  });
};
