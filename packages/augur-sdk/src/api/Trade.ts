import { Provider } from '../ethereum/Provider';
import { Contracts } from './Contracts';
import { BigNumber } from "bignumber.js";
import { numTicksToTickSize, convertDisplayAmountToOnChainAmount, convertDisplayPriceToOnChainPrice } from '../utils';
import * as _ from "lodash";
import * as constants from '../constants';
import { Augur } from './../Augur';
import { Event } from '@augurproject/core/build/libraries/ContractInterfaces';
import { OrderEventLog, OrderEventUint256Value } from '../state/logs/types';

// XXX TEMP for better worse order ids
export function stringTo32ByteHex(stringToEncode: string): string {
  return `0x${Buffer.from(stringToEncode, 'utf8').toString('hex').padEnd(64, '0')}`;
}

export interface GenericCallback {
  (result: any): any
}

export interface PlaceTradeParams {
  direction: 0 | 1,
  market: string,
  numTicks: BigNumber,
  numOutcomes: 3 | 4 | 5 | 6 | 7 | 8
  outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
  tradeGroupId: string,
  ignoreShares: boolean,
  affiliateAddress: string,
  kycToken: string,
  doNotCreateOrders: boolean,
  onSuccess: GenericCallback,
  onFailed: GenericCallback,
  onSent?: GenericCallback
};

export interface PlaceTradeDisplayParams extends PlaceTradeParams {
  minPrice: BigNumber,
  maxPrice: BigNumber,
  displayAmount: BigNumber,
  displayPrice: BigNumber,
  displayShares: BigNumber,
};

export interface PlaceTradeChainParams extends PlaceTradeParams {
  amount: BigNumber,
  price: BigNumber,
  shares: BigNumber,
};

export interface TradeTransactionLimits {
  loopLimit: BigNumber,
  gasLimit: BigNumber,
}

export class Trade {
  private readonly augur: Augur;

  public constructor (augur: Augur) {
    this.augur = augur;
  }

  public async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    return await this.placeOnChainTrade(onChainTradeParams);
  }

  public getOnChainTradeParams(params: PlaceTradeDisplayParams): PlaceTradeChainParams {
    const tickSize = numTicksToTickSize(params.numTicks, params.minPrice, params.maxPrice);
    const onChainAmount = convertDisplayAmountToOnChainAmount(params.displayAmount, tickSize);
    const onChainPrice = convertDisplayPriceToOnChainPrice(params.displayPrice, params.minPrice, tickSize);
    const onChainShares = convertDisplayAmountToOnChainAmount(params.displayShares, tickSize);
    return Object.assign(params, {
      amount: onChainAmount,
      price: onChainPrice,
      shares: onChainShares,
    })
  }

  public async placeOnChainTrade(params: PlaceTradeChainParams): Promise<void> {
    const invalidReason = await this.checkIfTradeValid(params);
    if (invalidReason) return params.onFailed(invalidReason);

    const { loopLimit, gasLimit } = this.getTradeTransactionLimits(params);

    let result: Array<Event> = [];

    if (params.onSent) params.onSent(params);
    // TODO: Use the calculated gasLimit above instead of relying on an estimate once we can send an override gasLimit
    try {
      if (params.doNotCreateOrders) {
        result = await this.augur.contracts.trade.publicFillBestOrder(new BigNumber(params.direction), params.market, new BigNumber(params.outcome), params.amount, params.price, params.tradeGroupId, loopLimit, params.ignoreShares, params.affiliateAddress, params.kycToken);
      } else {
        // TODO: Use the state provided better worse orders
        const nullOrderId = stringTo32ByteHex("");
        result = await this.augur.contracts.trade.publicTrade(new BigNumber(params.direction), params.market, new BigNumber(params.outcome), params.amount, params.price, nullOrderId, nullOrderId, params.tradeGroupId, loopLimit, params.ignoreShares, params.affiliateAddress, params.kycToken);
      }
    } catch (e) {
      return params.onFailed(`Failed with error: ${JSON.stringify(e)}`)
    }

    params.onSuccess(result);

    const amountRemaining = this.getTradeAmountRemaining(result);
    if (amountRemaining.gt(0)) {
      params.amount = amountRemaining;
      return await this.placeOnChainTrade(params);
    }
  }

  public async checkIfTradeValid(params: PlaceTradeChainParams): Promise<string | null> {
    if (params.outcome >= params.numOutcomes) return `Invalid outcome given for trade: ${params.outcome.toString()}. Must be between 0 and ${params.numOutcomes.toString()}`;
    if (params.price.lte(0) || params.price.gte(params.numTicks)) return `Invalid price given for trade: ${params.price.toString()}. Must be between 0 and ${params.numTicks.toString()}`;

    const amountNotCoveredByShares = params.amount.minus(params.shares);
    const cost = params.direction == 0 ? params.price.multipliedBy(amountNotCoveredByShares) : params.numTicks.minus(params.price).multipliedBy(amountNotCoveredByShares);

    if (cost.gt(0)) {
      const account = await this.augur.getAccount();
      const cashAllowance = await this.augur.contracts.cash.allowance_(account, this.augur.contracts.augur.address);
      if (cashAllowance.lt(cost)) return `Cash allowance: ${cashAllowance.toString()} will not cover trade cost: ${cost.toString()}`;

      const cashBalance = await this.augur.contracts.cash.balanceOf_(account);
      if (cashBalance.lt(cost)) return `Cash balance: ${cashBalance.toString()} will not cover trade cost: ${cost.toString()}`;
    }

    return null;
  }

  public getTradeTransactionLimits(params: PlaceTradeChainParams): TradeTransactionLimits {
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
      gasLimit
    }
  }

  private getTradeAmountRemaining(events: Array<Event>): BigNumber {
    let tradeOnChainAmountRemaining = new BigNumber(0);
    for (let event of events) {
      if (event.name == "OrderEvent") {
        const eventParams = <OrderEventLog>event.parameters;
        if (eventParams.eventType === 0) { // Create
          return new BigNumber(0);
        } else if (eventParams.eventType === 3) {// Fill
          var onChainAmountFilled = eventParams.uint256Data[OrderEventUint256Value.amountFilled];
          tradeOnChainAmountRemaining = tradeOnChainAmountRemaining.minus(onChainAmountFilled);
        }
      }
    }
    return tradeOnChainAmountRemaining;
  }
}
