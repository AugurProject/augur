import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("payouts").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      payoutId: 1,
      marketId: "0x0000000000000000000000000000000000000011",
      payout0: "0",
      payout1: "2",
      tentativeWinning: 0,
      isInvalid: 0,
    }, {
      payoutId: 2,
      marketId: "0x0000000000000000000000000000000000000011",
      payout0: "1",
      payout1: "1",
      isInvalid: 1,
      tentativeWinning: 1,
    }, {
      payoutId: 3,
      marketId: "0x0000000000000000000000000000000000000019",
      payout0: "10000",
      payout1: "0",
      payout2: "0",
      payout3: "0",
      payout4: "0",
      isInvalid: 0,
      tentativeWinning: 0,
      winning: 1,
    }, {
      payoutId: 4,
      marketId: "0x0000000000000000000000000000000000000211",
      payout0: "10000",
      payout1: "0",
      isInvalid: 0,
      tentativeWinning: 0,
      winning: null,
    }, {
      payoutId: 5,
      marketId: "0x0000000000000000000000000000000000000211",
      payout0: "0",
      payout1: "10000",
      isInvalid: 0,
      tentativeWinning: 1,
      winning: null,
    }, {
      payoutId: 6,
      marketId: "0x0000000000000000000000000000000000000211",
      payout0: "5000",
      payout1: "5000",
      isInvalid: 1,
      tentativeWinning: 0,
      winning: null,
    }, {
      payoutId: 7,
      marketId: "CHILD_UNIVERSE",
      payout0: "0",
      payout1: "10000",
      isInvalid: 0,
      tentativeWinning: 0,
      winning: null,
    }, {
      payoutId: 8,
      marketId: "0x0000000000000000000000000000000000000013",
      payout0: "0",
      payout1: "10000",
      isInvalid: 0,
      tentativeWinning: 1,
      winning: 1,
    }];
    return knex.batchInsert("payouts", seedData, seedData.length);
  });
};
