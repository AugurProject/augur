import { ReactNode, MouseEvent } from 'react';
import {
  BUY,
  SELL,
  CATEGORY_PARAM_NAME,
  TAGS_PARAM_NAME,
} from 'modules/common/constants';
import {
  MARKET_ID_PARAM_NAME,
  RETURN_PARAM_NAME,
  OUTCOME_ID_PARAM_NAME,
  CREATE_MARKET_FORM_PARAM_NAME,
} from './routes/constants/param-names';
import { AnyAction } from 'redux';
import type { Getters, PayoutNumeratorValue } from '@augurproject/sdk';
import type { TransactionMetadataParams, EthersSigner } from '@augurproject/contract-dependencies-ethers';
import type { BigNumber } from 'utils/create-big-number';
import type { Template } from '@augurproject/templates';
import { JsonRpcProvider } from "ethers/providers";

export enum SizeTypes {
  SMALL = 'small',
  NORMAL = 'normal',
  LARGE = 'large',
}

export interface TextLink {
  text: string;
  link?: string;
  linkText?: string;
  lighten?: boolean;
}

export interface TextObject {
  title: string;
  subheader: TextLink[];
}

export interface Alert {
  id: string;
  uniqueId: string;
  toast: boolean;
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

export interface TimezoneDateObject {
  formattedUtc: string;
  formattedLocalShortDateTimeWithTimezone: string;
  timestamp: number;
}

export interface DateFormattedObject {
  value: Date;
  formattedUtcShortTime: string;
  formattedShortTime: string;
  formattedLocalShortDate: string;
  formattedLocalShortWithUtcOffset: string;
  formattedLocalShortDateSecondary: string;
  timestamp: number;
  utcLocalOffset: number;
  clockTimeLocal: string;
  formattedLocalShortDateTimeWithTimezone: string;
  formattedLocalShortDateTimeNoTimezone: string;
  formattedSimpleData: string;
  formattedUtcShortDate: string;
  clockTimeUtc: string;
  formattedUtc: string;
  formattedShortUtc: string;
}

export interface ValueLabelPair {
  label: string;
  value: string | FormattedNumber;
  useFull?: boolean;
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
export interface ConsensusFormatted extends PayoutNumeratorValue {
  winningOutcome: string | null;
  outcomeName: string | null;
}

export interface OutcomeFormatted extends Getters.Markets.MarketInfoOutcome {
  marketId: string;
  description: string;
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
  isArchived: boolean;
  // TODO: add this to getter Getters.Markets.MarketInfo
  // disputeInfo: object; this needs to get filled in on getter
  consensusFormatted: ConsensusFormatted | null;
  outcomesFormatted: OutcomeFormatted[];
  isTemplate: boolean;
  pending?: boolean;
  status?: string;
  hasPendingLiquidityOrders?: boolean;
}

export interface ForkingInfo {
  forkEndTime: number;
  forkAttoReputationGoal: BigNumber;
  forkingMarket: string;
  forkAttoThreshold: BigNumber;
  isForkingMarketFinalized: boolean;
  winningChildUniverseId?: string;
}
export interface Universe extends Getters.Universe.UniverseDetails {
  disputeWindow: Getters.Universe.DisputeWindow;
  forkingInfo?: ForkingInfo;
  forkEndTime?: string;
  timeframeData?: Getters.Platform.PlatformActivityStatsResult;
  maxMarketEndTime?: number;
}

export interface UserReports {
  markets?: {
    [universeId: string]: string;
  };
}
export interface FormattedNumber {
  fullPrecision: number | string;
  roundedValue: BigNumber;
  roundedFormatted: string;
  formatted: string;
  formattedValue: number | string;
  denomination: string;
  minimized: string;
  value: number;
  rounded: number | string;
  full: number | string;
  percent: number | string;
}

export interface FormattedNumberOptions {
  decimals?: number;
  decimalsRounded?: number;
  denomination?: Function;
  roundUp?: boolean;
  roundDown?: boolean;
  positiveSign?: boolean;
  zeroStyled?: boolean;
  minimized?: boolean;
  blankZero?: boolean;
  bigUnitPostfix?: boolean;
  removeComma?: boolean;
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
      hash: string;
      parameters?: UIOrder | NewMarket;
      data: CreateMarketData;
    };
  };
}
export interface PendingOrders {
  [marketId: string]: UIOrder[];
}

export interface QuantityOrderBookOrder
  extends Getters.Markets.MarketOrderBookOrder {
  quantityScale: number;
  percent: number;
  mySize: string;
  price: string;
  cumulativeShares: string;
}
export interface QuantityOutcomeOrderBook {
  spread: string | BigNumber | null;
  bids: QuantityOrderBookOrder[];
  asks: QuantityOrderBookOrder[];
}

export interface OutcomeTestTradingOrder {
  [outcomeId: number]: TestTradingOrder[];
}
export interface TestTradingOrder {
  disappear: boolean;
  avgPrice: FormattedNumber;
  cumulativeShares: string;
  id: string;
  mySize: string;
  orderEstimate: BigNumber;
  outcomeId: string;
  outcomeName: string;
  price: string;
  quantity: string;
  shares: string;
  sharesEscrowed: FormattedNumber;
  tokensEscrowed: FormattedNumber;
  type: string;
  unmatchedShares: FormattedNumber;
}
export interface OrderBooks {
  [marketId: string]: Getters.Markets.MarketOrderBook;
}
export interface IndividualOutcomeOrderBook {
  spread: string | BigNumber | null;
  bids: Getters.Markets.MarketOrderBookOrder[];
  asks: Getters.Markets.MarketOrderBookOrder[];
}
export interface MyPositionsSummary {
  currentValue: FormattedNumber;
  totalPercent: FormattedNumber;
  totalReturns: FormattedNumber;
  valueChange: FormattedNumber;
  valueChange24Hr: FormattedNumber;
}

export interface Notification {
  id: string;
  type: string;
  isImportant: boolean;
  redIcon?: boolean;
  isNew: boolean;
  title: string;
  buttonLabel: string;
  buttonAction: ButtonActionType;
  Template: ReactNode;
  market: MarketData;
  markets: string[];
  claimReportingFees?: object;
  totalProceeds?: number;
  queueName?: string;
  queueId?: string;
  hideCheckbox?: boolean;
  hideNotification?: boolean;
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
  creationTime?: DateFormattedObject;
  blockNumber?: number;
}

export interface CreateLiquidityOrders {
  marketId: string;
  chunkOrders: boolean;
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
  setEndTime?: string;
  hour?: string;
  minute?: string;
  meridiem?: string;
  outcomes?: string | string[];
  settlementFee?: string;
  affiliateFee?: string;
  inputs?: NewMarketPropertiesValidations[];
}

export interface NewMarketPropertyValidations {
  settlementFee?: string;
  scalarDenomination?: string;
  affiliateFee?: string;
  inputs?: NewMarketPropertiesValidations[];
  outcomes?: string | string[];
}

export interface DateTimeComponents {
  endTime: number;
  endTimeFormatted: DateFormattedObject;
  setEndTime: number;
  hour: string;
  minute: string;
  meridiem: string;
  offsetName: string;
  offset: number;
  timezone: string;
}
export interface NewMarket {
  uniqueId: string;
  isValid: boolean;
  validations: NewMarketPropertiesValidations | NewMarketPropertyValidations;
  currentStep: number;
  type: string;
  outcomes: string[];
  outcomesFormatted: OutcomeFormatted[];
  scalarBigNum: string;
  scalarDenomination: string;
  description: string;
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
  navCategories: string[];
  categories: string[];
  settlementFee: number;
  settlementFeePercent: FormattedNumber;
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
  template: Template;
}

export interface LinkContent {
  content: string;
  link?: string;
}

export interface Draft {
  uniqueId: string;
  created: number;
  updated: number;
  isValid: boolean;
  validations:
    | NewMarketPropertiesValidations[]
    | NewMarketPropertyValidations[];
  currentStep: number;
  type: string;
  outcomes: string[];
  scalarBigNum: string;
  scalarDenomination: string;
  description: string;
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
  template: Template;
}

export interface Drafts {
  [uniqueId: string]: Draft;
}

export interface Analytics {
  [id: string]: Analytic;
}

export interface Analytic {
  type: string;
  eventName: string;
  payload: AnalyticPayload;
}

export interface AnalyticPayload {
  addedTimestamp: number;
  userAgent: string;
}

export interface MarketsList {
  isSearching: boolean;
  meta: {
    filteredOutCount: number;
    marketCount: number;
    categories: object;
  };
  selectedCategories: string[];
  selectedCategory: string;
  marketCardFormat: string;
  isSearchInPlace: boolean;
}

export interface DefaultOrderProperties {
  orderPrice: string;
  orderQuantity: string;
  selectedNav: string;
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
    isLoading: boolean;
  };
}
export interface FilledOrders {
  [account: string]: Getters.Trading.MarketTradingHistory;
}

export interface OpenOrders {
  [account: string]: Getters.Trading.Orders;
}

export interface GasPriceInfo {
  average: number;
  fast: number;
  safeLow: number;
  userDefinedGasPrice: number;
}

export enum INVALID_OPTIONS {
  Show = 'show',
  Hide = 'hide',
}

export interface FilterSortOptions {
  marketFilter: string;
  sortBy: string;
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: INVALID_OPTIONS;
  transactionPeriod: string;
  templateFilter: string;
  marketTypeFilter: string;
  limit: number;
  offset: number;
}

export interface Favorite {
  [marketId: string]: number;
}

export interface QueryEndpoints {
  ethereum_node_http?: string;
  ethereum_node_ws?: string;
  [MARKET_ID_PARAM_NAME]?: string;
  [OUTCOME_ID_PARAM_NAME]?: string;
  [RETURN_PARAM_NAME]?: string;
  [CATEGORY_PARAM_NAME]?: string;
  [TAGS_PARAM_NAME]?: string;
  [CREATE_MARKET_FORM_PARAM_NAME]?: string;
}
export interface Endpoints {
  ethereumNodeHTTP: string;
  ethereumNodeWS: string;
}

export interface Connection {
  isConnected: boolean;
  isReconnectionPaused: boolean;
  canHotload: boolean;
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
  isHelpMenuOpen: boolean;
  ethToDaiRate: FormattedNumber;
  repToDaiRate: FormattedNumber;
  usdtToDaiRate: FormattedNumber;
  usdcToDaiRate: FormattedNumber;
  zeroXEnabled: boolean;
  walletStatus: string;
}

export interface AuthStatus {
  isLogged?: boolean;
  restoredAccount?: boolean;
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
  eth: string;
  rep: string;
  dai: string;
  usdt: string;
  usdc: string;
  legacyRep: string;
  attoRep: string;
  legacyAttoRep?: string;
  signerBalances: {
    eth: string;
    rep: string;
    dai: string;
    usdt: string;
    usdc: string;
    legacyRep: string;
  }
}

export interface LoginAccountMeta {
  accountType: string;
  address: string;
  signer: any | EthersSigner;
  provider: JsonRpcProvider;
  isWeb3: boolean;
  profileImage?: string;
  email?: string;
  openWallet?: Function;
}

export interface LoginAccountSettings {
  showInvalidMarketsBannerFeesOrLiquiditySpread?: boolean;
  showInvalidMarketsBannerHideOrShow?: boolean;
  templateFilter?: boolean;
  maxFee?: boolean;
  spread?: boolean;
  marketTypeFilter?: boolean;
  marketFilter?: string;
  showInvalid?: boolean;
  sortBy?: string;
  limit?: number;
  offset?: number;
}

export interface LoginAccount {
  currentOnboardingStep: number;
  address?: string;
  mixedCaseAddress?: string;
  meta?: LoginAccountMeta;
  totalFrozenFunds?: string;
  totalRealizedPL?: string;
  totalOpenOrdersFrozenFunds?: string;
  tradingPositionsTotal?: UnrealizedRevenue;
  timeframeData?: TimeframeData;
  tradingApproved?: boolean;
  balances: AccountBalances;
  reporting: Getters.Accounts.AccountReportingHistory;
  settings?: LoginAccountSettings;
  affiliate?: string;
}

export interface Web3 {
  currentProvider: any;
}

export interface WindowApp extends Window {
  app: object;
  web3: Web3;
  ethereum: {
    selectedAddress;
    networkVersion: string;
    isMetaMask?: boolean;
    on?: Function;
    enable?: Function;
    send?: Function;
  };
  localStorage: Storage;
  integrationHelpers: any;
  fm?: any;
  torus?: any;
  portis?: any;
  showIndexedDbSize?: Function;
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
  numFills: number;
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
    totalUnclaimedProfit: BigNumber;
    totalUnclaimedProceeds: BigNumber;
    totalFees: BigNumber;
  };
  positions: {
    [marketId: string]: {
      unclaimedProfit: string;
      unclaimedProceeds: string;
      fee: string;
    };
  };
}

export interface ClaimReportingOptions {
  reportingParticipants: string[];
  disputeWindows: string[];
  estimateGas?: boolean;
  disavowed?: boolean;
  isForkingMarket?: boolean;
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

export interface DisputeInputtedValues {
  inputStakeValue: string;
  inputToAttoRep: string;
}

export interface NavMenuItem {
  route: string;
  title: string;
  requireLogin?: boolean;
  disabled?: boolean;
  showAlert?: boolean;
  button?: boolean;
  alternateStyle?: boolean;
}

export interface SortedGroup {
  value: string;
  label: string;
  subGroup?: Array<SortedGroup>;
  autoCompleteList?: Array<SortedGroup>;
}

export interface CategoryList {
  [category: string]: [
    {
      [category: string]: [
        {
          [index: number]: string;
        }
      ];
    }
  ];
}
