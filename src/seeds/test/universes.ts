import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("universes").del().then(async (): Promise<any> => {
    // Inserts seed entries
    return knex.batchInsert("universes", [{
      universe: "0x000000000000000000000000000000000000000b",
      parentUniverse: null,
    }], 1000);
  });
};
