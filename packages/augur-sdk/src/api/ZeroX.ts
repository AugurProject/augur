import {
  ExchangeFillEvent,
  GetOrdersResponse,
  Stats,
  ValidationResults,
} from '@0x/mesh-browser-lite';
import { OrderEvent, OrderInfo, WSClient } from '@0x/mesh-rpc-client';
import { Event } from '@augurproject/core/build/libraries/ContractInterfaces';
import {
  MAX_FILLS_PER_TX,
  MAX_GAS_LIMIT_FOR_TRADE,
  NULL_ADDRESS,
  OrderEventLog,
  OrderEventType,
  OrderEventUint256Value,
  OrderType,
  SubscriptionEventName,
  WORST_CASE_FILL,
  NORMAL_FILL
} from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { BigNumber as BN } from 'ethers/utils';
import * as _ from 'lodash';
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  convertOnChainAmountToDisplayAmount,
  getTradeInterval,
  numTicksToTickSizeWithDisplayPrices,
  QUINTILLION,
} from '../utils';
import { Augur } from './../Augur';
import {
  NativePlaceTradeChainParams,
  NativePlaceTradeDisplayParams,
  TradeTransactionLimits,
} from './OnChainTrade';

export const MAX_PROTOCOL_FEE_MULTIPLIER = 2;
export enum Verbosity {
  Panic = 0,
  Fatal = 1,
  Error = 2,
  Warn = 3,
  Info = 4,
  Debug = 5,
  Trace = 6,
}

export interface BrowserMeshConfiguration {
  verbosity?: Verbosity;
  ethereumRPCURL: string;
  ethereumNetworkID: number;
  useBootstrapList?: boolean;
  bootstrapList?: string[];
  orderExpirationBufferSeconds?: number;
  blockPollingIntervalSeconds?: number;
  ethereumRPCMaxContentLength?: number;
}

export interface BrowserMesh {
  startAsync(): Promise<void>;
  onError(handler: (err: Error) => void): void;
  onOrderEvents(handler: (events: OrderEvent[]) => void): void;
  addOrdersAsync(
    orders: SignedOrder[],
    pinned?: boolean
  ): Promise<ValidationResults>;
  getOrdersAsync(): Promise<GetOrdersResponse>;
  getStatsAsync(): Promise<Stats>;
}

export interface ZeroXPlaceTradeDisplayParams
  extends NativePlaceTradeDisplayParams {
  expirationTime: BigNumber;
}

export interface ZeroXPlaceTradeParams extends NativePlaceTradeChainParams {
  expirationTime: BigNumber;
  postOnly?: boolean;
}

export interface ZeroXOrder {
  amount: BigNumber;
  displayPrice: BigNumber;
  owner: string;
}

export interface ZeroXStats {
  peers: number;
  orders: number;
}

export interface ZeroXSingleOutcomeOrderBook {
  buyOrders: ZeroXOrder[];
  sellorders: ZeroXOrder[];
}

export interface ZeroXContractSimulateTradeData {
  _sharesFilled: BigNumber;
  _settlementFees: BigNumber;
  _sharesDepleted: BigNumber;
  _tokensDepleted: BigNumber;
  _numFills: BigNumber;
}

export interface ZeroXSimulateTradeData {
  sharesFilled: BigNumber;
  settlementFees: BigNumber;
  sharesDepleted: BigNumber;
  tokensDepleted: BigNumber;
  numFills: BigNumber;
  selfTrade: boolean;
}

export interface ZeroXTradeOrder {
  makerAddress: string;
  takerAddress: string;
  feeRecipientAddress: string;
  senderAddress: string;
  makerAssetAmount: BigNumber;
  takerAssetAmount: BigNumber;
  makerFee: BigNumber;
  takerFee: BigNumber;
  expirationTimeSeconds: BigNumber;
  salt: BigNumber;
  makerAssetData: string;
  takerAssetData: string;
  makerFeeAssetData: string;
  takerFeeAssetData: string;
}

export interface MatchingOrders {
  orders: ZeroXTradeOrder[];
  signatures: string[];
  orderIds: string[];
  loopLimit: BigNumber;
  gasLimit: BigNumber;
}

export interface SignedOrder {
  makerAddress: string;
  takerAddress: string;
  feeRecipientAddress: string;
  senderAddress: string;
  makerAssetAmount: BigNumber;
  takerAssetAmount: BigNumber;
  makerFee: BigNumber;
  takerFee: BigNumber;
  expirationTimeSeconds: BigNumber;
  salt: BigNumber;
  makerAssetData: string;
  takerAssetData: string;
  makerFeeAssetData: string;
  takerFeeAssetData: string;
}

export class ZeroX {

  private _rpc?: WSClient;
  get rpc(): WSClient {
    return this._rpc;
  }

  set rpc(client: WSClient|null) {
    if(!client && this._rpc) {
      this._rpc.destroy();
      this._rpc = null;
      return;
    }

    this._rpc = client;
    this._rpc.subscribeToOrdersAsync((orderEvents: OrderEvent[]) => {
      if (!this._mesh && this.client) {
        this.client.events.emit(SubscriptionEventName.ZeroXRPCOrderEvent, orderEvents);
      }
    }).catch((err) => {
      if (this.client) this.client.events.emit(SubscriptionEventName.ZeroXStatusError, {});
      throw Error(`Failure when subscribing to OrdersAsync in ZeroX set rpc: ${err}`);
    });

    if (this.client) this.client.events.emit(SubscriptionEventName.ZeroXStatusReady, {});
  }

  private _mesh?: BrowserMesh;
  get mesh(): BrowserMesh {
    return this._mesh;
  }

  set mesh(mesh: BrowserMesh|null) {
    if(!mesh && this._mesh) {
      console.log('Browser mesh is being cleared, but there is no way to stop a running instance. You may end up with multiple instances of _mesh running.');
      this._mesh = null;
      return;
    }

    this._mesh = mesh;

    if (!this._mesh) return;

    this._mesh.onOrderEvents((orderEvents: OrderEvent[]) => {
      console.log("Got OrderEvents: ", orderEvents.length)
      if (this.client && orderEvents.length > 0) {
        this.client.events.emit(SubscriptionEventName.ZeroXMeshOrderEvent, orderEvents);
      }
    });

    if (this.client) this.client.events.emit(SubscriptionEventName.ZeroXStatusReady, {});
  }

  private _client: Augur;
  get client() {
    return this._client;
  }
  set client(client: Augur) {
    this._client = client;
  }

  disconnect() {
    console.log('Disconnecting from ZeroX');
    this.mesh = null;
    this.rpc = null;
  }

  constructor(_rpcEndpoint?: string) {
    if (typeof _rpcEndpoint !== 'undefined') {
      this.rpc = new WSClient(_rpcEndpoint);
    }
  }

  async getOrders(): Promise<OrderInfo[]> {
    let response;
    if (this.rpc) {
      response = await this.rpc.getOrdersAsync();
    } else if (this.mesh) {
      response = await this.mesh.getOrdersAsync();
    } else {
      throw new Error('Attempting to get orders with no connection to 0x');
    }
    return response ? response.ordersInfos : [];
  }

  isReady(): boolean {
    return Boolean(this.rpc || this.mesh);
  }

  async getStats(): Promise<ZeroXStats> {
    let stats;
    if (this.rpc) {
      stats = await this.rpc.getStatsAsync();
    } else if (this.mesh) {
      stats = await this.mesh.getStatsAsync();
    }

    return {
      peers: stats?.numPeers || 0,
      orders: stats?.numOrders || 0
    };
  }

  async placeTrade(params: ZeroXPlaceTradeDisplayParams): Promise<boolean> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    return this.placeOnChainTrade(onChainTradeParams);
  }

  getOnChainTradeParams(
    params: ZeroXPlaceTradeDisplayParams
  ): ZeroXPlaceTradeParams {
    const tickSize = numTicksToTickSizeWithDisplayPrices(
      params.numTicks,
      params.displayMinPrice,
      params.displayMaxPrice
    );
    const onChainAmount = convertDisplayAmountToOnChainAmount(
      params.displayAmount,
      tickSize
    );
    const onChainPrice = convertDisplayPriceToOnChainPrice(
      params.displayPrice,
      params.displayMinPrice,
      tickSize
    );
    const onChainShares = convertDisplayAmountToOnChainAmount(
      params.displayShares,
      tickSize
    );
    return Object.assign(params, {
      amount: onChainAmount,
      price: onChainPrice,
      shares: onChainShares,
    });
  }

  async placeOnChainTrade(
    params: ZeroXPlaceTradeParams,
    ignoreOrders?: string[]
  ): Promise<boolean> {
    if (!this.client) throw new Error('To place ZeroX trade, make sure Augur client instance was initialized with it enabled.');

    const invalidReason = await this.checkIfTradeValid(params);
    if (invalidReason) throw new Error(invalidReason);

    const account = await this.client.getAccount();

    if (params.postOnly) {
      await this.placeOnChainOrders([params]);
      return true;
    }

    const { orders, signatures, orderIds, loopLimit } = await this.getMatchingOrders(
      params,
      ignoreOrders
    );

    console.log(JSON.stringify(orders) + 'Logged orders');

    const numOrders = _.size(orders);

    // No orders available to take. Maybe make some new ones
    if (numOrders === 0) {
      if (!params.doNotCreateOrders) {
        await this.placeOnChainOrders([params]);
      } else {
        // We send this just to remove the pending order display
        this.client.events.emit(SubscriptionEventName.BulkOrderEvent, {
          logs: [{
            eventType: OrderEventType.Fill,
            orderCreator: account,
            ...params
          }]
        });
      }
      return false;
    }

    const gasPrice = await this.client.getGasPrice();
    const exchangeFeeMultiplier = await this.client.contracts.zeroXExchange.protocolFeeMultiplier_();
    const protocolFee = gasPrice.multipliedBy(exchangeFeeMultiplier).multipliedBy(new BigNumber(loopLimit)).multipliedBy(MAX_PROTOCOL_FEE_MULTIPLIER);
    const walletEthBalance = await this.client.getEthBalance(account);
    const remainingToPay = protocolFee.gt(walletEthBalance) ? protocolFee.minus(walletEthBalance) : new BigNumber(0);
    let maxProtocolFeeInDai = remainingToPay.multipliedBy(await this.client.getExchangeRate(true)).div(QUINTILLION);
    maxProtocolFeeInDai = maxProtocolFeeInDai.decimalPlaces(0);

    const result: Event[] = await this.client.contracts.ZeroXTrade.trade(
      params.amount,
      params.fingerprint,
      params.tradeGroupId,
      maxProtocolFeeInDai,
      new BigNumber(loopLimit), // This is the maximum number of trades to actually make. This lets us put in more orders than we could fill with the gasLimit but handle failures and still fill the desired amount
      orders,
      signatures,
      { attachedEth: BigNumber.min(protocolFee, walletEthBalance) }
    );

    const amountRemaining = this.getTradeAmountRemaining(
      account,
      params.amount,
      result
    );
    console.log(`Amount remaining to trade: ${amountRemaining.toString()}`);
    if (amountRemaining.gt(0)) {
      params.amount = amountRemaining;
      // On successive iterations we specify previously for certain taken signed orders since its possible we do another loop before the mesh has updated our view on the orderbook
      return this.placeOnChainTrade(
        params,
        orderIds.slice(0, loopLimit.toNumber()).concat(ignoreOrders || [])
      );
    } else {
      return true;
    }
  }

  async safePlaceOrders(params: ZeroXPlaceTradeDisplayParams[]): Promise<void> {
    if (!this.client) throw new Error('To place ZeroX trade, make sure Augur client instance was initialized with it enabled.');
    const onChainOrders = params.map((params) => ({...params, ...this.getOnChainTradeParams(params)}));
    const marketIds = _.keys(_.keyBy(onChainOrders, 'market'));
    const markets = await this.client.getMarketsInfo({ marketIds });
    const keyedMarkets = _.keyBy(markets, 'id');

    const groupSorted = _.groupBy(_.sortBy(onChainOrders, ['direction', 'price']), 'direction');
    const bestBid = _.last(groupSorted[OrderType.Bid]);
    const bestAsk = _.first(groupSorted[OrderType.Ask]);
    if (!!bestAsk && !!bestBid && bestBid.price.gte(bestAsk.price)) {
      throw new Error("Order collection has cross orderbook order(s)");
    }

    for (const order of onChainOrders) {
      const market = keyedMarkets[order.market];
      const maxPrice = new BigNumber(market.maxPrice);
      const minPrice = new BigNumber(market.minPrice);
      const displayPrice = new BigNumber(order.displayPrice);
      if (displayPrice.gt(maxPrice) || displayPrice.lt(minPrice)) {
        throw new Error("Order Price Out of Market Price Range");
      }

      const tradeInterval = getTradeInterval(minPrice, maxPrice, new BigNumber(market.numTicks));
      const multipleOf = tradeInterval.dividedBy(market.tickSize).dividedBy(10 ** 18)
      if (!order.amount.mod(multipleOf).eq(0)) {
        throw new Error(`Order not multiple of ${multipleOf.toNumber()}`);
      }

      const invalidReason = await this.checkIfTradeValid(order);
      if (invalidReason) throw new Error(invalidReason);
    };

    for(const order of [bestBid, bestAsk]) {
      if (!order) return;
      const { orders } = await this.getMatchingOrders(
        order,
        []
      );
      if (orders.length > 0) {
        throw new Error("Order would cross Orderbook spread");
      }
    }

    return await this.placeOnChainOrders(onChainOrders);
  }

  async placeOrder(params: ZeroXPlaceTradeDisplayParams): Promise<void> {
    await this.placeOrders([params]);
  }

  async placeOrders(orders: ZeroXPlaceTradeDisplayParams[]): Promise<void> {
    const onChainOrders = orders.map((params) => {
      return this.getOnChainTradeParams(params);
    });
    await this.placeOnChainOrders(onChainOrders);
  }

  async placeOnChainOrders(orders: ZeroXPlaceTradeParams[]): Promise<void> {
    const zeroXOrders = [];
    for (const params of orders) {
      const result = await this.createZeroXOrder(params);
      zeroXOrders.push(result.order);
    }
    const validation = await this.addOrders(zeroXOrders);
    if (validation.rejected.length > 0) {
      console.log(JSON.stringify(validation.rejected, null, 2));
      throw Error(
        `0x add order validation failure: ${JSON.stringify(
          validation.rejected[0]
        )}`
      );
    }
  }

  async createZeroXOrder(params: ZeroXPlaceTradeParams) {
    if (!this.client) throw new Error('To place ZeroX order, make sure Augur client instance was initialized with it enabled.');
    const salt = new BigNumber(Date.now());
    const sender = await this.client.getAccount();
    const result = await this.client.contracts.ZeroXTrade.createZeroXOrder_(
      new BigNumber(params.direction),
      params.amount,
      params.price,
      params.market,
      new BigNumber(params.outcome),
      params.expirationTime,
      salt,
      { sender }
    );
    const order = result[0];
    const hash = result[1];
    const makerAddress: string = order[0]; // signer or wallet
    const signature = await this.signOrder(
      order,
      hash,
      false
    );

    return {
      order: {
        chainId: Number(this.client.config.networkId),
        exchangeAddress: this.client.config.addresses.Exchange,
        makerAddress,
        makerAssetData: order[10],
        makerFeeAssetData: order[12],
        makerAssetAmount: new BigNumber(order[4]._hex),
        makerFee: new BigNumber(order[6]._hex),
        takerAddress: order[1],
        takerAssetData: order[11],
        takerFeeAssetData: order[13],
        takerAssetAmount: new BigNumber(order[5]._hex),
        takerFee: new BigNumber(order[7]._hex),
        senderAddress: order[3],
        feeRecipientAddress: order[2],
        expirationTimeSeconds: new BigNumber(order[8]._hex),
        salt: new BigNumber(order[9]._hex),
        signature,
        hash, // only used by our mock; safe to send because it's ignored by real mesh
      },
      hash,
    };
  }

  async signOrder(
    signedOrder: SignedOrder,
    orderHash: string,
    wallet = true
  ): Promise<string> {
    if (wallet) {
      return this.signWalletOrder(signedOrder, orderHash);
    } else {
      return this.signSimpleOrder(orderHash);
    }
  }

  async signWalletOrder(signedOrder: SignedOrder, orderHash: string): Promise<string> {
    const walletAddress: string = signedOrder[0];

    const eip1271OrderWithHash = await this.client.contracts.ZeroXTrade.encodeEIP1271OrderWithHash_(
      signedOrder,
      orderHash
    );

    const augurWallet = this.client.contracts.augurWalletFromAddress(
      walletAddress
    );

    const messageHash = await augurWallet.getMessageHash_(eip1271OrderWithHash);

    // In 0x v3, '07' is EIP1271Wallet
    // See https://github.com/0xProject/0x-mesh/blob/0xV3/zeroex/order.go#L51
    const signatureType = '07';

    const signedMessage = await this.client.signMessage(
      ethers.utils.arrayify(messageHash)
    );
    const { r, s, v } = ethers.utils.splitSignature(signedMessage);
    const signature = `0x${r.slice(2)}${s.slice(2)}${v.toString(16)}${signatureType}`;
    return signature;
  }

  async signSimpleOrder(orderHash: string): Promise<string> {
    // See https://github.com/0xProject/0x-mesh/blob/0xV3/zeroex/order.go#L51
    const signatureType = '03';

    const signedMessage = await this.client.signMessage(
      ethers.utils.arrayify(orderHash)
    );
    const { r, s, v } = ethers.utils.splitSignature(signedMessage);
    return `0x${v.toString(16)}${r.slice(2)}${s.slice(2)}${signatureType}`;
  }

  async addOrders(orders) {
    try {
      if (this._mesh) {
        return this._mesh.addOrdersAsync(orders);
      } else if (this._rpc) {
        return this._rpc.addOrdersAsync(orders);
      } else {
        throw Error('Unable to fetch orders from ZeroX - The mesh has not yet been initialized or there is an error, and no RPC server was specified.')
      }
    } catch (error) {
      if (this._mesh || this._rpc) {
        console.error('Retrying 0x addOrders:', error);
        // Wait 5 seconds then retry.
        return setTimeout(this.addOrders(orders), 5000);
      } else {
        throw error;
      }
    }
  }

  async cancelOrder(order, signature) {
    if (!this.client) throw new Error('To cancel ZeroX orders, make sure your Augur Client instance was initialized with it enabled.');
    return this.batchCancelOrders([order], [signature]);
  }

  async batchCancelOrders(orders, signatures) {
    if (!this.client) throw new Error('To cancel ZeroX orders, make sure your Augur Client instance was initialized with it enabled.');

    const gasPrice = await this.client.getGasPrice();
    const exchangeFeeMultiplier = await this.client.contracts.zeroXExchange.protocolFeeMultiplier_();
    const protocolFee = gasPrice.multipliedBy(exchangeFeeMultiplier).multipliedBy(orders.length).multipliedBy(MAX_PROTOCOL_FEE_MULTIPLIER);
    let maxProtocolFeeInDai = protocolFee.multipliedBy(await this.client.getExchangeRate(true)).div(QUINTILLION);
    maxProtocolFeeInDai = maxProtocolFeeInDai.decimalPlaces(0);

    return this.client.contracts.ZeroXTrade.cancelOrders(orders, signatures, maxProtocolFeeInDai);
  }

  async simulateTrade(
    params: ZeroXPlaceTradeDisplayParams
  ): Promise<ZeroXSimulateTradeData> {
    if (!this.client) throw new Error('To place ZeroX trades, make sure your Augur Client instance was initialized with it enabled.');
    const onChainTradeParams = this.getOnChainTradeParams(params);
    const { orders, signatures, orderIds, loopLimit } = await this.getMatchingOrders(
      onChainTradeParams,
      []
    );
    let simulationData: BigNumber[];
    const selfTrade =
      params.takerAddress && orders.length > 0
        ? !!orders.find(
            order =>
              order.makerAddress.toLowerCase() ===
              params.takerAddress.toLowerCase()
          )
        : false;
    if (orders.length < 1 && !params.doNotCreateOrders) {
      simulationData = await this.simulateMakeOrder(onChainTradeParams);
    } else if (orders.length < 1 || !params.takerAddress) {
      return {
        sharesFilled: new BigNumber(0),
        tokensDepleted: new BigNumber(0),
        sharesDepleted: new BigNumber(0),
        settlementFees: new BigNumber(0),
        numFills: new BigNumber(0),
        selfTrade,
      };
    } else {
      const options = {sender: await this.client.getAccount()};
      simulationData = ((await this.client.contracts.simulateTrade.simulateZeroXTrade_(
        orders,
        onChainTradeParams.amount,
        params.doNotCreateOrders,
        options
      )) as unknown) as BigNumber[];
    }
    const tickSize = numTicksToTickSizeWithDisplayPrices(
      params.numTicks,
      params.displayMinPrice,
      params.displayMaxPrice
    );
    const displaySharesFilled = convertOnChainAmountToDisplayAmount(
      simulationData[0],
      tickSize
    );
    const displaySharesDepleted = convertOnChainAmountToDisplayAmount(
      simulationData[2],
      tickSize
    );
    const displayTokensDepleted = simulationData[1].dividedBy(QUINTILLION);
    const displaySettlementFees = simulationData[3].dividedBy(QUINTILLION);
    const numFills = simulationData[4];
    return {
      sharesFilled: displaySharesFilled,
      tokensDepleted: displayTokensDepleted,
      sharesDepleted: displaySharesDepleted,
      settlementFees: displaySettlementFees,
      numFills,
      selfTrade,
    };
  }

  simulateMakeOrder(params: ZeroXPlaceTradeParams): BigNumber[] {
    const sharesDepleted = BigNumber.min(params.shares, params.amount);
    const price =
      params.direction === 0
        ? params.price
        : params.numTicks.minus(params.price);
    const tokensDepleted = params.amount
      .minus(sharesDepleted)
      .multipliedBy(price);
    return [
      new BigNumber(0),
      tokensDepleted,
      sharesDepleted,
      new BigNumber(0),
      new BigNumber(0),
    ];
  }

  // TODO a more specific getter for this that does a lot of the processing below would likely be more appropriate
  async getMatchingOrders(
    params: ZeroXPlaceTradeParams,
    ignoreOrders?: string[]
  ): Promise<MatchingOrders> {
    const orderType = params.direction === 0 ? '1' : '0';
    const outcome = params.outcome.toString();
    const price = new BN(params.price.toString()).toHexString().substr(2);

    let zeroXOrders = params.postOnly
      ? []
      : await this.client.getZeroXOrders({
          marketId: params.market,
          outcome: params.outcome,
          orderType,
          matchPrice: `0x${price.padStart(20, '0')}`,
          ignoreOrders,
        });

    if (_.size(zeroXOrders) < 1) {
      return { orders: [], signatures: [], orderIds: [], loopLimit: new BigNumber(0), gasLimit: new BigNumber(0)};
    }

    let ordersMap = [];
    if (zeroXOrders[params.market] && zeroXOrders[params.market][outcome] && zeroXOrders[params.market][outcome][orderType]) {
      ordersMap = zeroXOrders[params.market][outcome][orderType];
    }

    const sortedOrders = _.values(ordersMap).sort((a, b) => {
      let price = 0;
      if(params.direction === 0) {
        price = (a.price - b.price);
      }
      if(params.direction === 1) {
        price = (b.price - a.price);
      }
      return price === 0 ? b.amount - a.amount : price;
    });

    const { loopLimit, gasLimit } = this.getTradeTransactionLimits(params, sortedOrders.length);
    const numOrdersToPotentiallyFill = 10;
    const ordersData =
      params.direction === 0
        ? _.take(sortedOrders, numOrdersToPotentiallyFill)
        : _.takeRight(sortedOrders, numOrdersToPotentiallyFill);

    const orderIds = _.map(ordersData, orderData => {
      return orderData.orderId;
    });

    const orders: ZeroXTradeOrder[] = _.map(ordersData, orderData => {
      return {
        makerAddress: orderData.owner,
        takerAddress: NULL_ADDRESS,
        feeRecipientAddress: NULL_ADDRESS,
        senderAddress: NULL_ADDRESS,
        makerAssetAmount: orderData.makerAssetAmount,
        takerAssetAmount: orderData.takerAssetAmount,
        makerFee: new BigNumber(0),
        takerFee: new BigNumber(0),
        expirationTimeSeconds: orderData.expirationTimeSeconds,
        salt: orderData.salt,
        makerAssetData: orderData.makerAssetData,
        takerAssetData: orderData.takerAssetData,
        makerFeeAssetData: '0x',
        takerFeeAssetData: '0x',
      };
    });

    const signatures = _.map(ordersData, orderData => {
      return orderData.signature;
    });

    return { orders, signatures, orderIds, loopLimit, gasLimit };
  }

  async checkIfTradeValid(
    params: ZeroXPlaceTradeParams
  ): Promise<string | null> {
    if (params.outcome >= params.numOutcomes) {
      return 'Invalid outcome given for trade: ${params.outcome.toString()}. Must be between 0 and ${params.numOutcomes.toString()}';
    }
    if (params.price.lte(0) || params.price.gte(params.numTicks)) {
      return `Invalid price given for trade: ${params.price.toString()}. Must be between 0 and ${params.numTicks.toString()}`;
    }

    const amountNotCoveredByShares = params.amount.minus(params.shares);

    const cost =
      params.direction === 0
        ? params.price.multipliedBy(amountNotCoveredByShares)
        : params.numTicks
            .minus(params.price)
            .multipliedBy(amountNotCoveredByShares);

    if (cost.gt(0)) {
      const account = await this.client.getAccount();
      if (!account) return null;
      const cashAllowance = await this.client.contracts.cash.allowance_(
        account,
        this.client.contracts.augur.address
      );
      if (cashAllowance.lt(cost)) {
        return `Cash allowance: ${cashAllowance.toString()} will not cover trade cost: ${cost.toString()}`;
      }

      const cashBalance = await this.client.contracts.cash.balanceOf_(account);
      if (cashBalance.lt(cost)) {
        return `Cash balance: ${cashBalance.toString()} will not cover trade cost: ${cost.toString()}`;
      }
    }

    return null;
  }

  private getTradeAmountRemaining(
    account,
    tradeOnChainAmountRemaining: BigNumber,
    events: Event[]
  ): BigNumber {
    let amountRemaining = tradeOnChainAmountRemaining;
    for (const event of events) {
      if (
        event.name === 'Fill' &&
        (event.parameters as ExchangeFillEvent).makerAddress === account
      ) {
        const onChainAmountFilled = (event.parameters as ExchangeFillEvent)
          .makerAssetFilledAmount;
        console.log(`Fill event detected. Amount Filled: ${onChainAmountFilled.toFixed()}`);
        amountRemaining = amountRemaining.minus(onChainAmountFilled);
      }
      if (event.name === 'OrderEvent') {
        const eventParams = event.parameters as OrderEventLog;
        if (eventParams.eventType === 0) {
          // Create
          return new BigNumber(0);
        } else if (eventParams.eventType === 2) {
          // Fill
          const onChainAmountFilled =
            eventParams.uint256Data[OrderEventUint256Value.amountFilled];
          amountRemaining = amountRemaining.minus(onChainAmountFilled);
        }
      }
    }
    return amountRemaining;
  }

  getTradeTransactionLimits(
    params: NativePlaceTradeChainParams,
    numOrders: number,
  ): TradeTransactionLimits {
    let loopLimit = new BigNumber(1);
    let gasLimit = WORST_CASE_FILL[params.numOutcomes];
    numOrders--;
    while (
      gasLimit
        .plus(NORMAL_FILL[params.numOutcomes])
        .lt(MAX_GAS_LIMIT_FOR_TRADE) &&
      loopLimit.lt(MAX_FILLS_PER_TX) &&
      numOrders > 0
    ) {
      loopLimit = loopLimit.plus(1);
      gasLimit = gasLimit.plus(NORMAL_FILL[params.numOutcomes]);
      numOrders--;
    }
    return {
      loopLimit,
      gasLimit,
    };
  }

  async simulateTradeGasLimit(
    params: ZeroXPlaceTradeDisplayParams
  ): Promise<BigNumber> {
    const onChainTradeParams = this.getOnChainTradeParams(params);

    const orderType = params.direction === 0 ? '1' : '0';
    const price = new BN(onChainTradeParams.price.toString()).toHexString().substr(2);

    const zeroXOrders = await this.client.getZeroXOrders({
      marketId: params.market,
      outcome: params.outcome,
      orderType,
      matchPrice: `0x${price.padStart(20, '0')}`,
      ignoreOrders: [],
    });

    const { gasLimit } = await this.getTradeTransactionLimits(
      onChainTradeParams,
      _.size(zeroXOrders)
    );
    return gasLimit;
  }
}
