import {
  OrderEvent,
  OrderInfo,
  ValidationResults,
  WSClient,
} from '@0x/mesh-rpc-client';
import { SignatureType, SignedOrder } from '@0x/types';
import { Event } from '@augurproject/core/build/libraries/ContractInterfaces';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import * as constants from '../constants';
import { NULL_ADDRESS } from '../constants';
import { OrderEventLog, OrderEventUint256Value } from '../state/logs/types';
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  convertOnChainAmountToDisplayAmount,
  numTicksToTickSizeWithDisplayPrices,
  QUINTILLION,
} from '../utils';
import { Augur } from './../Augur';
import {
  NativePlaceTradeDisplayParams,
  NativePlaceTradeChainParams,
  TradeTransactionLimits,
} from './OnChainTrade';
import { ethers } from 'ethers';


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
  addOrdersAsync(orders: SignedOrder[]): Promise<ValidationResults>;
}

export interface ZeroXPlaceTradeDisplayParams extends NativePlaceTradeDisplayParams {
  expirationTime: BigNumber;
}

export interface ZeroXPlaceTradeParams extends NativePlaceTradeChainParams {
  expirationTime: BigNumber;
}

export interface ZeroXOrder {
  amount: BigNumber;
  displayPrice: BigNumber;
  owner: string;
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
}

export class ZeroX {
  private readonly augur: Augur;
  private readonly meshClient: WSClient;
  private readonly browserMesh: BrowserMesh;

  constructor(augur: Augur, meshClient?: WSClient, browserMesh?: BrowserMesh) {
    if (!(browserMesh || meshClient)) {
      throw Error('ZeroX instance mush have browserMesh, meshClient, or both');
    }

    this.augur = augur;
    this.meshClient = meshClient;
    this.browserMesh = browserMesh;
    if (this.browserMesh) {
      this.browserMesh.startAsync();
    }
  }

  async subscribeToMeshEvents(
    callback: (orderEvents: OrderEvent[]) => void
  ): Promise<void> {
    if (this.browserMesh) {
      await this.browserMesh.onOrderEvents(callback);
    } else {
      await this.meshClient.subscribeToOrdersAsync(callback);
    }
  }

  async getOrders(): Promise<OrderInfo[]> {
    // TODO when browser mesh supports this back out to using it if meshClient not provided
    if (!this.meshClient) {
      throw Error('getOrders is not supported on browser mesh');
    }
    return this.meshClient.getOrdersAsync();
  }

  async placeTrade(params: ZeroXPlaceTradeDisplayParams): Promise<void> {
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
  ): Promise<void> {
    const invalidReason = await this.checkIfTradeValid(params);
    if (invalidReason) throw new Error(invalidReason);

    const { orders, signatures, orderIds } = await this.getMatchingOrders(
      params,
      ignoreOrders
    );

    const numOrders = _.size(orders);

    if (numOrders < 1 && !params.doNotCreateOrders) {
      await this.placeOnChainOrder(params);
      return;
    }

    // Update list of used order ids
    ignoreOrders = orderIds.concat(ignoreOrders || []);

    let result: Event[] = [];

    const gasPrice = await this.augur.getGasPrice();

    const protocolFee = gasPrice.multipliedBy(150000 * numOrders);

    result = await this.augur.contracts.ZeroXTrade.trade(
      params.amount,
      params.fingerprint,
      params.tradeGroupId,
      orders,
      signatures,
      { attachedEth: protocolFee }
    );

    const amountRemaining = this.getTradeAmountRemaining(params.amount, result);
    if (amountRemaining.gt(0)) {
      params.amount = amountRemaining;
      // On successive iterations we specify previously taken signed orders since its possible we do another loop before the mesh has updated our view on the orderbook
      return this.placeOnChainTrade(params, orderIds);
    }
  }

  async placeOrder(params: ZeroXPlaceTradeDisplayParams): Promise<string> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    return this.placeOnChainOrder(onChainTradeParams);
  }

  async placeOnChainOrder(params: ZeroXPlaceTradeParams): Promise<string> {
    const { order, hash }  = await this.createZeroXOrder(params);
    const validation = await this.addOrder(order);
    if (validation.rejected.length > 0) {
      console.log(JSON.stringify(validation.rejected, null, 2));
      throw Error(
        `0x add order validation failure: ${JSON.stringify(
          validation.rejected[0]
        )}`
      );
    }

    return hash;
  }

  async createZeroXOrder(params: ZeroXPlaceTradeParams) {
    const salt = new BigNumber(Date.now());
    const result = await this.augur.contracts.ZeroXTrade.createZeroXOrder_(
      new BigNumber(params.direction),
      params.amount,
      params.price,
      params.market,
      new BigNumber(params.outcome),
      params.kycToken,
      params.expirationTime,
      salt
    );
    const order = result[0];
    const hash = result[1];
    const gnosisSafeAddress: string = order[0];
    const signature = await this.signOrder(order, hash);

    return {
      order: {
        chainId: Number(this.augur.networkId),
        exchangeAddress: this.augur.addresses.Exchange,
        makerAddress: gnosisSafeAddress,
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
      },
      hash,
    };
  }

  async signOrder(signedOrder: any, orderHash: string): Promise<string> {
    const gnosisSafeAddress: string = signedOrder[0];

    const gnosisSafe = this.augur.contracts.gnosisSafeFromAddress(gnosisSafeAddress);

    const eip1271OrderWithHash = await this.augur.contracts.ZeroXTrade.encodeEIP1271OrderWithHash_(signedOrder, orderHash);
    const messageHash = await gnosisSafe.getMessageHash_(eip1271OrderWithHash);

    const signatureType = '07'; // in v3 this is EIP1271Wallet

    const signedMessage = await this.augur.signMessage(messageHash);
    const {r, s, v} = ethers.utils.splitSignature(signedMessage);
    return `0x${r.slice(2)}${s.slice(2)}${(v+4).toString(16)}${signatureType}`;
  }

  async addOrder(order) {
    if (this.browserMesh) {
      return this.browserMesh.addOrdersAsync([order]);
    } else {
      return this.meshClient.addOrdersAsync([order]);
    }
  }

  async simulateTrade(
    params: ZeroXPlaceTradeDisplayParams
  ): Promise<ZeroXSimulateTradeData> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    const { orders, signatures, orderIds } = await this.getMatchingOrders(
      onChainTradeParams,
      []
    );
    let simulationData: BigNumber[];
    if (orders.length < 1 && !params.doNotCreateOrders) {
      simulationData = await this.simulateMakeOrder(onChainTradeParams);
    } else if (orders.length < 1) {
      return {
        sharesFilled: new BigNumber(0),
        tokensDepleted: new BigNumber(0),
        sharesDepleted: new BigNumber(0),
        settlementFees: new BigNumber(0),
        numFills: new BigNumber(0),
      };
    } else {
      simulationData = ((await this.augur.contracts.simulateTrade.simulateZeroXTrade_(
        orders,
        onChainTradeParams.amount,
        params.doNotCreateOrders
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
    };
  }

  simulateMakeOrder(params: ZeroXPlaceTradeParams): BigNumber[] {
    const sharesDepleted = BigNumber.min(params.shares, params.amount);
    const price =
      params.direction == 0
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
    const orderType = params.direction == 0 ? '1' : '0';
    const outcome = params.outcome.toString();
    const zeroXOrders = await this.augur.getZeroXOrders({
      marketId: params.market,
      outcome: params.outcome,
      orderType,
      matchPrice: `0x${params.price.toString(16).padStart(60, '0')}`,
      ignoreOrders,
    });

    if (_.size(zeroXOrders) < 1) {
      return { orders: [], signatures: [], orderIds: [] };
    }

    const ordersMap = zeroXOrders[params.market][outcome][orderType];
    const sortedOrders = _.sortBy(_.values(ordersMap), order => {
      return order.price;
    });

    const { loopLimit, gasLimit } = this.getTradeTransactionLimits(params);

    const ordersData =
      params.direction == 0
        ? _.take(sortedOrders, loopLimit.toNumber())
        : _.takeRight(sortedOrders, loopLimit.toNumber());

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

    return { orders, signatures, orderIds };
  }

  async checkIfTradeValid(
    params: ZeroXPlaceTradeParams
  ): Promise<string | null> {
    if (params.outcome >= params.numOutcomes) {
      return `Invalid outcome given for trade: ${params.outcome.toString()}. Must be between 0 and ${params.numOutcomes.toString()}`;
    }
    if (params.price.lte(0) || params.price.gte(params.numTicks)) {
      return `Invalid price given for trade: ${params.price.toString()}. Must be between 0 and ${params.numTicks.toString()}`;
    }

    const amountNotCoveredByShares = params.amount.minus(params.shares);
    const cost =
      params.direction == 0
        ? params.price.multipliedBy(amountNotCoveredByShares)
        : params.numTicks
            .minus(params.price)
            .multipliedBy(amountNotCoveredByShares);

    if (cost.gt(0)) {
      const account = await this.augur.getAccount();
      if (!account) return null;
      const cashAllowance = await this.augur.contracts.cash.allowance_(
        account,
        this.augur.contracts.augur.address
      );
      if (cashAllowance.lt(cost)) {
        return `Cash allowance: ${cashAllowance.toString()} will not cover trade cost: ${cost.toString()}`;
      }

      const cashBalance = await this.augur.contracts.cash.balanceOf_(account);
      if (cashBalance.lt(cost)) {
        return `Cash balance: ${cashBalance.toString()} will not cover trade cost: ${cost.toString()}`;
      }
    }

    return null;
  }

  private getTradeAmountRemaining(
    tradeOnChainAmountRemaining: BigNumber,
    events: Event[]
  ): BigNumber {
    let amountRemaining = tradeOnChainAmountRemaining;
    for (const event of events) {
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
    params: NativePlaceTradeChainParams
  ): TradeTransactionLimits {
    let loopLimit = new BigNumber(1);
    const placeOrderGas = params.shares.gt(0)
      ? constants.PLACE_ORDER_WITH_SHARES[params.numOutcomes]
      : constants.PLACE_ORDER_NO_SHARES[params.numOutcomes];
    const orderCreationCost = params.doNotCreateOrders
      ? new BigNumber(0)
      : placeOrderGas;
    let gasLimit = orderCreationCost.plus(
      constants.WORST_CASE_FILL[params.numOutcomes]
    );
    while (
      gasLimit
        .plus(constants.WORST_CASE_FILL[params.numOutcomes])
        .lt(constants.MAX_GAS_LIMIT_FOR_TRADE) &&
      loopLimit.lt(constants.MAX_FILLS_PER_TX)
    ) {
      loopLimit = loopLimit.plus(1);
      gasLimit = gasLimit.plus(constants.WORST_CASE_FILL[params.numOutcomes]);
    }
    gasLimit = gasLimit.plus(constants.TRADE_GAS_BUFFER);
    return {
      loopLimit,
      gasLimit,
    };
  }

  async simulateTradeGasLimit(params: ZeroXPlaceTradeDisplayParams): Promise<BigNumber> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    const { gasLimit } = await this.getTradeTransactionLimits(onChainTradeParams);
    return gasLimit;
  }
}
