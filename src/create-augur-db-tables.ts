import { SqlLiteDb, ErrorCallback } from "./types";

export function createAugurDbTables(db: SqlLiteDb, callback: ErrorCallback): void {
  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS markets`)
      .run(`CREATE TABLE markets (
              contract_address varchar(66) PRIMARY KEY NOT NULL,
              universe varchar(66) NOT NULL,
              market_type varchar(11) NOT NULL,
              num_outcomes integer NOT NULL,
              min_price integer NOT NULL,
              max_price integer NOT NULL,
              market_creator varchar(66) NOT NULL,
              creation_time integer NOT NULL,
              creation_block_number integer NOT NULL,
              creation_fee integer NOT NULL,
              market_creator_fee_rate integer NOT NULL,
              market_creator_fees_collected integer DEFAULT 0,
              topic varchar(255) NOT NULL,
              tag1 varchar(255),
              tag2 varchar(255),
              volume integer DEFAULT 0,
              shares_outstanding integer DEFAULT 0,
              reporting_window varchar(66),
              end_time integer NOT NULL,
              finalization_time integer,
              short_description varchar(1000) NOT NULL,
              long_description text,
              designated_reporter varchar(66) NOT NULL,
              resolution_source text
            )`)
      .run(`DROP TABLE IF EXISTS orders`)
      .run(`CREATE TABLE orders (
              order_id varchar(66) PRIMARY KEY NOT NULL,
              market varchar(66) NOT NULL,
              outcome integer NOT NULL,
              order_type integer NOT NULL,
              order_creator varchar(66) NOT NULL,
              creation_time integer NOT NULL,
              creation_block_number integer NOT NULL,
              price integer NOT NULL,
              amount integer NOT NULL,
              money_escrowed integer NOT NULL,
              shares_escrowed integer NOT NULL,
              better_order_id varchar(66),
              worse_order_id varchar(66)
            )`)
      .run(`DROP TABLE IF EXISTS balances`)
      .run(`CREATE TABLE balances (
              owner varchar(66) NOT NULL,
              token varchar(66) NOT NULL,
              balance integer NOT NULL DEFAULT 0,
              UNIQUE(owner, token)
            )`)
      .run(`DROP TABLE IF EXISTS tokens`)
      .run(`CREATE TABLE tokens (
              symbol varchar(10) PRIMARY KEY NOT NULL,
              contract_address varchar(66) NOT NULL,
              network_id integer NOT NULL,
              UNIQUE(network_id, contract_address)
            )`)
      .run(`DROP TABLE IF EXISTS topics`)
      .run(`CREATE TABLE topics (
              name varchar(255) PRIMARY KEY NOT NULL,
              popularity integer DEFAULT 0
            )`)
      .run(`DROP TABLE IF EXISTS blockchain_sync_history`)
      .run(`CREATE TABLE blockchain_sync_history (
              id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
              highest_block_number integer NOT NULL,
              sync_time timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
            )`)
      .run(`DROP TABLE IF EXISTS transfers`)
      .run(`CREATE TABLE transfers (
              transaction_hash varchar(66) NOT NULL,
              log_index integer NOT NULL,
              sender varchar(66) NOT NULL,
              recipient varchar(66) NOT NULL,
              token varchar(66) NOT NULL,
              value integer NOT NULL,
              block_number integer NOT NULL,
              UNIQUE(transaction_hash, log_index)
            )`, callback);
  });
}
