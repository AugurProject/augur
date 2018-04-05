import { BigNumber } from "bignumber.js";
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
  _scalarDenomination?: string|null;
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

export interface MarketsRow<BigNumberType> {
  marketId: Address;
  universe: Address;
  marketType: string;
  numOutcomes: number;
  minPrice: BigNumberType;
  maxPrice: BigNumberType;
  marketCreator: Address;
  creationBlockNumber: number;
  creationFee: BigNumberType;
  reportingFeeRate: BigNumberType;
  marketCreatorFeeRate: BigNumberType;
  marketCreatorFeesCollected: BigNumberType|null;
  initialReportSize: BigNumberType|null;
  category: string;
  tag1: string|null;
  tag2: string|null;
  volume: BigNumberType;
  sharesOutstanding: BigNumberType;
  marketStateId: number;
  feeWindow: Address;
  endTime: number;
  finalizationTime?: number|null;
  reportingState?: ReportingState|null;
  shortDescription: string;
  longDescription?: string|null;
  scalarDenomination?: string|null;
  designatedReporter: Address;
  designatedReportStake: BigNumberType;
  resolutionSource?: string|null;
  numTicks: BigNumberType;
  consensusPayoutId?: number|null;
  isInvalid?: boolean|null;
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
  marketCreatorFeesCollected: BigNumberType|null;
  initialReportSize: BigNumberType|null;
  category: string;
  tags: Array<string|null>;
  volume: BigNumberType;
  outstandingShares: BigNumberType;
  feeWindow: Address;
  endTime: number;
  endDate: number;
  finalizationTime?: number|null;
  reportingState?: ReportingState|null;
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
  fullPrecisionPrice: BigNumberType;
  fullPrecisionAmount: BigNumberType;
  tokensEscrowed: BigNumberType;
  sharesEscrowed: BigNumberType;
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
  fullPrecisionPrice: BigNumberType;
  fullPrecisionAmount: BigNumberType;
  tokensEscrowed: BigNumberType;
  sharesEscrowed: BigNumberType;
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

export interface TimestampedPriceAmount<BigNumberType> {
  price: BigNumberType;
  amount: BigNumberType;
  timestamp: number;
}

export interface MarketPriceHistory<BigNumberType> {
  [outcome: number]: Array<TimestampedPriceAmount<BigNumberType>>;
}

export interface MarketsRowWithCreationTime extends MarketsRow<BigNumber> {
  creationTime: number;
}

export interface JoinedReportsMarketsRow<BigNumberType> extends Payout<BigNumberType> {
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
  amountStaked: BigNumberType;

}

export interface UIReport<BigNumberType> {
  creationBlockNumber: number;
  creationTime: number;
  logIndex: number;
  transactionHash: Bytes32;
  blockHash: Bytes32;
  marketId: Address;
  feeWindow: Address;
  payoutNumerators: Array<BigNumberType|null>;
  amountStaked: BigNumberType;
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

export interface InitialReportersRow<BigNumberType> {
  marketId: Address;
  reporter: Address;
  amountStaked: BigNumberType;
  initialReporter: number;
  redeemed: boolean;
  isDesignatedReporter: boolean;
  repBalance: BigNumberType;
}

export interface UnclaimedFeeWindowsRow<BigNumberType> {
  feeWindow: Address;
  startTime: number;
  endTime: number;
  balance: BigNumberType;
  participationTokenStake: BigNumberType;
  feeTokenStake: BigNumberType;
  totalFees: BigNumberType;
}

export interface UnclaimedFeeWindowInfo<BigNumberType> {
  startTime: number;
  endTime: number;
  balance: BigNumberType;
  expectedFees: BigNumberType;
}

export interface UnclaimedFeeWindows<BigNumberType> {
  [feeWindow: string]: UnclaimedFeeWindowInfo<BigNumberType>;
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

export interface UniverseInfoRow<BigNumberType> {
  universe: Address;
  parentUniverse: Address;
  balance: BigNumberType;
  supply: BigNumberType;
  numMarkets: BigNumberType;
}
