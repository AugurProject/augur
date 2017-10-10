import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades").then(() => {
    return knex.schema.raw(`CREATE TABLE trades (
      order_id varchar(66) NOT NULL,
      market_id varchar(66) NOT NULL,
      outcome integer NOT NULL CONSTRAINT nonnegative_trade_outcome CHECK (outcome >= 0),
      share_token varchar(66) NOT NULL,
      order_type varchar(4) NOT NULL CONSTRAINT enum_trade_order_types CHECK (order_type = 'buy' OR order_type = 'sell'),
      creator varchar(66) NOT NULL,
      filler varchar(66) NOT NULL,
      trade_time integer NOT NULL CONSTRAINT positive_trade_time CHECK (trade_time > 0),
      trade_block_number integer NOT NULL CONSTRAINT positive_trade_block_number CHECK (trade_block_number > 0),
      num_creator_tokens numeric NOT NULL CONSTRAINT nonnegative_num_creator_tokens CHECK (num_creator_tokens >= 0),
      num_creator_shares numeric NOT NULL CONSTRAINT nonnegative_num_creator_shares CHECK (num_creator_shares >= 0),
      num_filler_tokens numeric NOT NULL CONSTRAINT nonnegative_num_filler_tokens CHECK (num_filler_tokens >= 0),
      num_filler_shares numeric NOT NULL CONSTRAINT nonnegative_num_filler_shares CHECK (num_filler_shares >= 0),
      settlement_fees numeric NOT NULL CONSTRAINT nonnegative_settlement_fees CHECK (settlement_fees >= 0),
      price numeric NOT NULL,
      shares numeric NOT NULL,
      trade_group_id integer
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades");
};
