import { TransactionMetadata } from '@augurproject/contract-dependencies-ethers';
import { BigNumber } from 'bignumber.js';
import { Order } from './onChainTrading';

export {
  ZERO,
  ONE,
  QUINTILLION,
} from '@augurproject/utils';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MALFORMED_OUTCOME = 'malformed outcome';

export const ETHER = new BigNumber(10).pow(18);

export const SECONDS_IN_AN_HOUR = new BigNumber(3600, 10);

export const SECONDS_IN_A_DAY = new BigNumber(86400, 10);

export const SECONDS_IN_A_YEAR = new BigNumber(SECONDS_IN_A_DAY).multipliedBy(
  365
);

export const INIT_REPORTING_FEE_DIVISOR = '10000';

export enum GetMarketsSortBy {
  marketOI = 'marketOI',
  liquidity = 'liquidity',
  volume = 'volume',
  timestamp = 'timestamp',
  endTime = 'endTime',
  lastTradedTimestamp = 'lastTradedTimestamp',
  disputeRound = 'disputeRound',
  totalRepStakedInMarket = 'totalRepStakedInMarket',
  numberOfTrades = 'numberOfTrades',
}

export enum MarketReportingStateByNum {
  'PreReporting',
  'DesignatedReporting',
  'OpenReporting',
  'CrowdsourcingDispute',
  'AwaitingNextWindow',
  'AwaitingFinalization',
  'Finalized',
  'Forking',
  'AwaitingForkMigration',
}

export enum MarketReportingState {
  // This only applies to hot loaded markets.
  Unknown = 'Unknown',
  PreReporting = 'PreReporting',
  DesignatedReporting = 'DesignatedReporting',
  OpenReporting = 'OpenReporting',
  CrowdsourcingDispute = 'CrowdsourcingDispute',
  AwaitingNextWindow = 'AwaitingNextWindow',
  AwaitingFinalization = 'AwaitingFinalization',
  Finalized = 'Finalized',
  Forking = 'Forking',
  AwaitingForkMigration = 'AwaitingForkMigration',
}

export enum MarketType {
  YesNo = 0,
  Categorical = 1,
  Scalar = 2,
}

export enum MarketTypeName {
  YesNo = 'YesNo',
  Categorical = 'Categorical',
  Scalar = 'Scalar',
}

export enum CommonOutcomes {
  Malformed = 'malformed outcome',
  Invalid = 'Invalid',
}

export enum YesNoOutcomes {
  No = 'No',
  Yes = 'Yes',
}

export const defaultReportingFeeDivisor = new BigNumber(10000);

export enum OrderEventType {
  Create = 0,
  Cancel = 1,
  Fill = 2,
  Expire = 3,
}

export enum SubscriptionEventName {
  BulkSyncComplete = 'BulkSyncComplete',
  CompleteSetsPurchased = 'CompleteSetsPurchased',
  CompleteSetsSold = 'CompleteSetsSold',
  DisputeCrowdsourcerCompleted = 'DisputeCrowdsourcerCompleted',
  DisputeCrowdsourcerContribution = 'DisputeCrowdsourcerContribution',
  DisputeCrowdsourcerCreated = 'DisputeCrowdsourcerCreated',
  DisputeCrowdsourcerRedeemed = 'DisputeCrowdsourcerRedeemed',
  DisputeWindowCreated = 'DisputeWindowCreated',
  InitialReportSubmitted = 'InitialReportSubmitted',
  InitialReporterRedeemed = 'InitialReporterRedeemed',
  InitialReporterTransferred = 'InitialReporterTransferred',
  MarketCreated = 'MarketCreated',
  MarketFinalized = 'MarketFinalized',
  MarketMigrated = 'MarketMigrated',
  MarketParticipantsDisavowed = 'MarketParticipantsDisavowed',
  MarketTransferred = 'MarketTransferred',
  MarketVolumeChanged = 'MarketVolumeChanged',
  MarketOIChanged = 'MarketOIChanged',
  NewBlock = 'NewBlock',
  OrderEvent = 'OrderEvent',
  BulkOrderEvent = 'BulkOrderEvent',
  ParticipationTokensRedeemed = 'ParticipationTokensRedeemed',
  ProfitLossChanged = 'ProfitLossChanged',
  ReportingParticipantDisavowed = 'ReportingParticipantDisavowed',
  SDKReady = 'SDKReady',
  OrderBooksSynced = 'OrderBooksSynced',
  TimestampSet = 'TimestampSet',
  TokenBalanceChanged = 'TokenBalanceChanged',
  TokensBurned = 'TokensBurned',
  TokensMinted = 'TokensMinted',
  TokensTransferred = 'TokensTransferred',
  ReportingFeeChanged = 'ReportingFeeChanged',
  TradingProceedsClaimed = 'TradingProceedsClaimed',
  UniverseCreated = 'UniverseCreated',
  UniverseForked = 'UniverseForked',
  UserDataSynced = 'UserDataSynced',
  MarketsUpdated = 'updated:Markets',
  DBMarketCreatedEvent = 'DerivedDB:updated:Markets',
  ReportingStateChanged = 'ReportingStateChanged',
  ZeroXStatusStarting = 'ZeroX:Status:Starting',
  ZeroXStatusReady = 'ZeroX:Status:Ready',
  ZeroXStatusSynced = 'ZeroX:Status:Synced',
  ZeroXStatusStarted = 'ZeroX:Status:Started',
  ZeroXStatusRestarting = 'ZeroX:Status:Restarting',
  ZeroXStatusError = 'ZeroX:Status:Error',
  ZeroXMeshOrderEvent = 'ZeroX:Mesh:OrderEvent',
  ZeroXRPCOrderEvent = 'ZeroX:Rpc:OrderEvent',
  WarpSyncHashUpdated = 'WarpSyncHashUpdated',
  LiquidityPoolUpdated = 'LiquidityPoolUpdated',
  DBUpdatedZeroXOrders = 'DB:updated:ZeroXOrders',
  MarketInvalidBids = 'MarketInvalidBids',
}

export const NETWORK_IDS = {
  Mainnet: '1',
  Ropsten: '3',
  Rinkeby: '4',
  Kovan: '42',
  Private1: '101',
  Private2: '102',
  Private3: '103',
  Private4: '104',
};

export enum TXEventName {
  AwaitingSigning = 'AwaitingSigning',
  Pending = 'Pending',
  Success = 'Success',
  Failure = 'Failure',
  RelayerDown = 'RelayerDown',
  FeeTooLow = 'FeeTooLow',
}

export function isSubscriptionEventName(eventName: string): string | null {
  let retVal = -1;

  Object.values(SubscriptionEventName).every(
    (value: any, index: number): boolean => {
      if (value === eventName) {
        retVal = index;
        return false;
      }
      return true;
    }
  );

  if (retVal !== -1) {
    return eventName;
  }

  return null;
}

export const MAX_FILLS_PER_TX = new BigNumber('4', 10);
export const MAX_GAS_LIMIT_FOR_TRADE = new BigNumber('4500000', 10);
export const PLACE_ORDER_NO_SHARES = {
  2: new BigNumber('547694', 10),
  3: new BigNumber('562138', 10),
  4: new BigNumber('576582', 10),
  5: new BigNumber('591026', 10),
  6: new BigNumber('605470', 10),
  7: new BigNumber('619914', 10),
  8: new BigNumber('634358', 10),
};
export const PLACE_ORDER_WITH_SHARES = {
  2: new BigNumber('695034', 10),
  3: new BigNumber('794664', 10),
  4: new BigNumber('894294', 10),
  5: new BigNumber('993924', 10),
  6: new BigNumber('1093554', 10),
  7: new BigNumber('1193184', 10),
  8: new BigNumber('1292814', 10),
};
export const WORST_CASE_FILL = {
  2: new BigNumber('922754', 10),
  3: new BigNumber('984220', 10),
  4: new BigNumber('1045693', 10),
  5: new BigNumber('1107159', 10),
  6: new BigNumber('1168632', 10),
  7: new BigNumber('1230111', 10),
  8: new BigNumber('1230111', 10),
};
export const NORMAL_FILL = {
  2: new BigNumber('668530', 10),
  3: new BigNumber('699996', 10),
  4: new BigNumber('731457', 10),
  5: new BigNumber('762935', 10),
  6: new BigNumber('794396', 10),
  7: new BigNumber('825887', 10),
  8: new BigNumber('825887', 10),
};
export const CLAIM_GAS_COST = new BigNumber(794379);
export const ORDER_TYPES = {
  BID: new BigNumber(0),
  ASK: new BigNumber(1),
};
export const INVALID_OUTCOME = 0;
export const MAX_TRADE_GAS_PERCENTAGE_DIVISOR = 100;
export const DEFAULT_GAS_PRICE_IN_GWEI = 4;

export const EULERS_NUMBER = 2.71828182845905;
export const MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI = new BigNumber(
  10
).multipliedBy(10 ** 18); // $10 minimum profit on selling Invalid for the filter to trigger
export const GENESIS = 'Genesis';
export const orderTypes = ['0x00', '0x01'];

export enum TemplateFilters {
  all = 'all',
  templateOnly = 'templateOnly',
  customOnly = 'customOnly',
  sportsBook = 'sportsBook'
}

// Valid market liquidity spreads
export enum MaxLiquiditySpread {
  OneHundredPercent = '100', // all liquidity spreads
  TwentyPercent = '20',
  FifteenPercent = '15',
  TenPercent = '10',
  ZeroPercent = '0', // only markets with depleted liquidity
}

export interface TXStatus {
  transaction: TransactionMetadata;
  eventName: TXEventName;
  hash?: string;
  reason?: string;
}

export interface OrderTypeOrders {
  [orderType: string]: {
    [orderId: string]: ZeroXOrder;
  }
}

export interface OutcomeOrders {
  [outcome: number]: OrderTypeOrders;
};

export interface ZeroXOrder extends Order {
  expirationTimeSeconds: number;
  makerAssetAmount: string;
  takerAssetAmount: string;
  salt: string;
  makerAssetData: string;
  takerAssetData: string;
  signature: string;
  makerFeeAssetData: string;
  takerFeeAssetData: string;
  feeRecipientAddress: string;
  takerAddress: string;
  makerAddress: string;
  senderAddress: string;
  makerFee: string;
  takerFee: string;
}

export interface ZeroXOrders {
  [marketId: string]: OutcomeOrders;
}

export const NullWarpSyncHash = 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';
