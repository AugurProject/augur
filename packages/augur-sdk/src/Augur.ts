import { ContractAddresses, NetworkId } from '@augurproject/artifacts';
import { ContractInterfaces } from '@augurproject/core';
import { GnosisSafeState, GnosisSafeStateReponse } from '@augurproject/gnosis-relay-api';
import { BigNumber } from 'bignumber.js';
import { EthersSigner, TransactionStatus, TransactionStatusCallback } from 'contract-dependencies-ethers';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { TransactionResponse } from 'ethers/providers';
import { Arrayish } from 'ethers/utils';
import { getAddress } from 'ethers/utils/address';
import { ContractEvents } from './api/ContractEvents';
import { Contracts } from './api/Contracts';
import { Gnosis, GnosisSafeStatusPayload } from './api/Gnosis';
import { HotLoading, DisputeWindow, GetDisputeWindowParams } from './api/HotLoading';
import { Liquidity } from './api/Liquidity';
import { CreateYesNoMarketParams, CreateCategoricalMarketParams, CreateScalarMarketParams, Market } from './api/Market';
import { OnChainTrade } from './api/OnChainTrade';
import { PlaceTradeDisplayParams, SimulateTradeData, Trade } from './api/Trade';
import { ZeroX } from './api/ZeroX';
import { BaseConnector, EmptyConnector, SingleThreadConnector } from './connector';
import { isSubscriptionEventName, SubscriptionEventName, TXEventName } from './constants';
import { Provider } from './ethereum/Provider';
import { TXStatus } from './event-handlers';
import { augurEmitter, Callback, TXStatusCallback } from './events';
import { SyncableFlexSearch } from './state/db/SyncableFlexSearch';
import { Accounts } from './state/getter/Accounts';
import { Liquidity as LiquidityGetter } from './state/getter/Liquidity';
import { Markets } from './state/getter/Markets';
import { OnChainTrading } from './state/getter/OnChainTrading';
import { Platform } from './state/getter/Platform';
import { Status } from './state/getter/status';
import { Universe } from './state/getter/Universe';
import { Users } from './state/getter/Users';
import { ZeroXOrdersGetters } from './state/getter/ZeroXOrdersGetters';
import { WarpSync } from './api/WarpSync';
import { Address } from './state/logs/types';
import { Subscriptions } from './subscriptions';

export class Augur<TProvider extends Provider = Provider> {
  syncableFlexSearch: SyncableFlexSearch;

  readonly contractEvents: ContractEvents;
  readonly contracts: Contracts;
  readonly onChainTrade: OnChainTrade;
  readonly trade: Trade;
  readonly market: Market;
  readonly gnosis: Gnosis;
  readonly warpSync: WarpSync;

  readonly universe: Universe;
  readonly liquidity: Liquidity;
  readonly hotLoading: HotLoading;
  readonly events: Subscriptions;

  private txSuccessCallback: TXStatusCallback;
  private txAwaitingSigningCallback: TXStatusCallback;
  private txPendingCallback: TXStatusCallback;
  private txFailureCallback: TXStatusCallback;
  private txRelayerDownCallback: TXStatusCallback;

  get zeroX(): ZeroX {
    return this._zeroX;
  }

  set zeroX(zeroX: ZeroX) {
    if (this._zeroX) {
      this._zeroX.disconnect();
    }

    this._zeroX = zeroX;
  }

  constructor(
    readonly provider: TProvider,
    readonly dependencies: ContractDependenciesGnosis,
    readonly networkId: NetworkId,
    readonly addresses: ContractAddresses,
    public connector: BaseConnector = new EmptyConnector(),
    private _zeroX = null,
    enableFlexSearch = false
  ) {
    this.provider = provider;
    this.dependencies = dependencies;
    this.networkId = networkId;
    if (!this.connector || connector.constructor.name !== 'EmptyConnector') {
      this.connector = connector;
    }

    this.events = new Subscriptions(augurEmitter);
    this.events.on(SubscriptionEventName.GnosisSafeStatus, this.updateGnosisSafe.bind(this));

    this.connector.client = this;
    if(this.zeroX) this.zeroX.client = this;

    // API
    this.addresses = addresses;
    this.contracts = new Contracts(this.addresses, this.dependencies);
    this.market = new Market(this);
    this.liquidity = new Liquidity(this);
    this.contractEvents = new ContractEvents(
      this.provider,
      this.addresses.Augur,
      this.addresses.AugurTrading,
      this.addresses.ShareToken,
      this.addresses.Exchange,
      );
    this.gnosis = new Gnosis(this.provider, this, this.dependencies);
    this.warpSync = new WarpSync(this);
    this.hotLoading = new HotLoading(this);
    this.onChainTrade = new OnChainTrade(this);
    this.trade = new Trade(this);
    if (enableFlexSearch && !this.syncableFlexSearch) {
      this.syncableFlexSearch = new SyncableFlexSearch();
    }
    this.registerTransactionStatusEvents();
  }

  static async create<TProvider extends Provider = Provider>(
    provider: TProvider,
    dependencies: ContractDependenciesGnosis,
    addresses: ContractAddresses,
    connector: BaseConnector = new SingleThreadConnector(),
    zeroX: ZeroX = null,
    enableFlexSearch = false
  ): Promise<Augur<Provider>> {
    const networkId = await provider.getNetworkId();
    const client = new Augur<TProvider>(
      provider,
      dependencies,
      networkId,
      addresses,
      connector,
      zeroX,
      enableFlexSearch
    );
    await client.contracts.setReputationToken(networkId)
    return client;
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
    if (this.dependencies.useSafe && this.dependencies.safeAddress) {
      account = this.dependencies.safeAddress;
    } else if (!account) {
      account = await this.dependencies.signer.getAddress();
    }
    if (!account) return null;
    return getAddress(account);
  }

  async sendETH(address: string, value: BigNumber): Promise<void> {
    const transaction = {
      to: address,
      data: '0x00',
      value,
    };
    const ethersTransaction = this.dependencies.transactionToEthersTransaction(
      transaction
    );
    await this.dependencies.signer.sendTransaction(ethersTransaction);
  }

  async updateGnosisSafe(payload: GnosisSafeStatusPayload): Promise<void> {}

  setGasPrice(gasPrice: BigNumber): void {
    this.dependencies.setGasPrice(gasPrice);
  }

  setGnosisSafeAddress(safeAddress: string): void {
    this.dependencies.setSafeAddress(safeAddress);
  }

  setGnosisStatus(status: GnosisSafeState): void {
    this.dependencies.setStatus(status);
  }

  getGnosisStatus(): GnosisSafeState {
    return this.dependencies.getStatus();
  }

  setUseGnosisSafe(useSafe: boolean): void {
    this.dependencies.setUseSafe(useSafe);
  }

  setUseGnosisRelay(useRelay: boolean): void {
    this.dependencies.setUseRelay(useRelay);
  }

  getUseGnosisSafe(): boolean {
    return this.dependencies.useSafe;
  }

  checkSafe(owner:Address, safe: Address): Promise<GnosisSafeStateReponse> {
    return this.gnosis.getGnosisSafeDeploymentStatusViaRelay({
      owner,
      safe,
    });
  }

  async getGasStation() {
    return await this.gnosis.gasStation();
  }

  async getGasConfirmEstimate() {
    if(!this.getUseGnosisSafe()) {
      console.log("When not using gnosis safe, Augur doesn't properly estimate the amount of time a transaction should take.")
      return 180;
    }

    var gasLevels = await this.getGasStation();
    var recommended = (parseInt(gasLevels["standard"]) + 1000000000);
    var fast = (parseInt(gasLevels["fast"]) + 1000000000);
    var gasPrice = await this.getGasPrice();
    var gasPriceNum = gasPrice.toNumber();
    if (gasPriceNum >= fast) {
      return 60;
    }
    if (gasPriceNum >= recommended) {
      return 180;
    }
    else {
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
      this.addresses.Orders
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
    return this.connector && this.connector.bindTo(f);
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
      this.txSuccessCallback = callback;
    } else if (eventName === TXEventName.Failure) {
      this.txFailureCallback = callback;
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
      this.txSuccessCallback = null;
    } else if (eventName === TXEventName.Failure) {
      this.txFailureCallback = null;
    } else if (eventName === TXEventName.RelayerDown) {
      this.txRelayerDownCallback = null;
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

  set signer(signer: EthersSigner)  {
    this.dependencies.signer = signer;
  };

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
    return this.bindTo(ZeroXOrdersGetters.getZeroXOrder)(params)
  };

  async hotloadMarket(marketId: string) {
    return this.hotLoading.getMarketDataParams({ market: marketId });
  }

  async getDisputeWindow(params: GetDisputeWindowParams): Promise<DisputeWindow> {
    return this.hotLoading.getCurrentDisputeWindowData(params);
  }

  async simulateTrade(
    params: PlaceTradeDisplayParams
  ): Promise<SimulateTradeData> {
    return this.trade.simulateTrade(params);
  }

  async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    return this.trade.placeTrade(params);
  }

  async cancelOrder(orderHash: string): Promise<void> {
      const order = await this.getOrder({ orderHash });
      await this.zeroX.cancelOrder(order);
  }

  async batchCancelOrders(orderHashes: string[]): Promise<void> {
    const orders = [];
    for (let index = 0; index < orderHashes.length; index++) {
      const order = await this.getOrder({ orderHash: orderHashes[index] });
      orders.push(order);
    }
    await this.zeroX.batchCancelOrders(orders);
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
      (transaction, status, hash) => {
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
          } as TXStatus;
          this.txFailureCallback(txn);
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
