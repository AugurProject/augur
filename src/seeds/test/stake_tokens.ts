import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("stake_tokens").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      stakeToken: "0x0000000000000000001000000000000000000001",
      marketID: "0x0000000000000000000000000000000000000011",
      payout0: 0,
      payout1: 2,
      isInvalid: 0,
    }, {
      stakeToken: "0x0000000000000000001000000000000000000002",
      marketID: "0x0000000000000000000000000000000000000011",
      payout0: 1,
      payout1: 1,
      isInvalid: 1,
    }, {
      stakeToken: "0x0000000000000000001000000000000000000003",
      marketID: "0x0000000000000000000000000000000000000019",
      payout0: 1,
      payout1: 1,
      isInvalid: 0,
    }];
    return knex.batchInsert("stake_tokens", seedData, seedData.length);
  });
};
