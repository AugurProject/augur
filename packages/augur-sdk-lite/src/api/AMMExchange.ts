import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';

import { binarySearch, bnDirection } from '@augurproject/utils';
import { AMMExchangeAbi } from '../abi/AMMExchangeAbi';
import {NULL_ADDRESS, SignerOrProvider, YES_NO_NUMTICKS} from '../constants';

export class AMMExchange {
  readonly contract: ethers.Contract;
  readonly address: string;

  constructor(signerOrProvider: SignerOrProvider, address: string) {
    this.contract = new ethers.Contract(address, AMMExchangeAbi, signerOrProvider);
    this.address = address;
  }

  // Ratio of Yes:No shares.
  async price(): Promise<BigNumber> {
    const { _no, _yes } = this.contract.yesNoShareBalances(this.contract.address);
    return _yes.div(_no);
  }

  async enterPosition(shares: Shares, yes: boolean, rate = false): Promise<BigNumber> {
    const cash = await binarySearch(
      new BigNumber(1),
      new BigNumber(shares.times(YES_NO_NUMTICKS)),
      100,
      async (cash) => {
        const yesShares = await this.contract.rateEnterPosition(cash, yes);
        return bnDirection(shares, yesShares);
      }
    );
    if (!rate) await this.contract.enterPosition(cash, yes, shares);
    return cash;
  }

  async exitPosition(invalidShares: Shares, noShares: Shares, yesShares: Shares) {
    const { _cashPayout } = await this.contract.rateExitPosition(invalidShares, noShares, yesShares);
    await this.contract.exitPosition(invalidShares, noShares, yesShares, _cashPayout);
  }

  async exitAll(): Promise<Cash> {
    const { _cashPayout } = await this.contract.rateExitAll();
    await this.contract.exitAll(_cashPayout);
    return _cashPayout;
  }

  async swapForYes(noShares: Shares): Promise<Shares> {
    return this.swap(noShares, false);
  }

  async swapForNo(yesShares: Shares): Promise<Shares> {
    return this.swap(yesShares, true);
  }

  async swap(inputShares: Shares, inputYes: boolean): Promise<Shares> {
    const noShares = await this.contract.rateSwap(inputShares, inputYes);
    await this.contract.swap(inputShares, inputYes, noShares);
    return noShares;
  }

  async addLiquidity(yesShares: Shares, noShares: Shares = null): Promise<LPTokens> {
    if (noShares === null || yesShares.eq(noShares)) { // buy into liquidity at 1:1 ratio
      const sets = yesShares;
      const events = await this.contract.addLiquidity(sets);
      const mintEvent = events.filter((event) => event.name === 'Transfer' && (event.parameters as any).from === NULL_ADDRESS)[0];
      const lpTokens = (mintEvent as any).value;
      return lpTokens;
    }

    const swapForYes = yesShares.gt(noShares);
    const minBuy = BigNumber.min(noShares, yesShares);
    const maxBuy = BigNumber.max(noShares, yesShares);

    const setsBought = await binarySearch(
      minBuy,
      maxBuy,
      100,
      async (setsToBuy) => {
        const setsToSell = setsToBuy.minus(minBuy);
        const {_yesses, _nos} = await this.contract.sharesRateForAddLiquidityThenSwap(setsToBuy, swapForYes, setsToSell);
        return swapForYes ? bnDirection(yesShares, _yesses) : bnDirection(noShares, _nos);
      }
    );

    const setsSwapped = setsBought.minus(minBuy);

    const lpTokens = await this.contract.rateAddLiquidityThenSwap(setsBought, swapForYes, setsSwapped);
    await this.contract.addLiquidityThenSwap(setsBought, swapForYes, setsSwapped);
    return lpTokens;
  }

  async removeLiquidity(lpTokens: LPTokens, alsoSell = false): Promise<RemoveLiquidityReturn> {
    // if not selling them minSetsSold is 0
    // if selling them calculate how many sets you could get, then sell that many

    let minSetsSold: Sets;
    if (alsoSell) {
      // Selling more than zero sets sells as many sets as possible. So one atto set is enough to get the rate.
      const { _setsSold } = await this.contract.rateRemoveLiquidity(lpTokens, new BigNumber(1));
      minSetsSold = _setsSold;
    } else {
      minSetsSold = new BigNumber(0);
    }

    const removedLiquidity = await this.contract.rateRemoveLiquidity(lpTokens, minSetsSold);
    await this.contract.removeLiquidity(lpTokens, minSetsSold);
    return removedLiquidity;
  }
}

export interface RemoveLiquidityReturn {
  _invalidShare: Shares,
  _noShare: Shares,
  _yesShare: Shares,
  _setsSold: Sets,
}

export type LPTokens = BigNumber;
export type Shares = BigNumber;
export type Sets = BigNumber;
export type Cash = BigNumber;
