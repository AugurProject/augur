import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE orders (
      orderID varchar(66) PRIMARY KEY NOT NULL,
      marketID varchar(66) NOT NULL,
      outcome integer NOT NULL CONSTRAINT nonnegativeOutcome CHECK (outcome >= 0),
      shareToken varchar(66) NOT NULL,
      orderType varchar(4) NOT NULL CONSTRAINT enumOrderTypes CHECK (orderType = 'buy' OR orderType = 'sell'),
      orderCreator varchar(66) NOT NULL,
      creationTime integer NOT NULL CONSTRAINT positiveOrderCreationTime CHECK (creationTime > 0),
      creationBlockNumber integer NOT NULL CONSTRAINT positiveOrderCreationBlockNumber CHECK (creationBlockNumber > 0),
      fullPrecisionPrice numeric NOT NULL,
      fullPrecisionAmount numeric NOT NULL,
      price numeric NOT NULL,
      amount numeric NOT NULL CONSTRAINT nonnegativeAmount CHECK (amount >= 0),
      tokensEscrowed numeric NOT NULL CONSTRAINT nonnegativeTokensEscrowed CHECK (tokensEscrowed >= 0),
      sharesEscrowed numeric NOT NULL CONSTRAINT nonnegativeSharesEscrowed CHECK (sharesEscrowed >= 0),
      betterOrderID varchar(66),
      worseOrderID varchar(66),
      tradeGroupID varchar(66)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders");
};
