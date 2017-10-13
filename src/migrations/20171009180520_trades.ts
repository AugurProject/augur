import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE trades (
      orderID varchar(66) NOT NULL,
      marketID varchar(66) NOT NULL,
      outcome integer NOT NULL CONSTRAINT nonnegativeTradeOutcome CHECK (outcome >= 0),
      shareToken varchar(66) NOT NULL,
      orderType varchar(4) NOT NULL CONSTRAINT enumTradeOrderTypes CHECK (orderType = 'buy' OR orderType = 'sell'),
      creator varchar(66) NOT NULL,
      filler varchar(66) NOT NULL,
      tradeTime integer NOT NULL CONSTRAINT positiveTradeTime CHECK (tradeTime > 0),
      tradeBlockNumber integer NOT NULL CONSTRAINT positiveTradeBlockNumber CHECK (tradeBlockNumber > 0),
      numCreatorTokens numeric NOT NULL CONSTRAINT nonnegativeNumCreatorTokens CHECK (numCreatorTokens >= 0),
      numCreatorShares numeric NOT NULL CONSTRAINT nonnegativeNumCreatorShares CHECK (numCreatorShares >= 0),
      numFillerTokens numeric NOT NULL CONSTRAINT nonnegativeNumFillerTokens CHECK (numFillerTokens >= 0),
      numFillerShares numeric NOT NULL CONSTRAINT nonnegativeNumFillerShares CHECK (numFillerShares >= 0),
      settlementFees numeric NOT NULL CONSTRAINT nonnegativeSettlementFees CHECK (settlementFees >= 0),
      price numeric NOT NULL,
      shares numeric NOT NULL,
      tradeGroupID integer
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades");
};
