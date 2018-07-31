import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("categories").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      category: "test category",
      popularity: 0,
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "politics",
      popularity: 5000,
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "ethereum",
      popularity: 1000,
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "augur",
      popularity: 500,
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "finance",
      popularity: 12345,
      universe: "0x000000000000000000000000000000000000000b",
    }];
    return knex.batchInsert("categories", seedData, seedData.length);
  });
};
