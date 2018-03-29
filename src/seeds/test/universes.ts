import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("universes").del().then(async (): Promise<any> => {
    // Inserts seed entries
    return knex.batchInsert("universes", [{
      universe: "0x000000000000000000000000000000000000000b",
      parentUniverse: null,
      reputationToken: "REP_TOKEN",
    }, {
      universe: "CHILD_UNIVERSE",
      parentUniverse: "0x000000000000000000000000000000000000000b",
      reputationToken: "REP_TOKEN_CHILD",
      payoutId: 7,
    }, {
      universe: "FIRST_GRAND_CHILD_UNIVERSE",
      parentUniverse: "CHILD_UNIVERSE",
      reputationToken: "REP_TOKEN_FIRST_GRAND_CHILD",
    }, {
      universe: "SECOND_GRAND_CHILD_UNIVERSE",
      parentUniverse: "CHILD_UNIVERSE",
      reputationToken: "REP_TOKEN_SECOND_GRAND_CHILD",
    }], 1000);
  });
};
