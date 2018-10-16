import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("positions").del().then(async (): Promise<any> => {
    // Inserts seed entries
    const seedData = [{
      account: "0x0000000000000000000000000000000000000b0b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      numShares: "0.1",
      numSharesAdjustedForUserIntention: "-0.2",
      realizedProfitLoss: "1.2",
      unrealizedProfitLoss: "0.55",
    }, {
      account: "0x0000000000000000000000000000000000000b0b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 1,
      numShares: "0.3",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0.03",
    }, {
      account: "0x0000000000000000000000000000000000000b0b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 2,
      numShares: "0.3",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0.03",
    }, {
      account: "0x0000000000000000000000000000000000000b0b",
      marketId: "0x0000000000000000000000000000000000000019",
      outcome: 3,
      numShares: "0",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0.1",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x0000000000000000000000000000000000000b0b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 4,
      numShares: "0.3",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0.10",
      unrealizedProfitLoss: "0.03",
    }, {
      account: "0x0000000000000000000000000000000000000b0b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 5,
      numShares: "0.3",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0.03",
    }, {
      account: "0x0000000000000000000000000000000000000b0b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 6,
      numShares: "0.3",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0.03",
    }, {
      account: "0x0000000000000000000000000000000000000b0b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 7,
      numShares: "0.3",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0.03",
    }, {
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      numShares: "0.2",
      numSharesAdjustedForUserIntention: "0.2",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "11",
    }, {
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 1,
      numShares: "0",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 2,
      numShares: "0",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 3,
      numShares: "0",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 4,
      numShares: "0",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 5,
      numShares: "0",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 6,
      numShares: "0",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 7,
      numShares: "0",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x000000000000000000000000000000000000deed",
      marketId: "0x0000000000000000000000000000000000000002",
      outcome: 0,
      numShares: "7",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x000000000000000000000000000000000000deed",
      marketId: "0x0000000000000000000000000000000000000002",
      outcome: 1,
      numShares: "0",
      numSharesAdjustedForUserIntention: "-7",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x0000000000000000000000000000000000000b1b",
      marketId: "0x0000000000000000000000000000000000000002",
      outcome: 0,
      numShares: "0",
      numSharesAdjustedForUserIntention: "0",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }, {
      account: "0x0000000000000000000000000000000000000b1b",
      marketId: "0x0000000000000000000000000000000000000002",
      outcome: 1,
      numShares: "42",
      numSharesAdjustedForUserIntention: "42",
      realizedProfitLoss: "0",
      unrealizedProfitLoss: "0",
    }];
    return knex.batchInsert("positions", seedData, seedData.length);
  });
};
