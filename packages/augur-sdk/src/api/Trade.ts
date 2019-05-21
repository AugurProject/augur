import { Provider } from '../ethereum/Provider';
import { Contracts } from './Contracts';
import { BigNumber } from "bignumber.js";
import { numTicksToTickSize, convertDisplayAmountToOnChainAmount, convertDisplayPriceToOnChainPrice } from '../utils';
import * as _ from "lodash";
import * as constants from '../constants';

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
  onSent: GenericCallback
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
  private readonly provider: Provider;
  private readonly contracts: Contracts;

  public constructor (provider: Provider, contracts: Contracts) {
    this.provider = provider;
    this.contracts = contracts;
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

    const txParams = {
      _direction: params.direction,
      _market: params.market,
      _outcome: params.outcome,
      _amount: params.amount,
      _price: params.price,
      _betterOrderId: "0x0",
      _worseOrderId: "0x0",
      _tradeGroupId: params.tradeGroupId,
      _loopLimit: loopLimit,
      _ignoreShares: params.ignoreShares,
      _affiliateAddress: params.affiliateAddress,
      _kycToken: params.kycToken
    };

    // const result = params.doNotCreateOrders ? this.contracts.trade.publicFillBestOrder(txParams) : this.contracts.trade.publicTrade(txParams);
    // wait on tx results
    //   if still amount call trade again
  }

  public async checkIfTradeValid(params: PlaceTradeChainParams): Promise<string | null> {
    if (params.price.lte(0) || params.price.gte(params.numTicks)) return `Invalid price given for trade: ${params.price.toString()}. Must be between 0 and ${params.numTicks.toString()}`;

    const amountNotCoveredByShares = params.amount.minus(params.shares);
    const cost = params.direction == 0 ? params.price.multipliedBy(amountNotCoveredByShares) : params.numTicks.minus(params.price).multipliedBy(amountNotCoveredByShares);

    if (cost.gt(0)) {
      const cashAllowance = await this.contracts.cash.allowance_("this.account", this.contracts.augur.address); // XXX account
      if (cashAllowance.lt(cost)) return `Cash allowance: ${cashAllowance.toString()} will not cover trade cost: ${cost.toString()}`;

      const cashBalance = await this.contracts.cash.balanceOf_("this.account"); // XXX account
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
}
