import { BigNumber } from "bignumber.js";
import { convertDisplayAmountToOnChainAmount, convertDisplayPriceToOnChainPrice, convertOnChainAmountToDisplayAmount, QUINTILLION, numTicksToTickSizeWithDisplayPrices } from '../utils';
import * as _ from "lodash";
import { NULL_ADDRESS } from '../constants';
import * as constants from '../constants';
import { Augur } from './../Augur';
import { Event } from '@augurproject/core/build/libraries/ContractInterfaces';
import { PlaceTradeDisplayParams, PlaceTradeChainParams, TradeTransactionLimits } from './Trade';
import { OrderEventLog, OrderEventUint256Value } from '../state/logs/types';
import { OrderInfo, WSClient, OrderEvent } from '@0x/mesh-rpc-client';
import { signatureUtils } from '@0x/order-utils';
import { Web3ProviderEngine } from '@0x/subproviders';
import { SignerSubprovider } from "../zeroX/SignerSubprovider";
import { ProviderSubprovider } from "../zeroX/ProviderSubprovider";

export interface ZeroXPlaceTradeDisplayParams extends PlaceTradeDisplayParams {
  expirationTime: BigNumber;
}

export interface ZeroXPlaceTradeParams extends PlaceTradeChainParams {
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
}

export interface MatchingOrders {
  orders: ZeroXTradeOrder[];
  signatures: string[];
  orderIds: string[];
}

export class ZeroX {
  private readonly augur: Augur;
  private readonly meshClient: WSClient;
  private readonly providerEngine: Web3ProviderEngine;

  constructor(augur: Augur, meshClient: WSClient) {
    this.augur = augur;
    this.meshClient = meshClient;
    this.providerEngine = new Web3ProviderEngine();
    this.providerEngine.addProvider(new SignerSubprovider(this.augur.signer));
    this.providerEngine.addProvider(new ProviderSubprovider(this.augur.provider));
    this.providerEngine.start();
  }

  async subscribeToMeshEvents(callback: (orderEvents: OrderEvent[]) => void): Promise<void> {
    await this.meshClient.subscribeToOrdersAsync(callback);
  }

  async placeTrade(params: ZeroXPlaceTradeDisplayParams): Promise<void> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    return this.placeOnChainTrade(onChainTradeParams);
  }

  getOnChainTradeParams(params: ZeroXPlaceTradeDisplayParams): ZeroXPlaceTradeParams {
    const tickSize = numTicksToTickSizeWithDisplayPrices(params.numTicks, params.displayMinPrice, params.displayMaxPrice);
    const onChainAmount = convertDisplayAmountToOnChainAmount(params.displayAmount, tickSize);
    const onChainPrice = convertDisplayPriceToOnChainPrice(params.displayPrice, params.displayMinPrice, tickSize);
    const onChainShares = convertDisplayAmountToOnChainAmount(params.displayShares, tickSize);
    return Object.assign(params, {
      amount: onChainAmount,
      price: onChainPrice,
      shares: onChainShares,
    });
  }

  async placeOnChainTrade(params: ZeroXPlaceTradeParams, ignoreOrders?: string[]): Promise<void> {
    const invalidReason = await this.checkIfTradeValid(params);
    if (invalidReason) throw new Error(invalidReason);

    const { orders, signatures, orderIds } = await this.getMatchingOrders(params, ignoreOrders);

    if (_.size(orders) < 1 && !params.doNotCreateOrders) {
      await this.placeOnChainOrder(params);
      return;
    }

    // Update list of used order ids
    ignoreOrders = orderIds.concat(ignoreOrders || []);

    let result: Event[] = [];

    result = await this.augur.contracts.ZeroXTrade.trade(
      params.amount,
      params.affiliateAddress,
      params.tradeGroupId,
      orders,
      signatures);

    const amountRemaining = this.getTradeAmountRemaining(params.amount, result);
    if (amountRemaining.gt(0)) {
      params.amount = amountRemaining;
      // On successive iterations we specify previously taken signed orders since its possible we do another loop before the mesh has updated our view on the orderbook
      return this.placeOnChainTrade(params, orderIds);
    }
  }

  async placeOrder(params: ZeroXPlaceTradeDisplayParams): Promise<string> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    return await this.placeOnChainOrder(onChainTradeParams);
  }

  async placeOnChainOrder(params: ZeroXPlaceTradeParams): Promise<string> {
    const salt = new BigNumber(Date.now());
    const result = await this.augur.contracts.ZeroXTrade.createZeroXOrder_(
      new BigNumber(params.direction),
      params.amount,
      params.price,
      params.market,
      new BigNumber(params.outcome),
      params.kycToken,
      params.expirationTime,
      this.augur.addresses.ZeroXExchange,
      salt
    );
    const signedOrder: any[] = result[0];
    const orderHash: string = result[1];
    const makerAddress: string = signedOrder[0];
    const signature = await this.signOrderHash(orderHash, makerAddress);
    const zeroXOrder = {
      makerAddress,
      takerAddress: signedOrder[1],
      feeRecipientAddress: signedOrder[2],
      senderAddress: signedOrder[3],
      makerAssetAmount: new BigNumber(signedOrder[4]._hex),
      takerAssetAmount: new BigNumber(signedOrder[5]._hex),
      makerFee: new BigNumber(signedOrder[6]._hex),
      takerFee: new BigNumber(signedOrder[7]._hex),
      expirationTimeSeconds: new BigNumber(signedOrder[8]._hex),
      salt: new BigNumber(signedOrder[9]._hex),
      makerAssetData: signedOrder[10],
      takerAssetData: signedOrder[11],
      signature,
      exchangeAddress: NULL_ADDRESS,
      orderHash
    }
    await this.meshClient.addOrdersAsync([zeroXOrder]);
    return orderHash;
  }

  async signOrderHash(orderHash: string, maker: string): Promise<string> {
    const signature = await signatureUtils.ecSignHashAsync(this.providerEngine, orderHash, maker);
    return signature;
  }

  async simulateTrade(params: ZeroXPlaceTradeDisplayParams): Promise<ZeroXSimulateTradeData> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    const { orders, signatures, orderIds } = await this.getMatchingOrders(onChainTradeParams, []);
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
      }
    } else {
      simulationData = await this.augur.contracts.simulateTrade.simulateZeroXTrade_(orders, onChainTradeParams.amount, params.doNotCreateOrders) as unknown as BigNumber[];
    }
    const tickSize = numTicksToTickSizeWithDisplayPrices(params.numTicks, params.displayMinPrice, params.displayMaxPrice);
    const displaySharesFilled = convertOnChainAmountToDisplayAmount(simulationData[0], tickSize);
    const displaySharesDepleted = convertOnChainAmountToDisplayAmount(simulationData[2], tickSize);
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
    const price = params.direction == 0 ? params.price : params.numTicks.minus(params.price);
    const tokensDepleted = params.amount.minus(sharesDepleted).multipliedBy(price);
    return [
      new BigNumber(0),
      tokensDepleted,
      sharesDepleted,
      new BigNumber(0),
      new BigNumber(0),
    ]
  }

  // TODO a more specific getter for this that does a lot of the processing below would likely be more appropriate
  async getMatchingOrders(params: ZeroXPlaceTradeParams, ignoreOrders?: string[]): Promise<MatchingOrders> {
    const orderType = params.direction == 0 ? "1" : "0";
    const outcome = params.outcome.toString();
    let zeroXOrders = await this.augur.getZeroXOrders({
      marketId: params.market,
      outcome: params.outcome,
      orderType,
      matchPrice: `0x${params.price.toString(16).padStart(60, "0")}`,
      ignoreOrders
    });

    if (_.size(zeroXOrders) < 1) {
      return { orders: [], signatures: [], orderIds: []};
    }

    const ordersMap = zeroXOrders[params.market][outcome][orderType];
    let sortedOrders = _.sortBy(_.values(ordersMap), (order) =>{ return order.price });

    const { loopLimit, gasLimit } = this.getTradeTransactionLimits(params);

    const ordersData = params.direction == 0 ? _.take(sortedOrders, loopLimit.toNumber()) : _.takeRight(sortedOrders, loopLimit.toNumber());

    let orderIds = _.map(ordersData, (orderData) => {
      return orderData.orderId;
    });

    const orders: ZeroXTradeOrder[] = _.map(ordersData, (orderData) => {
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
      };
    })

    const signatures = _.map(ordersData, (orderData) => {
      return orderData.signature;
    });

    return { orders, signatures, orderIds };
  }

  async checkIfTradeValid(params: ZeroXPlaceTradeParams): Promise<string | null> {
    if (params.outcome >= params.numOutcomes) return `Invalid outcome given for trade: ${params.outcome.toString()}. Must be between 0 and ${params.numOutcomes.toString()}`;
    if (params.price.lte(0) || params.price.gte(params.numTicks)) return `Invalid price given for trade: ${params.price.toString()}. Must be between 0 and ${params.numTicks.toString()}`;

    const amountNotCoveredByShares = params.amount.minus(params.shares);
    const cost = params.direction == 0 ? params.price.multipliedBy(amountNotCoveredByShares) : params.numTicks.minus(params.price).multipliedBy(amountNotCoveredByShares);

    if (cost.gt(0)) {
      const account = await this.augur.getAccount();
      if (!account) return null;
      const cashAllowance = await this.augur.contracts.cash.allowance_(account, this.augur.contracts.augur.address);
      if (cashAllowance.lt(cost)) return `Cash allowance: ${cashAllowance.toString()} will not cover trade cost: ${cost.toString()}`;

      const cashBalance = await this.augur.contracts.cash.balanceOf_(account);
      if (cashBalance.lt(cost)) return `Cash balance: ${cashBalance.toString()} will not cover trade cost: ${cost.toString()}`;
    }

    return null;
  }

  private getTradeAmountRemaining(tradeOnChainAmountRemaining: BigNumber, events: Event[]): BigNumber {
    let amountRemaining = tradeOnChainAmountRemaining;
    for (const event of events) {
      if (event.name === "OrderEvent") {
        const eventParams = event.parameters as OrderEventLog;
        if (eventParams.eventType === 0) { // Create
          return new BigNumber(0);
        } else if (eventParams.eventType === 2) {// Fill
          const onChainAmountFilled = eventParams.uint256Data[OrderEventUint256Value.amountFilled];
          amountRemaining = amountRemaining.minus(onChainAmountFilled);
        }
      }
    }
    return amountRemaining;
  }

  getTradeTransactionLimits(params: PlaceTradeChainParams): TradeTransactionLimits {
    let loopLimit = new BigNumber(1);
    const placeOrderGas = params.shares.gt(0) ? constants.PLACE_ORDER_WITH_SHARES[params.numOutcomes] : constants.PLACE_ORDER_NO_SHARES[params.numOutcomes];
    const orderCreationCost = params.doNotCreateOrders ? new BigNumber(0) : placeOrderGas;
    let gasLimit = orderCreationCost.plus(constants.WORST_CASE_FILL[params.numOutcomes]);
    while (gasLimit.plus(constants.WORST_CASE_FILL[params.numOutcomes]).lt(constants.MAX_GAS_LIMIT_FOR_TRADE) && loopLimit.lt(constants.MAX_FILLS_PER_TX)) {
      loopLimit = loopLimit.plus(1);
      gasLimit = gasLimit.plus(constants.WORST_CASE_FILL[params.numOutcomes]);
    }
    gasLimit = gasLimit.plus(constants.TRADE_GAS_BUFFER);
    return {
      loopLimit,
      gasLimit,
    };
  }

  async getOrders(): Promise<OrderInfo[]> {
    return await this.meshClient.getOrdersAsync();
  }
}
