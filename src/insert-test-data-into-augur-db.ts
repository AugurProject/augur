import { SqlLiteDb, ErrorCallback } from "./types";

export function insertTestDataIntoAugurDb(db: SqlLiteDb, callback: ErrorCallback): void {
  db.parallelize(() => {
    db.run(`INSERT INTO markets
            (contract_address, universe, market_type, num_outcomes, min_price, max_price, market_creator, creation_time, creation_block_number, creation_fee, market_creator_fee_rate, topic, tag1, tag2, reporting_window, end_time, short_description, designated_reporter, resolution_source)
            VALUES (
              '0x0000000000000000000000000000000000000001',
              '0x000000000000000000000000000000000000000b',
              'categorical',
              8,
              0,
              1000000000000000000,
              '0x0000000000000000000000000000000000000b0b',
              1506473474,
              1400000,
              1000000000000000000,
              1,
              'test topic',
              'test tag 1',
              'test tag 2',
              '0x1000000000000000000000000000000000000000',
              1506573474,
              'This is a test market created by the augur-node.',
              '0x0000000000000000000000000000000000000b0b',
              'http://www.trusted-third-party.com'
            )`)
      .run(`INSERT INTO orders
            (order_id, market, outcome, order_type, order_creator, creation_time, creation_block_number, price, amount, money_escrowed, shares_escrowed, better_order_id, worse_order_id)
            VALUES (
              '0x1000000000000000000000000000000000000000000000000000000000000000',
              '0x0000000000000000000000000000000000000001',
              0,
              0,
              '0x0000000000000000000000000000000000000b0b',
              1506473500,
              1400001,
              700000000000000000,
              1000000000000000000,
              700000000000000000,
              0,
              '0x2000000000000000000000000000000000000000000000000000000000000000',
              NULL
            ), (
              '0x2000000000000000000000000000000000000000000000000000000000000000',
              '0x0000000000000000000000000000000000000001',
              0,
              0,
              '0x000000000000000000000000000000000000d00d',
              1506473515,
              1400002,
              600000000000000000,
              2000000000000000000,
              1200000000000000000,
              0,
              NULL,
              '0x1000000000000000000000000000000000000000000000000000000000000000'
            )`)
      .run(`INSERT INTO balances
            (owner, token, balance)
            VALUES
            ('0x0000000000000000000000000000000000000b0b', 'REP', 1000000000000000000),
            ('0x0000000000000000000000000000000000000b0b', 'ETH', 7000000000000000000)`);
    callback(null);
  });
}
