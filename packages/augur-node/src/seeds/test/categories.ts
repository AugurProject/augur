import Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("categories").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      category: "TEST CATEGORY",
      nonFinalizedOpenInterest: "0",
      openInterest: "0",
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "POLITICS",
      nonFinalizedOpenInterest: "3",
      openInterest: "12",
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "ETHEREUM",
      nonFinalizedOpenInterest: "4.5",
      openInterest: "4.5",
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "ethereum",
      nonFinalizedOpenInterest: "0",
      openInterest: "0",
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "AUGUR",
      nonFinalizedOpenInterest: "0",
      openInterest: "3",
      universe: "0x000000000000000000000000000000000000000b",
    }, {
      category: "FINANCE",
      nonFinalizedOpenInterest: "2.5",
      openInterest: "2.6",
      universe: "0x000000000000000000000000000000000000000b",
    }];
    return knex.batchInsert("categories", seedData, seedData.length);
  });
};
