import * as Knex from "knex";
import Promise = require("bluebird");

exports.up = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("orders").then(() => {
    return knex.schema.raw(`CREATE TABLE orders (
              order_id varchar(66) PRIMARY KEY NOT NULL,
              market varchar(66) NOT NULL,
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
            )`);
  });
};

exports.down = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("orders");
};
