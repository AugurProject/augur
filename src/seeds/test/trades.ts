import * as Knex from "knex";
import Promise = require("bluebird");

exports.seed = (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("trades").del().then((): void => {
    // Inserts seed entries
    knex.batchInsert("trades", [{
      order_id: "0x1100000000000000000000000000000000000000000000000000000000000000",
      market_id: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      share_token: "0x1000000000000000000000000000000000000000",
      order_type: "sell",
      creator: "0x0000000000000000000000000000000000000b0b",
      filler: "0x000000000000000000000000000000000000d00d",
      trade_time: 1506474500,
      trade_block_number: 1400051,
      num_creator_tokens: "0",
      num_creator_shares: "0.2",
      num_filler_tokens: "1.1",
      num_filler_shares: "0",
      price: "5.5",
      shares: "1.1",
      settlement_fees: "0"
    }], 1000);
  });
};
