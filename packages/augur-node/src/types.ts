import { BigNumber } from "ethers/utils";
export { BigNumber } from "ethers/utils";
export { Block as BlockDetail } from "ethers/providers";

import { EventEmitter } from "events";
import Knex from "knex";
import * as WebSocket from "ws";
import * as https from "https";
import * as http from "http";
import * as t from "io-ts";

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Augur as GenericAugur, ParsedLog } from "@augurproject/api";

export class Augur extends GenericAugur<BigNumber, EthersProvider> {};
export { ParsedLog as FormattedEventLog } from "@augurproject/api";

export type BlockRange = { fromBlock: number; toBlock: number };


export enum ReportingState {
  PRE_REPORTING = "PRE_REPORTING",
  DESIGNATED_REPORTING = "DESIGNATED_REPORTING",
  OPEN_REPORTING = "OPEN_REPORTING",
  CROWDSOURCING_DISPUTE = "CROWDSOURCING_DISPUTE",
  AWAITING_NEXT_WINDOW = "AWAITING_NEXT_WINDOW",
  AWAITING_FINALIZATION = "AWAITING_FINALIZATION",
  FINALIZED = "FINALIZED",
  FORKING = "FORKING",
  AWAITING_NO_REPORT_MIGRATION = "AWAITING_NO_REPORT_MIGRATION",
  AWAITING_FORK_MIGRATION = "AWAITING_FORK_MIGRATION",
}

export enum DisputeWindowState {
  PAST = "PAST",
  CURRENT = "CURRENT",
  FUTURE = "FUTURE",
}

export enum OrderState {
  ALL = "ALL",
  OPEN = "OPEN",
  FILLED = "FILLED",
  CANCELED = "CANCELED",
}

export interface BaseTransactionRow {
  blockNumber: number;
  logIndex: number;
  transactionHash: Bytes32;
}

export interface BaseTransaction extends BaseTransactionRow {
  blockHash: Bytes32;
}

export interface WebSocketConfigs {
  pingMs?: number;
  ws?: {[config: string]: any};
  wss?: {[config: string]: any};
}

export interface EthereumNodeEndpoints {
  [protocol: string]: string;
}
export interface UploadBlockNumbers {
  [networkId: string]: number;
}

export type AbiEncodedData = string;
export type Address = string;
export type Bytes32 = string;
export type Int256 = string;

export interface MarketCreatedLogExtraInfo {
  minPrice?: string;
  maxPrice?: string;
  tags?: Array<string|null>;
  outcomeNames?: Array<string|number|null>;
  description?: string;
  longDescription?: string|null;
  _scalarDenomination?: string|null;
  resolutionSource?: string|null;
  marketType?: string;
}

export interface MarketCreatedOnContractInfo {
  marketCreatorFeeRate: string;
  disputeWindow: Address;
  endTime: string;
  designatedReporter: Address;
  designatedReportStake: string;
  numTicks: string;
}

export type ErrorCallback = (err: Error|null) => void;

export type GenericCallback<ResultType> = (err: Error|null, result?: ResultType) => void;

export type AsyncCallback = (err: Error|null, result?: any) => void;

export type LogProcessor = (augur: Augur, log: ParsedLog) => Promise<(db: Knex) => Promise<void>>;

export interface EventLogProcessor {
  add: LogProcessor;
  remove: LogProcessor;
  noAutoEmit?: boolean;
}

export interface LogProcessors {
  [contractName: string]: {
    [eventName: string]: EventLogProcessor;
  };
}

export interface JsonRpcRequest {
  id: string|number|null;
  jsonrpc: string;
  method: string;
  params: any;
}

export interface JsonRpcResponse {
  id: string|number|null;
  jsonrpc: string;
  result: any;
}

export const OutcomeParam = t.keyof({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
});

export const SortLimitParams = t.partial({
  sortBy: t.union([t.string, t.null, t.undefined]),
  isSortDescending: t.union([t.boolean, t.null, t.undefined]),
  limit: t.union([t.number, t.null, t.undefined]),
  offset: t.union([t.number, t.null, t.undefined]),
});

export interface SortLimit {
  sortBy: string|null|undefined;
  isSortDescending: boolean|null|undefined;
  limit: number|null|undefined;
  offset: number|null|undefined;
}

export interface GetMarketInfoRequest {
  jsonrpc: string;
  id: string|number;
  method: string;
  params: {
    market: string;
  };
}

export interface GetAccountTransferHistoryRequest {
  jsonrpc: string;
  id: string|number;
  method: string;
  params: {
    account: Address;
    token: Address|null;
  };
}

export interface MarketsContractAddressRow {
  marketId: Address;
}

export interface MarketIdUniverseDisputeWindow extends MarketsContractAddressRow {
  universe: Address;
  disputeWindow: Address;
}

export interface MarketPricing<BigNumberType> {
  minPrice: BigNumberType;
  maxPrice: BigNumberType;
  numTicks: BigNumberType;
}

export interface MarketsRow<BigNumberType> extends MarketPricing<BigNumberType> {
  marketId: Address;
  transactionHash: Bytes32;
  logIndex: number;
  universe: Address;
  marketType: string;
  marketCreator: Address;
  numOutcomes: number;
  creationBlockNumber: number;
  creationFee: BigNumberType;
  reportingFeeRate: BigNumberType;
  marketCreatorFeeRate: BigNumberType;
  marketCreatorFeesBalance: BigNumberType|null;
  initialReportSize: BigNumberType|null;
  validityBondSize: BigNumberType;
  category: string;
  tag1: string|null;
  tag2: string|null;
  volume: BigNumberType;
  openInterest: BigNumberType;
  sharesOutstanding: BigNumberType;
  marketStateId: number;
  disputeWindow: Address;
  endTime: number;
  finalizationBlockNumber?: number|null;
  lastTradeBlockNumber?: number|null;
  reportingState?: ReportingState|null;
  shortDescription: string;
  longDescription?: string|null;
  scalarDenomination?: string|null;
  designatedReporter: Address;
  designatedReportStake: BigNumberType;
  resolutionSource?: string|null;
  consensusPayoutId?: number|null;
  isInvalid?: boolean|null;
  forking: number;
  needsMigration: number;
  needsDisavowal: number;
}

export interface SearchRow {
  marketId: Address;
  category: string;
  tags: string|null;
  shortDescription: string;
  longDescription?: string|null;
  scalarDenomination?: string|null;
  resolutionSource?: string|null;
}

export interface PositionsRow<BigNumberType> {
  outcome: number;
  marketId?: Address;
  numShares: BigNumberType|null;
  account: Address|null;
  realizedProfitLoss?: BigNumberType;
  unrealizedProfitLoss?: BigNumberType;
  numSharesAdjustedForUserIntention?: BigNumberType;
}

export interface OutcomesRow<BigNumberType> {
  marketId: Address;
  outcome: number;
  price: BigNumberType;
  volume: BigNumberType;
  shareVolume: BigNumberType;
  description: string|null;
}

export interface TokensRow {
  contractAddress?: Address;
  symbol: string;
  marketId: Address;
  outcome?: number;
}

export interface CategoriesRow<BigNumberType> {
  category: string;
  nonFinalizedOpenInterest: BigNumberType;
  openInterest: BigNumberType;
  universe: Address;
}

export interface BlocksRow {
  blockNumber: number;
  timestamp: number;
}

export interface TransactionHashesRow {
  blockNumber: number;
  transactionHash: number;
}

export interface DisputeTokensRow<BigNumberType> extends Payout<BigNumberType> {
  disputeToken: Address;
  marketId: Address;
  amountStaked: BigNumberType;
  claimed: BigNumberType;
  winning: BigNumberType|null;
}

export interface DisputeTokensRowWithTokenState<BigNumberType> extends DisputeTokensRow<BigNumberType> {
  ReportingState: ReportingState;
}

export interface PayoutRow<BigNumberType> extends Payout<BigNumberType> {
  marketId: string;
  payoutId: number;
  tentativeWinning: number;
}

export interface PayoutNumerators<BigNumberType> {
  payout0: BigNumberType;
  payout1: BigNumberType;
  payout2: BigNumberType|null;
  payout3: BigNumberType|null;
  payout4: BigNumberType|null;
  payout5: BigNumberType|null;
  payout6: BigNumberType|null;
  payout7: BigNumberType|null;
}

export interface Payout<BigNumberType> extends PayoutNumerators<BigNumberType> {
  isInvalid: boolean|number;
}

export interface NormalizedPayoutNumerators<BigNumberType> {
  payout: Array<BigNumberType>;
}

export interface NormalizedPayout<BigNumberType> extends NormalizedPayoutNumerators<BigNumberType> {
  isInvalid: boolean|number;
}

export interface UIDisputeTokenInfo<BigNumberType> extends Payout<BigNumberType> {
  disputeToken: Address;
  marketId: Address;
  amountStaked: BigNumberType;
  claimed: boolean;
  winningToken: boolean|null;
  ReportingState: ReportingState;
}

export interface UIDisputeTokens<BigNumberType> {
  [stakeToken: string]: UIDisputeTokenInfo<BigNumberType>;
}

export interface StakeDetails<BigNumberType> extends NormalizedPayout<BigNumberType> {
  stakeCompleted: BigNumberType;
  size?: BigNumberType;
  stakeCurrent?: BigNumberType;
  tentativeWinning: boolean;
}

export interface UIStakeInfo<BigNumberType> {
  marketId: Address;
  disputeRound: number|null;
  stakeCompletedTotal: BigNumberType;
  bondSizeOfNewStake: BigNumberType;
  stakes: Array<StakeDetails<BigNumberType>>;
}

export interface UIMarketCreatorFee {
  marketId: Address;
  unclaimedFee: string;
}

export interface UIConsensusInfo {
  outcomeId: number;
  isInvalid: boolean;
}

export interface UIOutcomeInfo<BigNumberType> {
  id: number;
  volume: BigNumberType;
  price: BigNumberType;
  description: string|null;
}

export interface UIMarketInfo<BigNumberType> {
  id: Address;
  universe: Address;
  marketType: string;
  numOutcomes: number;
  minPrice: BigNumberType;
  maxPrice: BigNumberType;
  cumulativeScale: BigNumberType;
  author: Address;
  creationTime: number;
  creationBlock: number;
  creationFee: BigNumberType;
  settlementFee: BigNumberType;
  reportingFeeRate: BigNumberType;
  marketCreatorFeeRate: BigNumberType;
  marketCreatorFeesBalance: BigNumberType|null;
  initialReportSize: BigNumberType|null;
  category: string;
  tags: Array<string|null>;
  volume: BigNumberType;
  openInterest: BigNumberType;
  outstandingShares: BigNumberType;
  disputeWindow: Address;
  endTime: number;
  finalizationBlockNumber?: number|null;
  finalizationTime?: number|null;
  lastTradeBlockNumber?: number|null;
  lastTradeTime?: number|null;
  reportingState?: ReportingState|null;
  forking: number;
  needsMigration: number;
  description: string;
  details?: string|null;
  scalarDenomination?: string|null;
  designatedReporter: Address;
  designatedReportStake: BigNumberType;
  resolutionSource?: string|null;
  numTicks: BigNumberType;
  tickSize: BigNumberType;
  consensus: NormalizedPayout<BigNumberType>|null;
  outcomes: Array<UIOutcomeInfo<string>>;
}

export type UIMarketsInfo<BigNumberType> = Array<UIMarketInfo<BigNumberType>|null>;

// OpenInterestAggregation is an aggregation of various types of open interest
// for markets within some particular context. Eg. all markets within a category.
export interface OpenInterestAggregation<BigNumberType> {
  nonFinalizedOpenInterest: BigNumberType; // sum of open interest for non-finalized markets in this aggregation (ie. markets with ReportingState != FINALIZED)
  openInterest: BigNumberType; // sum of open interest for all markets in this aggregation
}

// TagAggregation is an aggregation of tag statistics/data for a set of
// markets within some particular context, eg. all markets in a category.
export interface TagAggregation<BigNumberType> extends OpenInterestAggregation<BigNumberType> {
  tagName: string;
  numberOfMarketsWithThisTag: number;
}

export interface UICategory<BigNumberType> extends OpenInterestAggregation<BigNumberType> {
  categoryName: string;
  tags: Array<TagAggregation<BigNumberType>>;
}

// Does not extend BaseTransaction since UI is expecting "creationBlockNumber"
export interface UIOrder<BigNumberType> {
  orderId: Bytes32;
  transactionHash: Bytes32;
  logIndex: number;
  shareToken: Address;
  owner: Address;
  creationTime: number;
  creationBlockNumber: number;
  orderState: OrderState;
  price: BigNumberType;
  amount: BigNumberType;
  originalAmount: BigNumberType;
  fullPrecisionPrice: BigNumberType;
  fullPrecisionAmount: BigNumberType;
  originalFullPrecisionAmount: BigNumberType;
  tokensEscrowed: BigNumberType;
  sharesEscrowed: BigNumberType;
  canceledBlockNumber?: Bytes32;
  canceledTransactionHash?: Bytes32;
  canceledTime?: Bytes32;
}

export interface UIOrders<BigNumberType> {
  [marketId: string]: {
    [outcome: number]: {
      [orderType: string]: {
        [orderId: string]: UIOrder<BigNumberType>;
      };
    };
  };
}

export interface OrdersRow<BigNumberType> extends BaseTransactionRow {
  orderId?: Bytes32;
  marketId: Address;
  outcome: number;
  shareToken: Address;
  orderType: string;
  orderCreator: Address;
  orderState: OrderState;
  price: BigNumberType;
  amount: BigNumberType;
  originalAmount: BigNumberType;
  fullPrecisionPrice: BigNumberType;
  fullPrecisionAmount: BigNumberType;
  originalFullPrecisionAmount: BigNumberType;
  tokensEscrowed: BigNumberType;
  sharesEscrowed: BigNumberType;
  tradeGroupId: Bytes32|null;
}

export interface UITrade {
  transactionHash: string;
  logIndex: number;
  orderId: string;
  type: string;
  price: string;
  amount: string;
  maker: boolean|null;
  selfFilled: boolean;
  marketCreatorFees: string;
  reporterFees: string;
  settlementFees: string;
  marketId: Address;
  outcome: number;
  shareToken: Address;
  timestamp: number;
  tradeGroupId: Bytes32|null;
}

export interface TradesRow<BigNumberType> extends BaseTransactionRow {
  orderId: Bytes32;
  marketId: Address;
  outcome: number;
  shareToken: Address;
  orderType: string;
  creator: Address;
  filler: Address;
  numCreatorTokens: BigNumberType;
  numCreatorShares: BigNumberType;
  numFillerTokens: BigNumberType;
  numFillerShares: BigNumberType;
  price: BigNumberType;
  amount: BigNumberType;
  marketCreatorFees: BigNumberType;
  reporterFees: BigNumberType;
  tradeGroupId: Bytes32|null;
}

export interface CompleteSetsRow<BigNumberType> extends BaseTransactionRow {
  marketId: Address;
  account: Address;
  universe: Address;
  eventName: string;
  numPurchasedOrSold: BigNumberType;
  numCompleteSets: BigNumberType;
  tradeGroupId: Bytes32|null;
}

export interface UICompleteSetsRow<BigNumberType> extends CompleteSetsRow<BigNumberType> {
  timestamp: number;
}

export interface TradingHistoryRow extends TradesRow<BigNumber> {
  timestamp: number;
}

export interface ProceedTradesRow<BigNumberType> {
  logIndex: number;
  blockNumber: number;
  timestamp: number;
  marketId: Address;
  outcome: number;
  price: BigNumberType;
  amount: BigNumberType;
  type: "sell";
  maker: false;
}
export interface TimestampedPriceAmount<BigNumberType> {
  price: BigNumberType;
  amount: BigNumberType;
  timestamp: number;
}

export interface MarketPriceHistory<BigNumberType> {
  [outcome: number]: Array<TimestampedPriceAmount<BigNumberType>>;
}

export interface MarketsRowWithTime extends MarketsRow<BigNumber> {
  creationTime: number;
  finalizationTime?: null|number;
  lastTradeTime?: null|number;
}

export interface JoinedReportsMarketsRow<BigNumberType> extends Payout<BigNumberType> {
  creationBlockNumber: number;
  creationTime: number;
  logIndex: number;
  transactionHash: Bytes32;
  blockHash: Bytes32;
  marketId: Address;
  universe: Address;
  disputeWindow: Address;
  crowdsourcerId?: Address;
  initialReporter?: Address;
  marketType: string;
  participantType: string;
  amountStaked: BigNumberType;

}

export interface UIReport<BigNumberType> {
  creationBlockNumber: number;
  creationTime: number;
  logIndex: number;
  transactionHash: Bytes32;
  blockHash: Bytes32;
  marketId: Address;
  disputeWindow: Address;
  payoutNumerators: Array<BigNumberType|null>;
  amountStaked: BigNumberType;
  crowdsourcerId: Address;
  isCategorical: boolean;
  isScalar: boolean;
  isInvalid: boolean;
  isSubmitted: boolean;
}

export interface DisputeWindowRow {
  disputeWindow: Address;
  disputeWindowId: number;
  universe: Address;
  startTime: number;
  state: DisputeWindowState;
  endTime: number;
  fees: number|string;
}

export interface InitialReportersRow<BigNumberType> {
  marketId: Address;
  reporter: Address;
  amountStaked: BigNumberType;
  initialReporter: number;
  redeemed: boolean;
  isDesignatedReporter: boolean;
  repBalance: BigNumberType;
}

export interface UIInitialReporters<BigNumberType> {
  [initialReporter: string]: InitialReportersRow<BigNumberType>;
}

export interface ForkMigrationTotalsRow<BigNumberType> extends Payout<BigNumberType> {
  universe: Address;
  repTotal: BigNumberType;
}

export interface UIForkMigrationTotalsRow<BigNumberType> extends NormalizedPayout<BigNumberType> {
  universe: Address;
  repTotal: BigNumberType;
}

export interface UIForkMigrationTotals<BigNumberType> {
  [universe: string]: UIForkMigrationTotalsRow<BigNumberType>;
}

export interface UniverseInfoRow<BigNumberType> extends Payout<BigNumberType> {
  universe: Address;
  parentUniverse: Address;
  balance: BigNumberType;
  supply: BigNumberType;
  numMarkets: BigNumberType;
}

export interface UIUniverseInfoRow<BigNumberType> extends NormalizedPayout<string> {
  universe: Address;
  parentUniverse: Address;
  balance: BigNumberType;
  supply: BigNumberType;
  numMarkets: BigNumberType;
}

export interface ServersData {
  servers: Array<WebSocket.Server>;
  httpServers: Array<http.Server | https.Server>;
  controlEmitter: EventEmitter;
}

export interface AllOrdersRow<BigNumberType> {
  orderId: Address;
  tokensEscrowed: BigNumberType;
  sharesEscrowed: BigNumberType;
  marketId: Address;
}

export interface PendingOrphanedOrderData {
  marketId: Address;
  outcome: number;
  orderType: string;
}
