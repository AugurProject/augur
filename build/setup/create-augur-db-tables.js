"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createAugurDbTables(db, callback) {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS markets`)
            .run(`CREATE TABLE markets (
              market_id varchar(66) PRIMARY KEY NOT NULL,
              universe varchar(66) NOT NULL,
              market_type varchar(11) NOT NULL CONSTRAINT enum_market_types CHECK (market_type = 'binary' OR market_type = 'categorical' OR market_type = 'scalar'),
              num_outcomes integer NOT NULL CONSTRAINT positive_num_outcomes CHECK (num_outcomes > 0),
              min_price numeric NOT NULL,
              max_price numeric NOT NULL CONSTRAINT max_price_gt_min_price CHECK (max_price > min_price),
              market_creator varchar(66) NOT NULL,
              creation_time integer NOT NULL CONSTRAINT positive_market_creation_time CHECK (creation_time > 0),
              creation_block_number integer NOT NULL CONSTRAINT positive_market_creation_block_number CHECK (creation_block_number > 0),
              creation_fee numeric NOT NULL CONSTRAINT nonnegative_creation_fee CHECK (creation_fee >= 0),
              market_creator_fee_rate numeric NOT NULL CONSTRAINT nonnegative_market_creator_fee_rate CHECK (market_creator_fee_rate >= 0),
              market_creator_fees_collected numeric DEFAULT 0 CONSTRAINT nonnegative_market_creator_fees_collected CHECK (market_creator_fees_collected >= 0),
              topic varchar(255) NOT NULL,
              tag1 varchar(255),
              tag2 varchar(255),
              volume numeric DEFAULT 0 CONSTRAINT nonnegative_volume CHECK (volume >= 0),
              shares_outstanding numeric DEFAULT 0 CONSTRAINT nonnegative_shares_outstanding CHECK (shares_outstanding >= 0),
              reporting_window varchar(66),
              end_time integer NOT NULL CONSTRAINT positive_end_time CHECK (end_time > 0),
              finalization_time integer,
              short_description varchar(1000) NOT NULL,
              long_description text,
              designated_reporter varchar(66) NOT NULL,
              resolution_source text
            )`)
            .run(`DROP TABLE IF EXISTS orders`)
            .run(`CREATE TABLE orders (
              order_id varchar(66) PRIMARY KEY NOT NULL,
              market_id varchar(66) NOT NULL,
              outcome integer NOT NULL CONSTRAINT nonnegative_outcome CHECK (outcome >= 0),
              share_token varchar(66) NOT NULL,
              order_type varchar(4) NOT NULL CONSTRAINT enum_order_types CHECK (order_type = 'buy' OR order_type = 'sell'),
              order_creator varchar(66) NOT NULL,
              creation_time integer NOT NULL CONSTRAINT positive_order_creation_time CHECK (creation_time > 0),
              creation_block_number integer NOT NULL CONSTRAINT positive_order_creation_block_number CHECK (creation_block_number > 0),
              price numeric NOT NULL,
              amount numeric NOT NULL CONSTRAINT nonnegative_amount CHECK (amount >= 0),
              tokens_escrowed numeric NOT NULL CONSTRAINT nonnegative_tokens_escrowed CHECK (tokens_escrowed >= 0),
              shares_escrowed numeric NOT NULL CONSTRAINT nonnegative_shares_escrowed CHECK (shares_escrowed >= 0),
              trade_group_id varchar(66)
            )`)
            .run(`DROP TABLE IF EXISTS tokens`)
            .run(`CREATE TABLE tokens (
              contract_address varchar(66) PRIMARY KEY NOT NULL,
              symbol varchar(255) NOT NULL,
              market varchar(66),
              outcome integer,
              UNIQUE(symbol, market, outcome)
            )`)
            .run(`DROP TABLE IF EXISTS blocks`)
            .run(`CREATE TABLE blocks (
              block_number integer PRIMARY KEY NOT NULL,
              block_timestamp integer NOT NULL
            )`)
            .run(`DROP TABLE IF EXISTS topics`)
            .run(`CREATE TABLE topics (
              name varchar(255) PRIMARY KEY NOT NULL,
              popularity integer DEFAULT 0,
              universe varchar(66) NOT NULL
            )`)
            .run(`DROP TABLE IF EXISTS blockchain_sync_history`)
            .run(`CREATE TABLE blockchain_sync_history (
              id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
              highest_block_number integer NOT NULL CONSTRAINT nonnegative_highest_block_number CHECK (highest_block_number >= 0),
              sync_time timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
            )`)
            .run(`DROP TABLE IF EXISTS approvals`)
            .run(`CREATE TABLE approvals (
              transaction_hash varchar(66) NOT NULL,
              log_index integer NOT NULL CONSTRAINT nonnegative_log_index CHECK (log_index >= 0),
              owner varchar(66) NOT NULL,
              spender varchar(66) NOT NULL,
              token varchar(66) NOT NULL,
              value numeric NOT NULL CONSTRAINT positive_value CHECK (value > 0),
              block_number integer NOT NULL CONSTRAINT positive_block_number CHECK (block_number > 0),
              UNIQUE(transaction_hash, log_index)
            )`)
            .run(`DROP TABLE IF EXISTS transfers`)
            .run(`CREATE TABLE transfers (
              transaction_hash varchar(66) NOT NULL,
              log_index integer NOT NULL CONSTRAINT nonnegative_log_index CHECK (log_index >= 0),
              sender varchar(66) NOT NULL,
              recipient varchar(66) NOT NULL,
              token varchar(66) NOT NULL,
              value numeric NOT NULL CONSTRAINT positive_value CHECK (value > 0),
              block_number integer NOT NULL CONSTRAINT positive_block_number CHECK (block_number > 0),
              UNIQUE(transaction_hash, log_index)
            )`, callback);
    });
}
exports.createAugurDbTables = createAugurDbTables;
//# sourceMappingURL=create-augur-db-tables.js.map