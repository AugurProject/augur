import { BigNumber } from 'bignumber.js';
import { convertDisplayAmountToOnChainAmount, convertDisplayPriceToOnChainPrice, numTicksToTickSizeWithDisplayPrices } from '../utils';
import { Augur } from './../Augur';
import {
  OnChainTrade,
  NativePlaceTradeChainParams,
  NativePlaceTradeDisplayParams,
  NativePlaceTradeParams
} from './OnChainTrade';
import { ZeroX, ZeroXSimulateTradeData } from './ZeroX';

export interface TradeAPI {
  useZeroX(): boolean
  simulateTrade(params: PlaceTradeDisplayParams): Promise<SimulateTradeData>
  simulateTradeGasLimit(params: NativePlaceTradeDisplayParams): Promise<BigNumber>
  placeTrade(params: PlaceTradeDisplayParams): Promise<void>
}

export interface SimulateTradeData extends ZeroXSimulateTradeData {
  loopLimit?: BigNumber;
}

export interface PlaceTradeDisplayParams extends NativePlaceTradeDisplayParams {
  expirationTime?: BigNumber;
}

export interface PlaceTradeParams extends NativePlaceTradeChainParams {
  expirationTime?: BigNumber;
}

export class Trade implements TradeAPI {
  private augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;
  }

  useZeroX(): boolean {
    return typeof this.augur.zeroX !== 'undefined';
  }

  private zeroX(): ZeroX {
    return this.augur.zeroX;
  }

  private onChain(): OnChainTrade {
    return this.augur.onChainTrade;
  }

  private maxExpirationTime(): BigNumber {
    return new BigNumber(2).exponentiatedBy(256).minus(1)
  }

  async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    const onChainTradeParams = this.getOnChainTradeParams(params);
    return this.placeOnChainTrade(onChainTradeParams);
  }

  private getOnChainTradeParams(params: PlaceTradeDisplayParams): NativePlaceTradeChainParams {
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

  private async placeOnChainTrade(params: PlaceTradeParams): Promise<void> {
    if (this.useZeroX()) {
      return this.zeroX().placeOnChainTrade({
        ...params,
        expirationTime: params.expirationTime || this.maxExpirationTime(),
      })
    } else {
      return this.onChain().placeOnChainTrade(params);
    }
  }

  async simulateTrade(params: PlaceTradeDisplayParams): Promise<SimulateTradeData> {
    if (this.useZeroX()) {
      return this.zeroX().simulateTrade({
        ...params,
        expirationTime: params.expirationTime || this.maxExpirationTime(),
      });
    } else {
      return this.onChain().simulateTrade(params);
    }
  }

  async simulateTradeGasLimit(params: PlaceTradeDisplayParams): Promise<BigNumber> {
    if (this.useZeroX()) {
      return this.zeroX().simulateTradeGasLimit({
        ...params,
        expirationTime: params.expirationTime || this.maxExpirationTime(),
      });
    } else {
      return this.onChain().simulateTradeGasLimit(params);
    }
  }
}
