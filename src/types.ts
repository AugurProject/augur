import { Augur, FormattedEventLog } from "augur.js";
import * as Knex from "knex";

export { BlockDetail, FormattedEventLog } from "augur.js";

export enum ReportingState {
  PRE_REPORTING = "PRE_REPORTING",
  DESIGNATED_REPORTING = "DESIGNATED_REPORTING",
  OPEN_REPORTING = "OPEN_REPORTING",
  CROWDSOURCING_DISPUTE = "CROWDSOURCING_DISPUTE",
  AWAITING_NEXT_WINDOW = "AWAITING_NEXT_WINDOW",
  FINALIZED = "FINALIZED",
  FORKING = "FORKING",
  AWAITING_NO_REPORT_MIGRATION = "AWAITING_NO_REPORT_MIGRATION",
  AWAITING_FORK_MIGRATION = "AWAITING_FORK_MIGRATION",
}

export enum DisputeTokenState {
  ALL = "ALL",
  UNCLAIMED = "UNCLAIMED",
  UNFINALIZED = "UNFINALIZED",
}

export enum OrderState {
  ALL = "ALL",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
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
  resolutionSource?: string|null;
  marketType?: string;
}

export interface MarketCreatedOnContractInfo {
  marketCreatorFeeRate: string;
  feeWindow: Address;
  endTime: string;
  designatedReporter: Address;
  designatedReportStake: string;
  numTicks: string;
}

export type ErrorCallback = (err?: Error|null) => void;

export type GenericCallback<ResultType> = (err?: Error|null, result?: ResultType) => void;

export type AsyncCallback = (err?: Error|null, result?: any) => void;

export type LogProcessor = (db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback) => void;

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
  marketId: string;
}

export interface MarketsRow {
  marketId: Address;
  universe: Address;
  marketType: string;
  numOutcomes: number;
  minPrice: string|number;
  maxPrice: string|number;
  marketCreator: Address;
  creationBlockNumber: number;
  creationFee: string|number;
  reportingFeeRate: string|number;
  marketCreatorFeeRate: string|number;
  marketCreatorFeesCollected: string|number|null;
  initialReportSize: string|number|null;
  category: string;
  tag1: string|null;
  tag2: string|null;
  volume: string|number;
  sharesOutstanding: string|number;
  marketStateId: number;
  feeWindow: Address;
  endTime: number;
  finalizationTime?: number|null;
  reportingState?: ReportingState|null;
  shortDescription: string;
  longDescription?: string|null;
  designatedReporter: Address;
  designatedReportStake: string|number;
  resolutionSource?: string|null;
  numTicks: number;
  consensusPayoutId?: number|null;
  isInvalid?: boolean|null;
}

export interface PositionsRow {
  outcome: number;
  marketId?: Address;
  numShares?: string|number;
  account?: Address;
  realizedProfitLoss?: string|number;
  unrealizedProfitLoss?: string|number;
  numSharesAdjustedForUserIntention?: string|number;
}

export interface OutcomesRow {
  marketId: Address;
  outcome: number;
  price: string|number;
  volume: string|number;
  description: string|null;
}

export interface TokensRow {
  contractAddress?: Address;
  symbol: string;
  marketId: Address;
  outcome?: number;
}

export interface CategoriesRow {
  popularity: string|number;
}

export interface BlocksRow {
  blockNumber: number;
  timestamp: number;
}

export interface DisputeTokensRow extends Payout {
  disputeToken: Address;
  marketId: Address;
  amountStaked: number;
  claimed: number;
  winning: number|null;
}

export interface DisputeTokensRowWithTokenState extends DisputeTokensRow {
  ReportingState: ReportingState;
}

export interface PayoutRow extends Payout {
  payoutId: number;
  tentativeWinning: number;
}

export interface PayoutNumerators {
  payout0: string|number;
  payout1: string|number;
  payout2: string|number|null;
  payout3: string|number|null;
  payout4: string|number|null;
  payout5: string|number|null;
  payout6: string|number|null;
  payout7: string|number|null;
}

export interface Payout extends PayoutNumerators {
  isInvalid: boolean|number;
}

export interface NormalizedPayoutNumerators {
  payout: Array<number|string>;
}

export interface NormalizedPayout extends NormalizedPayoutNumerators {
  isInvalid: boolean|number;
}

export interface UIDisputeTokenInfo extends Payout {
  disputeToken: Address;
  marketId: Address;
  amountStaked: number;
  claimed: boolean;
  winningToken: boolean|null;
  ReportingState: ReportingState;
}

export interface UIDisputeTokens {
  [stakeToken: string]: UIDisputeTokenInfo;
}

export interface StakeDetails extends NormalizedPayout {
  totalStake: string;
  completedStake: string;
  size?: string;
  currentStake?: string;
  tentativeWinning: boolean;
}

export interface UIStakeInfo {
  marketId: Address;
  disputeRound: number|null;
  stakes: Array<StakeDetails>;
}

export interface UIFeeWindowCurrent {
  endBlockNumber: number|null;
  endTime: number;
  feeWindow: Address;
  feeWindowId: number;
  startBlockNumber: number;
  startTime: number;
  universe: Address;
  totalStake?: number;

}

export interface UIMarketCreatorFee {
  marketId: Address;
  unclaimedFee: string;
}

export interface UIConsensusInfo {
  outcomeId: number;
  isInvalid: boolean;
}

export interface UIOutcomeInfo {
  id: number;
  volume: string|number;
  price: string|number;
  description: string|null;
}

export interface UIMarketInfo {
  id: Address;
  universe: Address;
  marketType: string;
  numOutcomes: number;
  minPrice: string|number;
  maxPrice: string|number;
  cumulativeScale: string|number;
  author: Address;
  creationTime: number;
  creationBlock: number;
  creationFee: string|number;
  settlementFee: string;
  reportingFeeRate: string|number;
  marketCreatorFeeRate: string|number;
  marketCreatorFeesCollected: string|number|null;
  initialReportSize: string|number|null;
  category: string;
  tags: Array<string|null>;
  volume: string|number;
  outstandingShares: string|number;
  feeWindow: Address;
  endDate: number;
  finalizationTime?: number|null;
  reportingState?: ReportingState|null;
  description: string;
  extraInfo?: string|null;
  designatedReporter: Address;
  designatedReportStake: string|number;
  resolutionSource?: string|null;
  numTicks: string|number;
  tickSize: string|number;
  consensus: NormalizedPayout|null;
  outcomes: Array<UIOutcomeInfo>;
}

export type UIMarketsInfo = Array<UIMarketInfo|null>;

// Does not extend BaseTransaction since UI is expecting "creationBlockNumber"
export interface UIOrder {
  orderId: Bytes32;
  transactionHash: Bytes32;
  logIndex: number;
  shareToken: Address;
  owner: Address;
  creationTime: number;
  creationBlockNumber: number;
  orderState: OrderState;
  price: number|string;
  amount: number|string;
  fullPrecisionPrice: number|string;
  fullPrecisionAmount: number|string;
  tokensEscrowed: number|string;
  sharesEscrowed: number|string;
}

export interface UIOrders {
  [marketId: string]: {
    [outcome: number]: {
      [orderType: string]: {
        [orderId: string]: UIOrder;
      };
    };
  };
}

export interface OrdersRow extends BaseTransactionRow {
  orderId?: Bytes32;
  marketId: Address;
  outcome: number;
  shareToken: Address;
  orderType: string;
  orderCreator: Address;
  orderState: OrderState;
  price: string;
  amount: string;
  fullPrecisionPrice: string;
  fullPrecisionAmount: string;
  tokensEscrowed: string;
  sharesEscrowed: string;
  tradeGroupId: Bytes32|null;
}

export interface UITrade {
  transactionHash: string;
  logIndex: number;
  type: string;
  price: string;
  amount: string;
  maker: boolean;
  marketCreatorFees: string;
  reporterFees: string;
  settlementFees: string;
  marketId: Address;
  outcome: number;
  shareToken: Address;
  timestamp: number;
  tradeGroupId: Bytes32|null;
}

export interface TradesRow extends BaseTransactionRow {
  orderId: Bytes32;
  marketId: Address;
  outcome: number;
  shareToken: Address;
  orderType: string;
  creator: Address;
  filler: Address;
  numCreatorTokens: string;
  numCreatorShares: string;
  numFillerTokens: string;
  numFillerShares: string;
  price: string;
  amount: string;
  marketCreatorFees: string;
  reporterFees: string;
  tradeGroupId: Bytes32|null;
}

export interface TimestampedPriceAmount {
  price: string|number;
  amount: string|number;
  timestamp: number;
}

export interface MarketPriceHistory {
  [outcome: number]: Array<TimestampedPriceAmount>;
}

export interface MarketsRowWithCreationTime extends MarketsRow {
  creationTime: number;
}

export interface JoinedReportsMarketsRow extends Payout {
  creationBlockNumber: number;
  creationTime: number;
  logIndex: number;
  transactionHash: Bytes32;
  blockHash: Bytes32;
  marketId: Address;
  universe: Address;
  feeWindow: Address;
  crowdsourcerId: Address;
  marketType: string;
  amountStaked: string|number;

}

export interface UIReport {
  creationBlockNumber: number;
  creationTime: number;
  logIndex: number;
  transactionHash: Bytes32;
  blockHash: Bytes32;
  marketId: Address;
  feeWindow: Address;
  payoutNumerators: Array<string|number|null>;
  amountStaked: string|number;
  crowdsourcerId: Address;
  isCategorical: boolean;
  isScalar: boolean;
  isInvalid: boolean;
  isSubmitted: boolean;
}

export interface FeeWindowRow {
    feeWindow: Address;
    feeWindowId: number;
    startBlockNumber: number;
    universe: Address;
    startTime: number;
    endBlockNumber: null|number;
    endTime: number;
    fees: number|string;
}

export interface InitialReportersRow {
  marketId: Address;
  reporter: Address;
  amountStaked: number;
  initialReporter: number;
  redeemed: boolean;
  isDesignatedReporter: boolean;
  repBalance: number;
}

export interface UnclaimedFeeWindowsRow {
  feeWindow: Address;
  startTime: number;
  endTime: number;
  balance: number;
  participationTokenStake: number;
  feeTokenStake: number;
  totalFees: number;
}

export interface UnclaimedFeeWindowInfo {
  startTime: number;
  endTime: number;
  balance: number;
  expectedFees: number;
}

export interface UnclaimedFeeWindows {
  [feeWindow: string]: UnclaimedFeeWindowInfo;
}

export interface UIInitialReporters {
  [initialReporter: string]: InitialReportersRow;
}
