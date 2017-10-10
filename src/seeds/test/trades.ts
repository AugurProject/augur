import * as Knex from "knex";
import Promise = require("bluebird");

exports.seed = (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex("trades").del().then(() => {
    // Inserts seed entries
    return knex.raw(`INSERT INTO trades
      (order_id, market_id, outcome, share_token, order_type, creator, filler, trade_time, trade_block_number, num_creator_tokens, num_creator_shares, num_filler_tokens, num_filler_shares, price, shares, settlement_fees)
      VALUES (
        '0x1100000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000001',
        0,
        '0x1000000000000000000000000000000000000000',
        'sell',
        '0x0000000000000000000000000000000000000b0b',
        '0x000000000000000000000000000000000000d00d',
        1506474500,
        1400051,
        0,
        0.2,
        1.1,
        0,
        5.5,
        1.1,
        0
      )`);
  });
};
