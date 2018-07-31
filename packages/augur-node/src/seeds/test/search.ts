import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("search_en").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      marketId: "0x0000000000000000000000000000000000000015",
      content: "bob and sue are hanging out",
    }, {
      marketId: "0x0000000000000000000000000000000000000012",
      content: "bob and jimmy are going to the movies",
    }, {
      marketId: "0x0000000000000000000000000000000000000013",
      content: "little jonny is going to school",
    }, {
      marketId: "0x0000000000000000000000000000000000000014",
      content: "sue and betty are hanging out",
    }, {
      marketId: "0x0000000000000000000000000000000000000016",
      content: "sue and tina are hanging out",
    }, {
      marketId: "0x0000000000000000000000000000000000000017",
      content: "sue and debbie went to dinner",
    }, {
      marketId: "0x0000000000000000000000000000000000000018",
      content: "sue and jonny went to the store",
    }, {
      marketId: "0x0000000000000000000000000000000000000019",
      content: "sue went to the store",
    }];
    return knex.batchInsert("search_en", seedData, seedData.length);
  });
};
