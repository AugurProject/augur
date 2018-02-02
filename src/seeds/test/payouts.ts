import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("payouts").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      payoutID: 1,
      marketID: "0x0000000000000000000000000000000000000011",
      payout0: 0,
      payout1: 2,
      isInvalid: 0,
    }, {
      payoutID: 2,
      marketID: "0x0000000000000000000000000000000000000011",
      payout0: 1,
      payout1: 1,
      isInvalid: 1,
    }, {
      payoutID: 3,
      marketID: "0x0000000000000000000000000000000000000019",
      payout0: 1,
      payout1: 1,
      isInvalid: 0,
      winning: 1,
    }, {
      payoutID: 4,
      marketID: "0x0000000000000000000000000000000000000211",
      payout0: 10000,
      payout1: 0,
      isInvalid: 0,
      winning: null,
    }, {
      payoutID: 5,
      marketID: "0x0000000000000000000000000000000000000211",
      payout0: 0,
      payout1: 10000,
      isInvalid: 0,
      winning: null,
    }];
    return knex.batchInsert("payouts", seedData, seedData.length);
  });
};
