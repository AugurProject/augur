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
import moment, { Moment } from 'moment';

export interface TradeAPI {
  useZeroX(): boolean
  simulateTrade(params: PlaceTradeDisplayParams): Promise<SimulateTradeData>
  simulateTradeGasLimit(params: NativePlaceTradeDisplayParams): Promise<BigNumber>
  placeTrade(params: PlaceTradeDisplayParams): Promise<boolean> // true if trade was placed
}

export interface SimulateTradeData extends ZeroXSimulateTradeData {
  loopLimit?: BigNumber;
}

export interface PlaceTradeDisplayParams extends NativePlaceTradeDisplayParams {
  expirationTime?: BigNumber;
  postOnly?: boolean;
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
    return !!this.augur.zeroX;
  }

  private get zeroX(): ZeroX {
    return this.augur.zeroX;
  }

  private get onChain(): OnChainTrade {
    return this.augur.onChainTrade;
  }

  private maxExpirationTime(): BigNumber {
    // expire in a year
    return new BigNumber(moment().unix() + 31557600);
  }

  async placeTrade(params: PlaceTradeDisplayParams): Promise<boolean> {
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

  private async placeOnChainTrade(params: PlaceTradeParams): Promise<boolean> {
    if (this.useZeroX()) {
      return this.zeroX.placeOnChainTrade({
        ...params,
        expirationTime: params.expirationTime || this.maxExpirationTime(),
      })
    } else {
      console.log('Not using 0x');
      return this.onChain.placeOnChainTrade(params);
    }
  }

  async simulateTrade(params: PlaceTradeDisplayParams): Promise<SimulateTradeData> {
    if (this.useZeroX()) {
      return this.zeroX.simulateTrade({
        ...params,
        expirationTime: params.expirationTime || this.maxExpirationTime(),
      });
    } else {
      console.log("Not using 0x");
      return this.onChain.simulateTrade(params);
    }
  }

  async simulateTradeGasLimit(params: PlaceTradeDisplayParams): Promise<BigNumber> {
    if (this.useZeroX()) {
      return this.zeroX.simulateTradeGasLimit({
        ...params,
        expirationTime: params.expirationTime || this.maxExpirationTime(),
      });
    } else {
      console.log("Not using 0x");
      return this.onChain.simulateTradeGasLimit(params);
    }
  }
}
