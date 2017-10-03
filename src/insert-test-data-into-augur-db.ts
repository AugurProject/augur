import { Database } from "sqlite3";
import { ErrorCallback } from "./types";

export function insertTestDataIntoAugurDb(db: Database, callback: ErrorCallback): void {
  db.serialize(() => {
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
            (order_id, market, outcome, order_type, order_creator, creation_time, creation_block_number, price, amount, tokens_escrowed, shares_escrowed, better_order_id, worse_order_id)
            VALUES (
              '0x1000000000000000000000000000000000000000000000000000000000000000',
              '0x0000000000000000000000000000000000000001',
              0,
              'buy',
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
              'buy',
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
      .run(`INSERT INTO tokens
            (contract_address, symbol, market, outcome)
            VALUES
            ('0x7a305d9b681fb164dc5ad628b5992177dc66aec8', 'REP', NULL, NULL),
            ('0x1000000000000000000000000000000000000000', 'shares', '0x0000000000000000000000000000000000000001', 1)`)
      .run(`INSERT INTO transfers
            (transaction_hash, log_index, sender, recipient, token, value, block_number)
            VALUES (
              '0x00000000000000000000000000000000000000000000000000000000deadbeef',
              0,
              '0x0000000000000000000000000000000000000b0b',
              '0x000000000000000000000000000000000000d00d',
              '0x1000000000000000000000000000000000000000',
              10,
              1400000
            ), (
              '0x00000000000000000000000000000000000000000000000000000000d3adb33f',
              0,
              '0x000000000000000000000000000000000000d00d',
              '0x0000000000000000000000000000000000000b0b',
              '0x1000000000000000000000000000000000000000',
              2,
              1400001
            ), (
              '0x00000000000000000000000000000000000000000000000000000000deadb33f',
              1,
              '0x0000000000000000000000000000000000000b0b',
              '0x000000000000000000000000000000000000d00d',
              '0x7a305d9b681fb164dc5ad628b5992177dc66aec8',
              47,
              1400001
            )`)
      .run(`INSERT INTO balances
            (owner, token, balance)
            VALUES
            ('0x0000000000000000000000000000000000000b0b', '0x7a305d9b681fb164dc5ad628b5992177dc66aec8', 1000000000000000000),
            ('0x000000000000000000000000000000000000d00d', '0x7a305d9b681fb164dc5ad628b5992177dc66aec8', 500000000000000000),
            ('0x0000000000000000000000000000000000000b0b', '0x1000000000000000000000000000000000000000', 7000000000000000000),
            ('0x000000000000000000000000000000000000d00d', '0x1000000000000000000000000000000000000000', 3500000000000000000)`, callback);
  });
}
