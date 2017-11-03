import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("stake_tokens").del().then((): void => {
    // Inserts seed entries
    const seedData = [{
      stakeToken: "0x0000000000000000001000000000000000000001",
      marketID: "0x0000000000000000000000000000000000000002",
      payout1: 0,
      payout2: 2,
      isInvalid: 0,
    }, {
      stakeToken: "0x0000000000000000001000000000000000000002",
      marketID: "0x0000000000000000000000000000000000000002",
      payout1: 1,
      payout2: 1,
      isInvalid: 1,
    }];
    knex.batchInsert("stake_tokens", seedData, seedData.length);
  });
};
