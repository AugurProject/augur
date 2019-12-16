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
import { EthersSigner } from 'contract-dependencies-ethers/build/ContractDependenciesEthers';
import { Getters, PayoutNumeratorValue } from '@augurproject/sdk';
import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';
import { BigNumber } from 'utils/create-big-number';
import { GnosisSafeState } from '@augurproject/gnosis-relay-api/build/GnosisRelayAPI';

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
export interface Consensus extends PayoutNumeratorValue {
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
  // TODO: add this to getter Getters.Markets.MarketInfo
  // disputeInfo: object; this needs to get filled in on getter
  consensusFormatted: Consensus | null;
  outcomesFormatted: OutcomeFormatted[];
  isTemplate: boolean;
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
  denomination?: Function;
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
  creationTime?: DateFormattedObject;
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
  affiliateFee?: number;
  inputs?: NewMarketPropertiesValidations[];
}

export interface NewMarketPropertyValidations {
  settlementFee?: string;
  scalarDenomination?: string;
  affiliateFee?: number;
  inputs?: NewMarketPropertiesValidations[];
  outcomes?: string | string[];
}
export interface NewMarket {
  uniqueId: string;
  isValid: boolean;
  validations:
    | NewMarketPropertiesValidations
    | NewMarketPropertyValidations;
  currentStep: number;
  type: string;
  outcomes: string[];
  scalarSmallNum: string;
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
  template: Template;
}

export interface LinkContent {
  content: string;
  link?: string;
};

export interface Draft {
  uniqueId: string;
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
  [account: string]: Getters.Trading.Orders;
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
  marketSort: string;
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: INVALID_OPTIONS;
  transactionPeriod: string;
  templateFilter: string;
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
  useWeb3Transport: boolean;
  'ethereum-node': EthereumNodeOptions;
  universe?: string;
  '0x-endpoint'?: string,
  'gnosis-relay'?: string,
  sdkEndpoint?: string,
  debug?: EnvDebugOptions,
}

export interface EnvDebugOptions {
  connect: boolean;
  broadcast: boolean;
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
  ethToDaiRate: BigNumber;
  gnosisEnabled: boolean;
  zeroXEnabled: boolean;
  gnosisStatus: GnosisSafeState;
}

export interface AuthStatus {
  isLogged?: boolean;
  restoredAccount?: boolean;
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
  legacyRep: number;
  attoRep: string;
  legacyAttoRep: string;
}

export interface LoginAccountMeta {
  accountType: string;
  address: string;
  signer: any | EthersSigner;
  isWeb3: boolean;
  profileImage?: string;
  email?: string;
  openWallet?: Function;
}

export interface LoginAccountSettings {
  showInvalidMarketsBannerFeesOrLiquiditySpread?: boolean;
  showInvalidMarketsBannerHideOrShow?: boolean;
}

export interface LoginAccount {
  address?: string;
  mixedCaseAddress?: string;
  meta?: LoginAccountMeta;
  totalFrozenFunds?: string;
  totalRealizedPL?: string;
  tradingPositionsTotal?: UnrealizedRevenue;
  timeframeData?: TimeframeData;
  allowanceFormatted?: FormattedNumber;
  allowance?: BigNumber;
  balances: AccountBalances;
  reporting: Getters.Accounts.AccountReportingHistory;
  settings?: LoginAccountSettings;
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
  };
  localStorage: Storage;
  integrationHelpers: any;
  fm?: any;
  torus?: any;
  portis?: any;
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
