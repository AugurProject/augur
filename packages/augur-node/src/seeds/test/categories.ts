import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("categories").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      category: "TEST CATEGORY",
      popularity: 0,
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "POLITICS",
      popularity: 5000,
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "ETHEREUM",
      popularity: 900,
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "ethereum",
      popularity: 100,
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "AUGUR",
      popularity: 500,
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "FINANCE",
      popularity: 12345,
      universe: "0x000000000000000000000000000000000000000b",
    }];
    return knex.batchInsert("categories", seedData, seedData.length);
  });
};
