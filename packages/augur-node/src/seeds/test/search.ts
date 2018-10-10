import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("search_en").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      marketId: "0x0000000000000000000000000000000000000015",
      shortDescription: "bob and sue are hanging out",
    }, {
      marketId: "0x0000000000000000000000000000000000000012",
      shortDescription: "bob and jimmy are going to the movies",
    }, {
      marketId: "0x0000000000000000000000000000000000000013",
      shortDescription: "little jonny is going to school",
    }, {
      marketId: "0x0000000000000000000000000000000000000014",
      shortDescription: "sue and betty are hanging out",
    }, {
      marketId: "0x0000000000000000000000000000000000000016",
      shortDescription: "sue and tina are hanging out",
    }, {
      marketId: "0x0000000000000000000000000000000000000017",
      shortDescription: "sue and debbie went to dinner",
    }, {
      marketId: "0x0000000000000000000000000000000000000018",
      shortDescription: "sue and jonny went to the store",
    }, {
      marketId: "0x0000000000000000000000000000000000000019",
      shortDescription: "sue went to the store",
    }];
    return knex.batchInsert("search_en", seedData, seedData.length);
  });
};
