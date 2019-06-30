import * as t from "io-ts";
import * as Knex from "knex";

export enum Action {
  ALL = "ALL",
  BUY = "BUY",
  SELL = "SELL",
  CANCEL = "CANCEL",
  CLAIM_MARKET_CREATOR_FEES = "CLAIM_MARKET_CREATOR_FEES",
  CLAIM_PARTICIPATION_TOKENS = "CLAIM_PARTICIPATION_TOKENS",
  CLAIM_TRADING_PROCEEDS = "CLAIM_TRADING_PROCEEDS",
  CLAIM_WINNING_CROWDSOURCERS = "CLAIM_WINNING_CROWDSOURCERS",
  DISPUTE = "DISPUTE",
  INITIAL_REPORT = "INITIAL_REPORT",
  MARKET_CREATION = "MARKET_CREATION",
  COMPLETE_SETS = "COMPLETE_SETS",
}

export enum Coin {
  ALL = "ALL",
  ETH = "ETH",
  REP = "REP",
}

export const SortLimitParams = t.partial({
  sortBy: t.union([t.string, t.null, t.undefined]),
  isSortDescending: t.union([t.boolean, t.null, t.undefined]),
  limit: t.union([t.number, t.null, t.undefined]),
  offset: t.union([t.number, t.null, t.undefined]),
});

export interface AccountTransactionHistoryRow<BigNumberType> {
  action: Action;
  coin: string;
  details: string;
  fee: BigNumberType;
  marketId: string;
  marketDescription: string;
  marketType: string;
  outcome: number;
  outcomeDescription: string;
  payout0: BigNumberType;
  payout1: BigNumberType;
  payout2: BigNumberType;
  payout3: BigNumberType;
  payout4: BigNumberType;
  payout5: BigNumberType;
  payout6: BigNumberType;
  payout7: BigNumberType;
  isInvalid: boolean;
  price: BigNumberType;
  quantity: BigNumberType;
  scalarDenomination: string;
  timestamp: number;
  total: BigNumberType;
  transactionHash: string;
  marketCreatorFees: BigNumberType;
  minPrice: BigNumberType;
  maxPrice: BigNumberType;
  numCreatorShares: BigNumberType;
  numCreatorTokens: BigNumberType;
  numPayoutTokens: BigNumberType;
  numShares: BigNumberType;
  reporterFees: BigNumberType;
}

export const getAccountTransactionHistoryParams = t.intersection([
  SortLimitParams,
  t.type({
    universe: t.string,
    account: t.string,
    earliestTransactionTime: t.number,
    latestTransactionTime: t.number,
    coin: t.string,
    action: t.union([t.string, t.null, t.undefined]),
  }),
]);
type getAccountTransactionHistoryParamsType = t.TypeOf<typeof getAccountTransactionHistoryParams>;

export async function getAccountTransactionHistory(db: Knex, augur: {}, params: getAccountTransactionHistoryParamsType) {
  return [
    {
      action: Action.BUY,
      coin: Coin.ETH,
      details: "Details",
      fee: "0",
      marketDescription: "Market description",
      outcome: "Outcome",
      outcomeDescription: "Outcome description",
      price: "0",
      quantity: "0",
      scalarDenomination: "Scalar denom",
      timestamp: 1509670273,
      total: "0",
      transactionHash: "0x2000000000000000000000000000000000000000",
      numCreatorShares: "0",
      numCreatorTokens: "0",
    }
  ];
}
