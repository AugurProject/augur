import {
  EthersSigner,
  TransactionStatus,
  TransactionStatusCallback,
} from '@augurproject/contract-dependencies-ethers';
import { ContractInterfaces } from '@augurproject/core';
import {
  isSubscriptionEventName,
  NETWORK_IDS,
  NULL_ADDRESS,
  SubscriptionEventName,
  TXEventName,
  TXStatus,
} from '@augurproject/sdk-lite';
import {
  logger,
  LoggerLevels,
  NetworkId,
  SDKConfiguration,
} from '@augurproject/utils';
import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { JsonRpcProvider, TransactionResponse } from 'ethers/providers';
import { Arrayish } from 'ethers/utils';
import { getAddress } from 'ethers/utils/address';
import { EventEmitter } from 'events';
import { BestOffer } from './api/BestOffer';
import { ContractEvents } from './api/ContractEvents';
import { Contracts } from './api/Contracts';
import { GSN } from './api/GSN';
import {
  DisputeWindow,
  GetDisputeWindowParams,
  HotLoading,
  HotLoadMarketInfo,
} from './api/HotLoading';
import { Liquidity } from './api/Liquidity';
import {
  CreateCategoricalMarketParams,
  CreateScalarMarketParams,
  CreateYesNoMarketParams,
  Market,
} from './api/Market';
import { MarketInvalidBids } from './api/MarketInvalidBids';
import { OnChainTrade } from './api/OnChainTrade';
import { PlaceTradeDisplayParams, SimulateTradeData, Trade } from './api/Trade';
import { Uniswap } from './api/Uniswap';
import { WarpSync } from './api/WarpSync';
import { ZeroX } from './api/ZeroX';
import {
  BaseConnector,
  EmptyConnector,
  SingleThreadConnector,
} from './connector';
import { Provider } from './ethereum/Provider';
import { Callback, EventNameEmitter, TXStatusCallback } from './events';
import { ContractDependenciesGSN } from './lib/contract-deps';
import { SyncableFlexSearch } from './state/db/SyncableFlexSearch';
import { Accounts } from './state/getter/Accounts';
import { Liquidity as LiquidityGetter } from './state/getter/Liquidity';
import { LiquidityPool } from './state/getter/LiquidityPool';
import { Markets } from './state/getter/Markets';
import { OnChainTrading } from './state/getter/OnChainTrading';
import { Platform } from './state/getter/Platform';
import { Status } from './state/getter/status';
import { Universe } from './state/getter/Universe';
import { Users } from './state/getter/Users';
import { WarpSyncGetter } from './state/getter/WarpSyncGetter';
import { ZeroXOrdersGetters } from './state/getter/ZeroXOrdersGetters';
import { WarpController } from './warp/WarpController';

export class Augur<TProvider extends Provider = Provider> {
  syncableFlexSearch: SyncableFlexSearch;

  readonly contractEvents: ContractEvents;
  readonly contracts: Contracts;
  readonly onChainTrade: OnChainTrade;
  readonly trade: Trade;
  readonly market: Market;
  readonly warpSync: WarpSync;
  readonly gsn: GSN;
  readonly uniswap: Uniswap;

  readonly universe: Universe;
  readonly liquidity: Liquidity;
  readonly hotLoading: HotLoading;
  readonly bestOffer: BestOffer;
  readonly marketInvalidBids: MarketInvalidBids;
  readonly events: EventEmitter;

  private _sdkReady = false;

  private txAwaitingSigningCallback: TXStatusCallback;
  private txPendingCallback: TXStatusCallback;
  private txFailureCallback: TXStatusCallback;
  private txFeeTooLowCallback: TXStatusCallback;
  private txRelayerDownCallback: TXStatusCallback;
  private txSuccessCallbacks: TXStatusCallback[];

  private _warpController: WarpController;

  set warpController(_warpController: WarpController) {
    this._warpController = _warpController;
  }

  get warpController() {
    return this._warpController;
  }

  get zeroX(): ZeroX {
    return this._zeroX;
  }

  set zeroX(zeroX: ZeroX) {
    if (this._zeroX) {
      this._zeroX.disconnect();
    }

    this._zeroX = zeroX;
  }

  get sdkReady(): boolean {
    return this._sdkReady;
  }

  constructor(
    readonly provider: TProvider,
    readonly dependencies: ContractDependenciesGSN,
    public config: SDKConfiguration,
    public connector: BaseConnector = new EmptyConnector(),
    private _zeroX = null,
    enableFlexSearch = false
  ) {
    this.provider = provider;
    this.dependencies = dependencies;
    if (!this.connector || connector.constructor.name !== 'EmptyConnector') {
      this.connector = connector;
    }
    if (!config.addresses)
      throw Error(
        `Augur config must include addresses. Config=${JSON.stringify(config)}`
      );

    this.events = new EventNameEmitter();
    this.events.setMaxListeners(0);
    this.events.on(SubscriptionEventName.SDKReady, () => {
      this._sdkReady = true;
      logger.info('SDK is ready');
    });

    this.connector.client = this;
    if (this.zeroX) this.zeroX.client = this;

    // API
    this.contracts = new Contracts(this.config.addresses, this.dependencies);
    this.market = new Market(this);
    this.liquidity = new Liquidity(this);
    this.contractEvents = new ContractEvents(
      this.provider,
      this.config.addresses.Augur,
      this.config.addresses.AugurTrading,
      this.config.addresses.ShareToken
    );
    this.warpSync = new WarpSync(this);
    this.hotLoading = new HotLoading(this);
    this.onChainTrade = new OnChainTrade(this);
    this.trade = new Trade(this);
    this.gsn = new GSN(this.provider, this);
    this.uniswap = new Uniswap(this);

    if (this.config.ui?.trackBestOffer) {
      this.bestOffer = new BestOffer(this);
    }
    if (this.config.ui?.trackMarketInvalidBids) {
      this.marketInvalidBids = new MarketInvalidBids(this);
    }
    if (enableFlexSearch && !this.syncableFlexSearch) {
      this.syncableFlexSearch = new SyncableFlexSearch();
    }
    this.txSuccessCallbacks = [];

    this.registerTransactionStatusEvents();
  }

  static async create<TProvider extends Provider = Provider>(
    provider: TProvider,
    dependencies: ContractDependenciesGSN,
    config: SDKConfiguration,
    connector: BaseConnector = new SingleThreadConnector(),
    zeroX: ZeroX = null,
    enableFlexSearch = false
  ): Promise<Augur<Provider>> {
    const client = new Augur<TProvider>(
      provider,
      dependencies,
      config,
      connector,
      zeroX,
      enableFlexSearch
    );
    await client.contracts.setReputationToken(config.networkId);
    return client;
  }

  get networkId(): NetworkId {
    return this.config.networkId;
  }

  async getTransaction(hash: string): Promise<TransactionResponse> {
    const tx = await this.dependencies.provider.getTransaction(hash);
    return tx;
  }

  async listAccounts() {
    return this.dependencies.provider.listAccounts();
  }

  async signMessage(message: Arrayish) {
    return this.dependencies.signer.signMessage(message);
  }

  async getTimestamp(): Promise<BigNumber> {
    return this.contracts.augur.getTimestamp_();
  }

  async getEthBalance(address: string): Promise<string> {
    const balance = await this.dependencies.provider.getBalance(address);
    return balance.toString();
  }

  async getGasPrice(): Promise<BigNumber> {
    const balance = await this.dependencies.provider.getGasPrice();
    return new BigNumber(balance.toString());
  }

  async getAccount(): Promise<string | null> {
    let account = this.dependencies.address;
    if (!this.dependencies.signer) {
      return NULL_ADDRESS;
    }
    const signer = await this.dependencies.signer.getAddress();
    if (this.dependencies.useWallet) {
      account = await this.gsn.calculateWalletAddress(signer);
    } else if (!account) {
      account = signer;
    }
    if (!account) return NULL_ADDRESS;
    return getAddress(account);
  }

  async getAccountEthBalance() {
    const account = await this.getAccount();
    return this.getEthBalance(account);
  }

  async sendETH(address: string, value: BigNumber): Promise<void> {
    const transaction = {
      to: address,
      data: '0x',
      value,
      from: await this.dependencies.getDefaultAddress(),
    };
    await this.dependencies.submitTransaction(transaction, {
      name: 'Send Ether',
      params: {},
    });
  }

  setUseWallet(useSafe: boolean): void {
    this.dependencies.setUseWallet(useSafe);
  }

  setUseRelay(useRelay: boolean): void {
    this.dependencies.setUseRelay(useRelay);
  }

  setUseDesiredEthBalance(useDesiredEthBalance: boolean): void {
    this.dependencies.setUseDesiredEthBalance(useDesiredEthBalance);
  }

  getUseWallet(): boolean {
    return this.dependencies.useWallet;
  }

  getUseRelay(): boolean {
    return this.dependencies.useRelay;
  }

  getUseDesiredEthBalance(): boolean {
    return this.dependencies.useDesiredSignerETHBalance;
  }

  async getGasStation() {
    try {
      const networkId = this.config.networkId;

      if (networkId !== NETWORK_IDS.Mainnet) {
        return {
          fast: '4000000000',
          standard: '1000000000'
        }
      }

      const result = await axios.get(
        'https://safe-relay.gnosis.io/api/v1/gas-station/'
      );
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async getGasConfirmEstimate() {
    const gasLevels = await this.getGasStation();
    const recommended = parseInt(gasLevels['standard']) + 1000000000;
    const fast = parseInt(gasLevels['fast']) + 1000000000;
    const gasPrice = await this.getGasPrice();
    const gasPriceNum = gasPrice.toNumber();

    if (gasPriceNum >= fast) {
      return 60;
    }
    else if (gasPriceNum >= recommended) {
      return 180;
    } else {
      return 1800;
    }
  }

  getUniverse(address: string): ContractInterfaces.Universe {
    return this.contracts.universeFromAddress(address);
  }

  getMarket(address: string): ContractInterfaces.Market {
    return new ContractInterfaces.Market(this.dependencies, address);
  }

  getOrders(): ContractInterfaces.Orders {
    return new ContractInterfaces.Orders(
      this.dependencies,
      this.config.addresses.Orders
    );
  }

  convertGasEstimateToDaiCost(
    gasEstimate: BigNumber,
    manualGasPrice?: number
  ): BigNumber {
    return this.dependencies.getDisplayCostInDaiForGasEstimate(
      gasEstimate,
      manualGasPrice
    );
  }

  registerTransactionStatusCallback(
    key: string,
    callback: TransactionStatusCallback
  ): void {
    this.dependencies.registerTransactionStatusCallback(key, callback);
  }

  deRegisterTransactionStatusCallback(key: string): void {
    this.dependencies.deRegisterTransactionStatusCallback(key);
  }

  deRegisterAllTransactionStatusCallbacks(): void {
    this.dependencies.deRegisterAllTransactionStatusCallbacks();
  }

  async disconnect(): Promise<any> {
    this.zeroX = null;
    this.provider.disconnect();
    this.connector.disconnect();
  }

  bindTo<R, P>(
    f: (db: any, augur: any, params: P) => Promise<R>
  ): (params: P) => Promise<R> {
    return this.connector?.bindTo(f);
  }

  /*
   * Enums are not available at runtime. These acceptable values/meanings.
   * debug = 0
   * info  = 1
   * warn  = 2
   * error = 3
   */
  setLoggerLevel(logLevel: LoggerLevels) {
    if (0 >= logLevel && logLevel <= 3) {
      logger.logLevel = logLevel;
    }
  }

  async on(
    eventName: SubscriptionEventName | TXEventName | string,
    callback: Callback | TXStatusCallback
  ): Promise<void> {
    if (isSubscriptionEventName(eventName)) {
      return this.connector.on(eventName, callback as Callback);
    } else if (eventName === TXEventName.AwaitingSigning) {
      this.txAwaitingSigningCallback = callback;
    } else if (eventName === TXEventName.Pending) {
      this.txPendingCallback = callback;
    } else if (eventName === TXEventName.Success) {
      this.txSuccessCallbacks.push(callback);
    } else if (eventName === TXEventName.Failure) {
      this.txFailureCallback = callback;
    } else if (eventName === TXEventName.FeeTooLow) {
      this.txFeeTooLowCallback = callback;
    } else if (eventName === TXEventName.RelayerDown) {
      this.txRelayerDownCallback = callback;
    }
  }

  async off(
    eventName: SubscriptionEventName | TXEventName | string
  ): Promise<void> {
    if (isSubscriptionEventName(eventName)) {
      return this.connector.off(eventName);
    } else if (eventName === TXEventName.AwaitingSigning) {
      this.txAwaitingSigningCallback = null;
    } else if (eventName === TXEventName.Pending) {
      this.txPendingCallback = null;
    } else if (eventName === TXEventName.Success) {
      this.txSuccessCallbacks = [];
    } else if (eventName === TXEventName.Failure) {
      this.txFailureCallback = null;
    } else if (eventName === TXEventName.FeeTooLow) {
      this.txFeeTooLowCallback = null;
    } else if (eventName === TXEventName.RelayerDown) {
      this.txRelayerDownCallback = null;
    }
  }

  txSuccessCallback = (...args: TXStatus[]): void => {
    for (const cb of this.txSuccessCallbacks) {
      cb(...args);
    }
  }

  getMarkets = (
    params: Parameters<typeof Markets.getMarkets>[2]
  ): ReturnType<typeof Markets.getMarkets> => {
    return this.bindTo(Markets.getMarkets)(params);
  };

  getMarketsInfo = (
    params: Parameters<typeof Markets.getMarketsInfo>[2]
  ): ReturnType<typeof Markets.getMarketsInfo> => {
    return this.bindTo(Markets.getMarketsInfo)(params);
  };

  getSyncData = () => {
    return this.bindTo(Status.getSyncData)({});
  };

  getZeroXOrders = (
    params: Parameters<typeof ZeroXOrdersGetters.getZeroXOrders>[2]
  ) => {
    return this.bindTo(ZeroXOrdersGetters.getZeroXOrders)(params);
  };

  get signer(): EthersSigner {
    return this.dependencies.signer;
  }

  set signer(signer: EthersSigner) {
    this.dependencies.setSigner(signer);
  }

  setProvider(provider: JsonRpcProvider) {
    this.provider.setProvider(provider);
  }

  getTradingHistory = (
    params: Parameters<typeof OnChainTrading.getTradingHistory>[2]
  ): ReturnType<typeof OnChainTrading.getTradingHistory> => {
    return this.bindTo(OnChainTrading.getTradingHistory)(params);
  };
  getTradingOrders = (
    params: Parameters<typeof OnChainTrading.getOpenOrders>[2]
  ): ReturnType<typeof OnChainTrading.getOpenOrders> => {
    return this.bindTo(OnChainTrading.getOpenOrders)(params);
  };
  getMarketOrderBook = (
    params: Parameters<typeof Markets.getMarketOrderBook>[2]
  ): ReturnType<typeof Markets.getMarketOrderBook> => {
    return this.bindTo(Markets.getMarketOrderBook)(params);
  };

  getMarketPriceCandlesticks = (
    params: Parameters<typeof Markets.getMarketPriceCandlesticks>[2]
  ): ReturnType<typeof Markets.getMarketPriceCandlesticks> => {
    return this.bindTo(Markets.getMarketPriceCandlesticks)(params);
  };

  getMarketLiquidityRanking = (
    params: Parameters<typeof LiquidityGetter.getMarketLiquidityRanking>[2]
  ): ReturnType<typeof LiquidityGetter.getMarketLiquidityRanking> => {
    return this.bindTo(LiquidityGetter.getMarketLiquidityRanking)(params);
  };

  getUserTradingPositions = (
    params: Parameters<typeof Users.getUserTradingPositions>[2]
  ): ReturnType<typeof Users.getUserTradingPositions> => {
    return this.bindTo(Users.getUserTradingPositions)(params);
  };

  getUserOpenOrders = (
    params: Parameters<typeof Users.getUserOpenOrders>[2]
  ): ReturnType<typeof Users.getUserOpenOrders> => {
    return this.bindTo(Users.getUserOpenOrders)(params);
  };

  getUserFrozenFundsBreakdown = (
    params: Parameters<typeof Users.getUserFrozenFundsBreakdown>[2]
  ): ReturnType<typeof Users.getUserFrozenFundsBreakdown> => {
    return this.bindTo(Users.getUserFrozenFundsBreakdown)(params);
  };

  getMostRecentWarpSync = (): ReturnType<
    typeof WarpSyncGetter.getMostRecentWarpSync
  > => {
    return this.bindTo(WarpSyncGetter.getMostRecentWarpSync)(undefined);
  };

  getWarpSyncStatus = (): ReturnType<
    typeof WarpSyncGetter.getWarpSyncStatus
  > => {
    return this.bindTo(WarpSyncGetter.getWarpSyncStatus)(undefined);
  };

  getPayoutFromWarpSyncHash = (hash: string): Promise<BigNumber[]> => {
    return this.warpSync.getPayoutFromWarpSyncHash(hash);
  };

  getWarpSyncHashFromPayout = (payout: BigNumber[]): string => {
    return this.warpSync.getWarpSyncHashFromPayout(payout[2]);
  };

  getWarpSyncMarket = (
    universe: string
  ): Promise<ContractInterfaces.Market> => {
    return this.warpSync.getWarpSyncMarket(universe);
  };
  getProfitLoss = (
    params: Parameters<typeof Users.getProfitLoss>[2]
  ): ReturnType<typeof Users.getProfitLoss> => {
    return this.bindTo(Users.getProfitLoss)(params);
  };
  getProfitLossSummary = (
    params: Parameters<typeof Users.getProfitLossSummary>[2]
  ): ReturnType<typeof Users.getProfitLossSummary> => {
    return this.bindTo(Users.getProfitLossSummary)(params);
  };

  getAccountTimeRangedStats = (
    params: Parameters<typeof Users.getAccountTimeRangedStats>[2]
  ): ReturnType<typeof Users.getAccountTimeRangedStats> => {
    return this.bindTo(Users.getAccountTimeRangedStats)(params);
  };

  getUserAccountData = (
    params: Parameters<typeof Users.getUserAccountData>[2]
  ): ReturnType<typeof Users.getUserAccountData> => {
    return this.bindTo(Users.getUserAccountData)(params);
  };

  getUserPositionsPlus = (
    params: Parameters<typeof Users.getUserPositionsPlus>[2]
  ): ReturnType<typeof Users.getUserPositionsPlus> => {
    return this.bindTo(Users.getUserPositionsPlus)(params);
  };

  getTotalOnChainFrozenFunds = (
    params: Parameters<typeof Users.getTotalOnChainFrozenFunds>[2]
  ): ReturnType<typeof Users.getTotalOnChainFrozenFunds> => {
    return this.bindTo(Users.getTotalOnChainFrozenFunds)(params);
  };
  getAccountTransactionHistory = (
    params: Parameters<typeof Accounts.getAccountTransactionHistory>[2]
  ): ReturnType<typeof Accounts.getAccountTransactionHistory> => {
    return this.bindTo(Accounts.getAccountTransactionHistory)(params);
  };

  getAccountRepStakeSummary = (
    params: Parameters<typeof Accounts.getAccountRepStakeSummary>[2]
  ): ReturnType<typeof Accounts.getAccountRepStakeSummary> => {
    return this.bindTo(Accounts.getAccountRepStakeSummary)(params);
  };

  getUserCurrentDisputeStake = (
    params: Parameters<typeof Accounts.getUserCurrentDisputeStake>[2]
  ): ReturnType<typeof Accounts.getUserCurrentDisputeStake> => {
    return this.bindTo(Accounts.getUserCurrentDisputeStake)(params);
  };
  getPlatformActivityStats = (
    params: Parameters<typeof Platform.getPlatformActivityStats>[2]
  ): ReturnType<typeof Platform.getPlatformActivityStats> => {
    return this.bindTo(Platform.getPlatformActivityStats)(params);
  };
  getCategoryStats = (
    params: Parameters<typeof Markets.getCategoryStats>[2]
  ): ReturnType<typeof Markets.getCategoryStats> => {
    return this.bindTo(Markets.getCategoryStats)(params);
  };

  getOrder = (
    params: Parameters<typeof ZeroXOrdersGetters.getZeroXOrder>[2]
  ): ReturnType<typeof ZeroXOrdersGetters.getZeroXOrder> => {
    return this.bindTo(ZeroXOrdersGetters.getZeroXOrder)(params);
  };

  async hotloadMarket(marketId: string): Promise<HotLoadMarketInfo> {
    return this.hotLoading.getMarketDataParams({ market: marketId });
  }

  async getDisputeWindow(
    params: GetDisputeWindowParams
  ): Promise<DisputeWindow> {
    return this.hotLoading.getCurrentDisputeWindowData(params);
  }

  getMarketOutcomeBestOffer = (
    params: Parameters<typeof LiquidityPool.getMarketOutcomeBestOffer>[2]
  ): ReturnType<typeof LiquidityPool.getMarketOutcomeBestOffer> => {
    return this.bindTo(LiquidityPool.getMarketOutcomeBestOffer)(params);
  };

  getMarketsLiquidityPools = (
    params: Parameters<typeof LiquidityPool.getMarketsLiquidityPools>[2]
  ): ReturnType<typeof LiquidityPool.getMarketsLiquidityPools> => {
    return this.bindTo(LiquidityPool.getMarketsLiquidityPools)(params);
  };

  async simulateTrade(
    params: PlaceTradeDisplayParams
  ): Promise<SimulateTradeData> {
    return this.trade.simulateTrade(params);
  }

  async pinHashByGatewayUrl(url:string) {
    if(this._warpController) this._warpController.pinHashByGatewayUrl(url);
  }

  async placeTrade(params: PlaceTradeDisplayParams): Promise<boolean> {
    return this.trade.placeTrade(params);
  }

  async cancelOrder(orderHash: string): Promise<void> {
    const order = await this.getOrder({ orderHash });
    await this.zeroX.cancelOrder(order, order.signature);
  }

  async batchCancelOrders(orderHashes: string[]): Promise<void> {
    const orders = [];
    const signatures = [];
    for (let index = 0; index < orderHashes.length; index++) {
      const order = await this.getOrder({ orderHash: orderHashes[index] });
      orders.push(order);
      signatures.push(order.signature);
    }
    await this.zeroX.batchCancelOrders(orders, signatures);
  }

  async createYesNoMarket(
    params: CreateYesNoMarketParams
  ): Promise<ContractInterfaces.Market> {
    return this.market.createYesNoMarket(params);
  }

  async createCategoricalMarket(
    params: CreateCategoricalMarketParams
  ): Promise<ContractInterfaces.Market> {
    return this.market.createCategoricalMarket(params);
  }

  async createScalarMarket(
    params: CreateScalarMarketParams
  ): Promise<ContractInterfaces.Market> {
    return this.market.createScalarMarket(params);
  }

  async simulateTradeGasLimit(
    params: PlaceTradeDisplayParams
  ): Promise<BigNumber> {
    return this.trade.simulateTradeGasLimit(params);
  }

  getUniverseChildren = (
    params: Parameters<typeof Universe.getUniverseChildren>[2]
  ): ReturnType<typeof Universe.getUniverseChildren> => {
    return this.bindTo(Universe.getUniverseChildren)(params);
  };

  private registerTransactionStatusEvents() {
    this.registerTransactionStatusCallback(
      'Transaction Status Handler',
      (transaction, status, hash, reason) => {
        if (status === TransactionStatus.SUCCESS && this.txSuccessCallback) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.Success,
            hash,
          } as TXStatus;
          this.txSuccessCallback(txn);
        } else if (
          status === TransactionStatus.AWAITING_SIGNING &&
          this.txAwaitingSigningCallback
        ) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.AwaitingSigning,
            hash,
          } as TXStatus;
          this.txAwaitingSigningCallback(txn);
        } else if (
          status === TransactionStatus.PENDING &&
          this.txPendingCallback
        ) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.Pending,
            hash,
          } as TXStatus;
          this.txPendingCallback(txn);
        } else if (
          status === TransactionStatus.FAILURE &&
          this.txFailureCallback
        ) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.Failure,
            hash,
            reason,
          } as TXStatus;
          this.txFailureCallback(txn);
        } else if (
          status === TransactionStatus.FEE_TOO_LOW &&
          this.txFeeTooLowCallback
        ) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.FeeTooLow,
            hash,
          } as TXStatus;
          this.txFeeTooLowCallback(txn);
        } else if (
          status === TransactionStatus.RELAYER_DOWN &&
          this.txRelayerDownCallback
        ) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.RelayerDown,
            hash,
          } as TXStatus;
          this.txRelayerDownCallback(txn);
        }
      }
    );
  }
}
