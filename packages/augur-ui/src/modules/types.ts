import { ReactNode, MouseEvent } from "react";
import { BUY, SELL } from "modules/common-elements/constants";

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
export interface MarketsData {
  [marketId: string]: MarketData;
}
export interface Outcomes {
  id: string;
  description?: string;
  name?: string;
}
export interface MarketData {
  id: string;
  description: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  numTicks: number;
  marketType: string;
  outcomes: Array<Outcomes>;
  scalarDenomination: string;
  // TODO: this should come from SDK types
}
export interface OutcomesData {
  [marketId: string]: {
    [outcomeId: string]: MarketData;
  };
}
export interface TransacitonStatus {
  [pendingId: string]: {
    status: string;
    transactionHash: string;
  };
}
export interface Universe {
  id: string;
  forkEndTime: number;
  forkReputationGoal: string;
  forkingMarket: string;
  isForking: boolean;
  winningChildUniverse: string;
  openInterest: string;
  forkThreshold: string;
}
export interface AccountShareBalances {
  [marketId: string]: Array<string>;
}
export interface Versions {
  augurui: string | null;
  augurjs: string | null;
  augurNode: string | null;
}
export interface TransacitonData {
  [transactionId: string]: {
    hash: string;
    status: string;
  };
}
export interface UserReports {
  markets: {
    [universeId: string]: string;
  };
}
export interface FormattedNumber {
  fullPrecision: number | string;
  roundedValue: number;
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
    decimals: number;
    decimalsRounded: number;
    denomination: string;
    roundUp: boolean;
    roundDown: boolean;
    positiveSign: boolean;
    zeroStyled: boolean;
    minimized: boolean;
    blankZero: boolean;
    bigUnitPostfix: boolean;
}
export interface ReportingWindowStats {
  startTime: string | null;
  endTime: string | null;
  stake: string | null;
  reportingFees: {
    unclaimedEth: FormattedNumber;
    unclaimedRep: FormattedNumber;
    unclaimedForkEth: FormattedNumber;
    unclaimedForkRepStaked: FormattedNumber;
    feeWindows: Array<string>;
    forkedMarket: string | null;
    nonforkedMarkets: Array<string>;
    feeWindowEthFees: string;
    feeWindowRepStaked: string;
  };
}
export interface PendingQueue {
  [pendingId: string]: {
    [QueueName: string]: {
      status: string;
    };
  };
}
export interface PendingOrders {
  [marketId: string]: Array<Order>;
}

export interface OrderBook {
  marketId: string | undefined;
  [outcome: number]: {
    [BUY]: {
      [id: string]: Order;
    };
    [SELL]: {
      [id: string]: Order;
    };
  };
}
export interface OrderBooks {
  [marketId: string]: OrderBook;
}

export interface DisputeInfo {
  disputeRound: number;
}

export interface MyPositionsSummary {
  currentValue: any;
  numCompleteSets: any;
  totalPercent: any;
  totalReturns: any;
}

export interface Market {
  id: string;
  description: string;
  reportingState: string;
  endTime: number;
  marketStatus: string;
  disputeInfo?: DisputeInfo;
  myPositionsSummary?: MyPositionsSummary;
  outstandingReturns?: string;
  finalizationTimeWithHold?: number;
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
  market: Market | null;
  markets: Array<string>;
  claimReportingFees?: object;
  totalProceeds?: number;
}

export interface OrderStatus {
  orderId: string;
  status: string;
}
export interface Order {
  id: string;
  outcome: string | number; // TODO: need to be consistent with outcome naming and type
  index: number;
  quantity: number;
  price: string;
  type: string;
  orderEstimate: string;
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
  outcomes: Array<string | number>;
  scalarSmallNum: string;
  scalarBigNum: string;
  scalarDenomination: string;
  description: string;
  expirySourceType: string;
  expirySource: string;
  designatedReporterType: string;
  designatedReporterAddress: string;
  endTime: any;
  tickSize: string;
  hour: string;
  minute: string;
  meridiem: string;
  detailsText: string;
  category: string;
  tag1: string;
  tag2: string;
  settlementFee: string;
  orderBook: OrderBook;
  orderBookSorted: OrderBook;
  orderBookSeries: OrderBook;
  initialLiquidityEth: any; // TODO: big number type
  initialLiquidityGas: any; // TODO: big number type
  creationError: string;
}

export interface FilledOrder {
  creator: string;
  orderId: string;
  outcome: string;
  amount: string;
  price: string;
  type: string;
  timestamp: number;
  transactionHash: string;
  marketId: string;
  logIndex: number;
}

export interface TradingHistory {
  trades: Array<FilledOrder>;
}

export interface MarketTradingHistory {
  [marketId: string]: TradingHistory;
}
export interface MarketsInReporting {
  designated: Array<string>;
  open: Array<string>;
  upcoming: Array<string>;
  awaiting: Array<string>;
  dispute: Array<string>;
  resolved: Array<string>;
}
export interface GasPriceInfo {
  average: number;
  fast: number;
  safeLow: number;
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
  http: string | null;
  pollingIntervalMilliseconds: number;
  ws: string | null;
}

export interface EnvObject {
  "augur-node": string;
  "ethereum-node": EthereumNodeOptions;
  universe: string | null;
  useWeb3Transport: boolean;
}

export interface QueryEndpoints {
  ethereum_node_http?: string;
  augur_node?: string;
  ethereum_node_ws?: string;
}
export interface Endpoints {
  ethereumNodeHTTP: string;
  augurNode: string;
  ethereumNodeWS: string;
}

export interface Connection {
  isConnected: boolean;
  isConnectedToAugurNode: boolean;
  augurNodeNetworkId: string;
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
  isLogged: boolean | undefined;
  edgeLoading: boolean | undefined;
  edgeContext: string | undefined;
  isConnectionTrayOpen: boolean | undefined;
}

export interface PositionData {
  marketId: string;
  netPosition: string;
  outcome: string;
  position: string;
  averagePrice: string;
  realized: string;
  timestamp: number;
  total: string;
  unrealized: string;
  cost: string;
  unrealizedCost: string;
  unrealizedRevenue: string;
  totalPercent: string;
  unrealizedPercent: string;
  realizedPercent: string;
  unrealizedRevenue24hChangePercent: string;
}

export interface AccountPosition {
  marketId: string | null;
  positionData: PositionData;
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
  meta?: { accountType: string; address: string; signer: object | null };
  totalFrozenFunds?: string;
  tradingPositionsTotal?: UnrealizedRevenue;
  timeframeData?: TimeframeData;
  allowance?: string;
  eth?: string;
  rep?: string;
  dai?: string;
}

export interface WindowApp extends Window {
  app: object;
}

type ButtonActionType = (
  event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
) => void;

export interface BaseAction {
  type: string;
  data: any | undefined;
}
