import { ReactNode, MouseEvent } from 'react';
import {
  BUY,
  SELL,
  CATEGORY_PARAM_NAME,
  TAGS_PARAM_NAME,
  INVALID_SHOW,
  INVALID_HIDE,
} from 'modules/common/constants';
import {
  MARKET_ID_PARAM_NAME,
  RETURN_PARAM_NAME,
} from './routes/constants/param-names';
import { AnyAction } from 'redux';
import { EthersSigner } from 'contract-dependencies-ethers/build/ContractDependenciesEthers';
import { Getters } from '@augurproject/sdk';
import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';
import { BigNumber } from 'utils/create-big-number';

export enum SizeTypes {
  SMALL = 'small',
  NORMAL = 'normal',
  LARGE = 'large',
}

export interface Alert {
  id: string;
  title: string;
  name: string;
  description: string;
  timestamp: number;
  href: string;
  action: any;
  status: string;
  seen: boolean;
  level: string;
  params: object;
}

export interface DateFormattedObject {
  value: Date;
  formatted: string;
  formattedShortDate: string;
  formattedShortTime: string;
  formattedShort: string;
  formattedLocalShort: string;
  formattedLocalShortTime: string;
  formattedLocalShortDateSecondary: string;
  timestamp: number;
  utcLocalOffset: number;
  clockTimeLocal: string;
  formattedTimezone: string;
  formattedShortTimezone: string;
  formattedSimpleData: string;
  formattedUtcShortDate: string;
  clockTimeUtc: string;
  formattedUtc: string;
  formattedShortUtc: string;
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
  [marketId: string]: Getters.Markets.MarketInfo;
}
export interface Outcomes extends Getters.Markets.MarketInfoOutcome {
  name?: string;
}
export interface Consensus {
  payout: string[];
  winningOutcome: string | null;
  outcomeName: string | null;
}

export interface OutcomeFormatted extends Getters.Markets.MarketInfoOutcome {
  marketId: string;
  lastPricePercent: FormattedNumber | null;
  lastPrice: FormattedNumber | null;
  volumeFormatted: FormattedNumber;
  isTradeable: boolean;
}

export interface MarketData extends Getters.Markets.MarketInfo {
  marketId: string;
  marketStatus: string;
  defaultSelectedOutcomeId: number;
  minPriceBigNumber: BigNumber;
  maxPriceBigNumber: BigNumber;
  noShowBondAmountFormatted: FormattedNumber;
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
  // TODO: add this to getter Getters.Markets.MarketInfo
  // disputeInfo: object; this needs to get filled in on getter
  consensusFormatted: Consensus | null;
  outcomesFormatted: OutcomeFormatted[];
}

export interface Universe {
  id: string;
  market?: Getters.Markets.MarketInfo;
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
  disputeWindow: Getters.Universe.DisputeWindow;
}

export interface Versions {
  augurui: string | null;
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

export interface CreateMarketData {
  id?: string;
  txParams: TransactionMetadataParams;
  endTime: DateFormattedObject;
  description: string;
  hash: string;
  pending: boolean;
  recentlyTraded: DateFormattedObject;
  creationTime: DateFormattedObject;
  marketType: string;
  pendingId: string;
  orderBook?: Getters.Markets.OutcomeOrderBook;
}

export interface PendingQueue {
  [queueName: string]: {
    [pendingId: string]: {
      status: string;
      blockNumber: number;
      parameters?: UIOrder | NewMarket;
      data: CreateMarketData;
    };
  };
}
export interface PendingOrders {
  [marketId: string]: UIOrder[];
}

export interface OrderBooks {
  [marketId: string]: Getters.Markets.OutcomeOrderBook;
}

export interface OutcomeOrderBook {
  spread: string | BigNumber | null;
  bids: Getters.Markets.MarketOrderBookOrder[];
  asks: Getters.Markets.MarketOrderBookOrder[];
}

export interface MyPositionsSummary {
  currentValue: FormattedNumber;
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
  markets: string[];
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
  outcomeName: string;
  outcomeId: number;
  marketId: string;
  amount: string;
  price: string;
  fullPrecisionAmount: string;
  fullPrecisionPrice: string;
  type: string;
  orderEstimate?: string;
  cumulativeShares?: number;
  status?: string;
  hash?: string;
  numTicks: number;
  minPrice: string;
}

export interface LiquidityOrders {
  [txParamHash: string]: {
    [outcome: number]: LiquidityOrder[];
  };
}

export interface LiquidityOrder {
  id?: string;
  outcome?: string; // TODO: need to be consistent with outcome naming and type
  index?: number;
  quantity: BigNumber;
  price: BigNumber;
  type: string;
  orderEstimate: BigNumber;
  outcomeName: string;
  outcomeId: number;
  status?: string;
  hash?: string;
  mySize?: string;
  cumulativeShares?: string;
  shares: string;
}
export interface NewMarketPropertiesValidations {
  description?: string;
  categories?: string[];
  type?: string;
  designatedReporterType?: string;
  designatedReporterAddress?: string;
  expirySourceType?: string;
  setEndTime?: string;
  hour?: string;
  minute?: string;
  meridiem?: string;
  outcomes?: string[];
  settlementFee?: string;
  affiliateFee?: number;
}

export interface NewMarketPropertyValidations {
  settlementFee?: string;
  scalarDenomination?: string;
  affiliateFee?: number;
}
export interface NewMarket {
  isValid: boolean;
  validations:
    NewMarketPropertiesValidations[] | NewMarketPropertyValidations[];
  backupSource: string;
  currentStep: number;
  type: string;
  outcomes: string[];
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
  endTimeFormatted: DateFormattedObject;
  setEndTime: number;
  tickSize: number;
  numTicks: number;
  hour: string;
  minute: string;
  meridiem: string;
  marketType: string;
  detailsText: string;
  categories: string[];
  settlementFee: number;
  affiliateFee: number;
  orderBook: { [outcome: number]: LiquidityOrder[] };
  orderBookSorted: { [outcome: number]: LiquidityOrder[] };
  minPriceBigNumber: BigNumber;
  maxPriceBigNumber: BigNumber;
  initialLiquidityDai: BigNumber;
  initialLiquidityGas: BigNumber;
  creationError: string;
  offsetName: string;
  offset: number;
  timezone: string;
}
export interface Draft {
  uniqueId: number;
  created: number;
  updated: number;
  isValid: boolean;
  validations:
    NewMarketPropertiesValidations[] | NewMarketPropertyValidations[]
  currentStep: number;
  type: string;
  outcomes: string[];
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
  categories: string[];
  settlementFee: number;
  affiliateFee: number;
  orderBook: { [outcome: number]: LiquidityOrder[] };
  orderBookSorted: { [outcome: number]: LiquidityOrder[] };
  initialLiquidityDai: any; // TODO: big number type
  initialLiquidityGas: any; // TODO: big number type
  creationError: string;
}

export interface Drafts {
  [uniqueId: string]: Draft;
}

export interface MarketsList {
  isSearching: boolean;
  meta: {
    filteredOutCount: number;
    marketCount: number;
    categories: object;
  };
  selectedCategories: string[];
  marketCardFormat: string;
}

export interface LoadReportingMarketsOptions {
  limit: number;
  offset: number;
  userPortfolioAddress?: string;
  sortByRepAmount?: boolean;
  sortByDisputeRounds?: boolean;
  search?: string;
  reportingStates?: string[];
}

export interface ReportingListState {
  [reportingState: string]: {
    marketIds: string[];
    params: Partial<LoadReportingMarketsOptions>;
  };
}
export interface FilledOrders {
  [account: string]: Getters.Trading.Orders;
}

export interface OpenOrders {
  [account: string]: Getters.Trading.Orders;
}

export interface GasPriceInfo {
  average: number;
  fast: number;
  safeLow: number;
  userDefinedGasPrice: string;
  blockNumber: string;
}

export enum INVALID_OPTIONS {
  Show = 'show',
  Hide = 'hide',
}

export interface FilterSortOptions {
  marketFilter: string;
  marketSort: string;
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: INVALID_OPTIONS;
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
  'ethereum-node': EthereumNodeOptions;
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
  lastSyncedBlockNumber: number;
  blocksBehindCurrent: number;
  percentSynced: string;
  currentAugurTimestamp: number;
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

export interface AccountPositionAction {
  marketId: string;
  positionData: AccountPosition;
}

export interface AccountPosition {
  [market: string]: {
    tradingPositionsPerMarket?: Getters.Users.MarketTradingPosition;
    tradingPositions: {
      [outcomeId: number]: Getters.Users.TradingPosition;
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
export interface AccountBalances {
  eth: number;
  rep: number;
  dai: number;
}
export interface LoginAccount {
  address?: string;
  mixedCaseAddress?: string;
  meta?: {
    accountType: string;
    address: string;
    signer: any | EthersSigner;
    isWeb3: boolean;
  };
  totalFrozenFunds?: string;
  tradingPositionsTotal?: UnrealizedRevenue;
  timeframeData?: TimeframeData;
  allowanceFormatted?: FormattedNumber;
  allowance?: BigNumber;
  balances: AccountBalances;
  reporting: Getters.Accounts.AccountReportingHistory;
}

export interface Web3 {
  currentProvider: any;
}

export interface WindowApp extends Window {
  app: object;
  web3: Web3;
  ethereum: object;
  localStorage: Storage;
  integrationHelpers: any;
}

export type ButtonActionType = (
  event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
) => void;

export type NodeStyleCallback = (
  err: Error | string | null,
  result?: any
) => void;

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
  potentialDaiProfit: FormattedNumber;
  potentialDaiLoss: FormattedNumber;
  totalCost: FormattedNumber;
  sharesFilled: FormattedNumber;
  shareCost: FormattedNumber;
  side: typeof BUY | typeof SELL;
  orderShareProfit: FormattedNumber;
  orderShareTradingFee: FormattedNumber;
}

export interface PriceTimeSeriesData {
  tokenVolume: number;
  period: number;
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
  shareVolume: number;
}

export interface MarketClaimablePositions {
  markets: MarketData[];
  totals: {
    totalUnclaimedProfit: BigNumber,
    totalUnclaimedProceeds: BigNumber
  }
  positions: {
    [marketId: string]: {
      unclaimedProfit: string;
      unclaimedProceeds: string;
    };
  };
}

export interface ClaimReportingOptions {
  reportingParticipants: string[],
  disputeWindows: string[],
  estimateGas: boolean;
}

export interface MarketReportContracts {
  marketId: string;
  contracts: string[];
  totalAmount: BigNumber;
  marketObject: MarketData;
}

export interface marketsReportingCollection {
  unclaimedRep: BigNumber;
  marketContracts: MarketReportContracts[];
}

export interface MarketReportClaimableContracts {
  claimableMarkets: marketsReportingCollection;
  participationContracts: {
    contracts: string[];
    unclaimedDai: BigNumber;
    unclaimedRep: BigNumber;
  };
  totalUnclaimedDai: BigNumber;
  totalUnclaimedRep: BigNumber;
  totalUnclaimedDaiFormatted: FormattedNumber;
  totalUnclaimedRepFormatted: FormattedNumber;
}
