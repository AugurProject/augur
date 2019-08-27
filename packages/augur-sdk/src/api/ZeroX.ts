import { BigNumber } from "bignumber.js";
import { convertDisplayAmountToOnChainAmount, convertDisplayPriceToOnChainPrice, convertOnChainAmountToDisplayAmount, QUINTILLION, numTicksToTickSizeWithDisplayPrices } from '../utils';
import * as _ from "lodash";
import { NULL_ADDRESS } from '../constants';
import { Augur } from './../Augur';
import { Event } from '@augurproject/core/build/libraries/ContractInterfaces';
import { PlaceTradeDisplayParams, PlaceTradeChainParams } from './Trade';
import { OrderEventLog, OrderEventUint256Value } from '../state/logs/types';
import { OrderInfo, WSClient } from '@0x/mesh-rpc-client';

export interface ZeroXPlaceTradeParams extends PlaceTradeDisplayParams {
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

export class ZeroX {
  private readonly augur: Augur;
  private readonly meshClient: WSClient;

  constructor(augur: Augur, meshClient: WSClient) {
    this.augur = augur;
    this.meshClient = meshClient;
  }

  async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    return this.placeOnChainTrade(onChainTradeParams);
  }

  getOnChainTradeParams(params: PlaceTradeDisplayParams): PlaceTradeChainParams {
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

  async placeOnChainTrade(params: PlaceTradeChainParams): Promise<void> {
    const invalidReason = await this.checkIfTradeValid(params);
    if (invalidReason) throw new Error(invalidReason);

    let result: Event[] = [];

    const orders = this.augur.getZeroXOrders({});
    // TODO
    // Get matching orders
    // If no matching orders & !params.doNotCreateOrders:
    //   create order
    //   this.meshClient.addOrderAsync
    // Iterate through gas estimates for progressively more fills
    // Send tx
    // If response has amount remaining > 0 go again

    const amountRemaining = this.getTradeAmountRemaining(params.amount, result);
    if (amountRemaining.gt(0)) {
      params.amount = amountRemaining;
      return this.placeOnChainTrade(params);
    }
  }

  async placeOrder(params: ZeroXPlaceTradeParams): Promise<string> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    const salt = new BigNumber(Date.now());
    const result = await this.augur.contracts.zeroXTradeToken.createZeroXOrder_(
      new BigNumber(params.direction),
      onChainTradeParams.amount,
      onChainTradeParams.price,
      params.market,
      new BigNumber(params.outcome),
      params.kycToken,
      params.expirationTime,
      salt
    );
    const signedOrder: any[] = result[0];
    const orderHash: string = result[1];
    const signature = await this.augur.signMessage(orderHash);
    const zeroXOrder = {
      makerAddress: signedOrder[0],
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

  async simulateTrade(params: PlaceTradeDisplayParams): Promise<ZeroXSimulateTradeData> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    const tickSize = numTicksToTickSizeWithDisplayPrices(params.numTicks, params.displayMinPrice, params.displayMaxPrice);
    // TODO simulate 0x trade
    const simulationData: BigNumber[] = await this.augur.contracts.simulateTrade.simulateTrade_(new BigNumber(params.direction), params.market, new BigNumber(params.outcome), onChainTradeParams.amount, onChainTradeParams.price, params.kycToken, params.doNotCreateOrders) as unknown as BigNumber[];
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

  async checkIfTradeValid(params: PlaceTradeChainParams): Promise<string | null> {
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

  async getOrders(): Promise<OrderInfo[]> {
    return await this.meshClient.getOrdersAsync();
  }
}
