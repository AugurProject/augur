import { ReactNode, MouseEvent } from "react";
import { BUY, SELL, CATEGORY_PARAM_NAME, TAGS_PARAM_NAME } from "modules/common/constants";
import { MARKET_ID_PARAM_NAME, RETURN_PARAM_NAME } from "./routes/constants/param-names";
import { AnyAction } from "redux";
import { MarketInfo, MarketInfoOutcome, MarketOrderBook, OrderBook } from "@augurproject/sdk/build/state/getter/Markets";
import { EthersSigner } from "contract-dependencies-ethers/build/ContractDependenciesEthers";
import { MarketTradingHistory, Orders, Order } from "@augurproject/sdk/build/state/getter/Trading";

export enum SizeTypes {
  SMALL = "small",
  NORMAL = "normal",
  LARGE = "large",
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  href: string;
  action: any;
  status: string;
  seen: boolean;
  level: string;
}

export interface DateFormattedObject {
  value: Date;
  simpleDate: string;
  formatted: string;
  formattedShortDate: string;
  formattedShortTime: string;
  formattedShort: string;
  formattedLocal: string;
  formattedLocalShortDate: string;
  formattedLocalShort: string;
  formattedLocalShortTime: string;
  full: string;
  timestamp: number;
  utcLocalOffset: number;
  clockTimeLocal: string;
  formattedTimezone: string;
  formattedSimpleData: string;
  formattedUtcShortDate: string;
  clockTimeUtc: string;
  formattedUtc: string;
}

export interface ValueLabelPair {
  label: string;
  value: string;
}
export interface CoreStats {
  availableFunds: ValueLabelPair;
  frozenFunds: ValueLabelPair;
  totalFunds: ValueLabelPair;
  realizedPL: ValueLabelPair;
}
export interface MarketInfos {
  [marketId: string]: MarketInfo;
}
export interface Outcomes extends MarketInfoOutcome {
  name?: string;
}
export interface Consensus {
  payout: Array<string>;
  winningOutcome: string | null;
  outcomeName: string | null;
}

export interface OutcomeFormatted extends MarketInfoOutcome {
  marketId: string;
  lastPricePercent: FormattedNumber | null;
  lastPrice: FormattedNumber | null;
  isTradable: boolean;
  volumeFormatted: FormattedNumber;
}

export interface MarketData extends MarketInfo {
  marketStatus: string;
  minPriceBigNumber: BigNumber;
  maxPriceBigNumber: BigNumber;
  creationTimeFormatted: DateFormattedObject;
  endTimeFormatted: DateFormattedObject;
  reportingFeeRatePercent: FormattedNumber;
  marketCreatorFeeRatePercent: FormattedNumber;
  settlementFeePercent: FormattedNumber;
  openInterestFormatted: FormattedNumber;
  volumeFormatted: FormattedNumber;
  unclaimedCreatorFeesFormatted: FormattedNumber;
  marketCreatorFeesCollectedFormatted: FormattedNumber;
  finalizationTimeFormatted: DateFormattedObject | null;
  // TODO: add this to getter MarketInfo
  // disputeInfo: object; this needs to get filled in on getter
  consensusFormatted: Consensus | null;
  outcomesFormatted: OutcomeFormatted[];
};

export interface TransacitonStatus {
  [pendingId: string]: {
    status: string;
    transactionHash: string;
  };
}
export interface Universe {
  id: string;
  market?: MarketInfo;
  forkEndTime?: number;
  forkReputationGoal?: BigNumber;
  forkingMarket?: string;
  isForking?: boolean;
  outcomes?: any;
  isForkingMarketFinalized?: boolean;
  winningChildUniverseId?: string;
  winningChildUniverse?: string;
  openInterest?: BigNumber | string;
  forkThreshold?: BigNumber;
}

export interface Versions {
  augurui: string | null;
  augurjs: string | null;
}
export interface TransacitonData {
  [transactionId: string]: {
    hash: string;
    status: string;
  };
}
export interface UserReports {
  markets?: {
    [universeId: string]: string;
  };
}
export interface FormattedNumber {
  fullPrecision: number | string;
  roundedValue: number | BigNumber;
  roundedFormatted: string;
  formatted: string;
  formattedValue: number | string;
  denomination: string;
  minimized: string;
  value: number;
  rounded: number | string;
  full: number | string;
}

export interface FormattedNumberOptions {
  decimals?: number;
  decimalsRounded?: number;
  denomination?: string;
  roundUp?: boolean;
  roundDown?: boolean;
  positiveSign?: boolean;
  zeroStyled?: boolean;
  minimized?: boolean;
  blankZero?: boolean;
  bigUnitPostfix?: boolean;
}
export interface ReportingWindowStats {
  startTime?: string;
  endTime?: string;
  stake?: string;
  reportingFees: {
    unclaimedEth: FormattedNumber;
    unclaimedRep: FormattedNumber;
    unclaimedForkEth: FormattedNumber;
    unclaimedForkRepStaked: FormattedNumber;
    unclaimedParticipationTokenEthFees: FormattedNumber;
    participationTokenRepStaked: FormattedNumber;
    feeWindows: Array<string>;
    forkedMarket: string | null;
    nonforkedMarkets: Array<string>;
    gasCosts: string;
  };
}
export interface PendingQueue {
  [queueName: string]: {
    [pendingId: string]: {
      status: string;
    };
  };
}
export interface PendingOrders {
  [marketId: string]: Array<UIOrder>;
}

export interface OrderBooks {
  [marketId: string]: IndividualOrderBook;
}

export interface OutcomeOrderBook {
  bids: OrderBook[];
  asks: OrderBook[];
}
export interface IndividualOrderBook {
    [outcome: number]: {
      bids: OrderBook[];
      asks: OrderBook[];
    };
}
export interface DisputeInfo {
  disputeRound: number;
}

export interface MyPositionsSummary {
  currentValue: FormattedNumber;
  numCompleteSets?: FormattedNumber;
  totalPercent: FormattedNumber;
  totalReturns: FormattedNumber;
  valueChange: FormattedNumber;
}

export interface Notification {
  id: string;
  type: string;
  isImportant: boolean;
  isNew: boolean;
  title: string;
  buttonLabel: string;
  buttonAction: ButtonActionType;
  Template: ReactNode;
  market: MarketData;
  markets: Array<string>;
  claimReportingFees?: object;
  totalProceeds?: number;
}

export interface OrderStatus {
  orderId: string;
  status: string;
  marketId: string;
  outcome: any;
  orderTypeLabel: string;
}

export interface OrderCancellations {
  [orderId: string]: { status: string };
}

export interface UIOrder {
  id: string;
  outcome: string | number; // TODO: need to be consistent with outcome naming and type
  index: number;
  quantity: number;
  price: string;
  type: string;
  orderEstimate: string;
  outcomeName: string;
  cumulativeShares: number;
}

export interface LiquidityOrders {
  [marketId: string]: {
    [outcome: number]: Array<LiquidityOrder>;
  };
}

export interface LiquidityOrder {
  id?: string;
  outcome?: string | number; // TODO: need to be consistent with outcome naming and type
  index?: number;
  quantity: BigNumber;
  price: BigNumber;
  type: string;
  orderEstimate: BigNumber;
  outcomeName: string;
}
export interface NewMarketPropertiesValidations {
  description: string | null;
  category: string | null;
  tag1: string | null;
  tag2: string | null;
  type: string | null;
  designatedReporterType: string | null;
  designatedReporterAddress: string | null;
  expirySourceType: string | null;
  endTime: string | null;
  hour: string | null;
  minute: string | null;
  meridiem: string | null;
}

export interface NewMarketPropertyValidations {
  settlementFee: string | null;
}
export interface NewMarket {
  isValid: boolean;
  validations: Array<
    NewMarketPropertiesValidations | NewMarketPropertyValidations
  >;
  currentStep: number;
  type: string;
  outcomes: Array<string>;
  scalarSmallNum: string;
  scalarBigNum: string;
  scalarDenomination: string;
  description: string;
  expirySourceType: string;
  expirySource: string;
  designatedReporterType: string;
  designatedReporterAddress: string;
  minPrice: string;
  maxPrice: string;
  endTime: number;
  tickSize: string;
  hour: string;
  minute: string;
  meridiem: string;
  marketType: string;
  detailsText: string;
  category: string;
  tag1: string;
  tag2: string;
  settlementFee: number;
  affiliateFee: number;
  orderBook: {[outcome: number]: Array<LiquidityOrder> };
  orderBookSorted: {[outcome: number]: Array<LiquidityOrder> };
  initialLiquidityEth: any; // TODO: big number type
  initialLiquidityGas: any; // TODO: big number type
  creationError: string;
}
export interface Draft {
  uniqueId: number;
  created: number;
  updated: number;
  isValid: boolean;
  validations: Array<
    NewMarketPropertiesValidations | NewMarketPropertyValidations
  >;
  currentStep: number;
  type: string;
  outcomes: Array<string>;
  scalarSmallNum: string;
  scalarBigNum: string;
  scalarDenomination: string;
  description: string;
  expirySourceType: string;
  expirySource: string;
  designatedReporterType: string;
  designatedReporterAddress: string;
  minPrice: string;
  maxPrice: string;
  endTime: number;
  tickSize: string;
  hour: string;
  minute: string;
  meridiem: string;
  marketType: string;
  detailsText: string;
  category: string;
  tag1: string;
  tag2: string;
  settlementFee: number;
  affiliateFee: number;
  orderBook: {[outcome: number]: Array<LiquidityOrder> };
  orderBookSorted: {[outcome: number]: Array<LiquidityOrder> };
  initialLiquidityEth: any; // TODO: big number type
  initialLiquidityGas: any; // TODO: big number type
  creationError: string;
}

export interface FilledOrders {
  [account: string]: Orders;
}

export interface OpenOrders {
  [account: string]: Orders;
}

export interface MarketTradingHistoryState extends MarketTradingHistory {

}
export interface MarketsInReporting {
  designated?: Array<string>;
  open?: Array<string>;
  upcoming?: Array<string>;
  awaiting?: Array<string>;
  dispute?: Array<string>;
  resolved?: Array<string>;
}
export interface GasPriceInfo {
  average: number;
  fast: number;
  safeLow: number;
  userDefinedGasPrice: string;
  blockNumber: string;
}
export interface FilterSortOptions {
  marketFilter: string;
  marketSort: string;
  maxFee: string;
  transactionPeriod: string;
  hasOrders: boolean;
}
export interface Favorite {
  [marketId: string]: number;
}

export interface EthereumNodeOptions {
  blockRetention: number;
  connectionTimeout: number;
  http: string;
  pollingIntervalMilliseconds: number;
  ws: string;
}

export interface EnvObject {
  "ethereum-node": EthereumNodeOptions;
  universe?: string;
  useWeb3Transport: boolean;
}

export interface QueryEndpoints {
  ethereum_node_http?: string;
  ethereum_node_ws?: string;
  [MARKET_ID_PARAM_NAME]?: string;
  [RETURN_PARAM_NAME]?: string;
  [CATEGORY_PARAM_NAME]?: string;
  [TAGS_PARAM_NAME]?: string;
}
export interface Endpoints {
  ethereumNodeHTTP: string;
  ethereumNodeWS: string;
}

export interface Connection {
  isConnected: boolean;
  isReconnectionPaused: boolean;
}

export interface Category {
  categoryName: string;
  nonFinalizedOpenInterest: string;
  openInterest: string;
  tags: Array<string>;
}

export interface Blockchain {
  currentBlockNumber: number;
  currentAugurTimestamp: number;
  highestBlock: number;
  lastProcessedBlock: number;
}

export interface AppStatus {
  isMobile?: boolean;
  isMobileSmall?: boolean;
}

export interface AuthStatus {
  isLogged?: boolean;
  edgeLoading?: boolean;
  edgeContext?: string;
  isConnectionTrayOpen?: boolean;
}

export interface PositionsTotal {
  frozenFunds: string;
  realized: string;
  realizedCost: string;
  realizedPercent: string;
  total: string;
  totalCost: string;
  totalPercent: string;
  unrealized: string;
  unrealizedCost: string;
  unrealizedPercent: string;
  unrealizedRevenue: string;
  unrealizedRevenue24hAgo: string;
  unrealizedRevenue24hChangePercent: string;
}

export interface MarketPositionsTotal extends PositionsTotal {
  marketId: string;
}
export interface PositionData extends PositionsTotal {
  averagePrice: string;
  frozenFunds: string;
  lastTradePrice: string;
  lastTradePrice24hAgo: string;
  lastTradePrice24hChangePercent: string;
  marketId: string;
  netPosition: string;
  outcome: number;
  outcomeId: string;
  position: string;
  timestamp: number;
}

export interface TradingPositionsPerMarket {
  [marketId: string]: PositionsTotal;
}

export interface AccountPositionAction {
  marketId: string;
  positionData: AccountPosition;
}

export interface AccountPosition {
  [market: string]: {
    tradingPositionsPerMarket?: MarketPositionsTotal;
    tradingPositions: {
      [outcomeId: number]: PositionData;
    };
  };
}

export interface UnrealizedRevenue {
  unrealizedRevenue24hChangePercent: string;
}

// TODO: to be provided by SDK the comes from user stats
export interface TimeframeData {
  positions: number;
  numberOfTrades: number;
  marketsTraded: number;
  marketsCreated: number;
  successfulDisputes: number;
  redeemedPositions: number;
}
export interface LoginAccount {
  address?: string;
  displayAddress?: string;
  meta?: { accountType: string; address: string; signer: any | EthersSigner, isWeb3: boolean };
  totalFrozenFunds?: string;
  tradingPositionsTotal?: UnrealizedRevenue;
  timeframeData?: TimeframeData;
  allowanceFormatted?: FormattedNumber;
  allowance?: BigNumber;
  eth?: string;
  rep?: string;
  dai?: string;
}

export interface Web3 {
  currentProvider: any;
}

export interface WindowApp extends Window {
  app: object;
  web3: Web3;
  localStorage: Storage;
  integrationHelpers: any;
}

type ButtonActionType = (
  event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
) => void;

export type NodeStyleCallback = (err: Error | string | null, result?: any) => void;

export type DataCallback = (result?: any) => void;

export interface BaseAction extends AnyAction {
  type: string;
  data?: any;
}

export interface EthereumWallet {
  appId: string;
  appIds: string[];
  archived: boolean;
  deleted: boolean;
  sortIndex: number;
  id: string;
  type: string;
  keys: { ethereumAddress: string };
}

export interface EdgeUiAccount {
  signEthereumTransaction: Function;
  getFirstWalletInfo: Function;
  createCurrencyWallet: Function;
  username: string;
}

export interface WalletObject {
  address: string;
  balance: string;
  derivationPath: Array<number>;
  serializedPath: string;
}

export interface Trade {
  numShares: FormattedNumber;
  limitPrice: FormattedNumber;
  potentialEthProfit: FormattedNumber;
  potentialEthLoss: FormattedNumber;
  totalCost: FormattedNumber;
  sharesFilled: FormattedNumber;
  shareCost: FormattedNumber;
  side: typeof BUY | typeof SELL;
  orderShareProfit: FormattedNumber;
  orderShareTradingFee: FormattedNumber;
}
